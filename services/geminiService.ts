import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// 从localStorage获取API配置
const getApiConfig = () => {
  const apiKey = localStorage.getItem('babel_api_key') || '';
  const model = localStorage.getItem('babel_llm_model') || 'gemini-2.5-flash';
  return { apiKey, model };
};

export const sendMessageToGemini = async (
  history: { role: string; content: string }[],
  newMessage: string,
  dynamicContext?: string
): Promise<string> => {
  const { apiKey, model } = getApiConfig();

  // 检查API Key是否已配置
  if (!apiKey) {
    return '（尚未配置 API Key。请点击顶部导航栏的【设置】按钮，输入您的 Google Gemini API Key 后再试。）';
  }

  try {
    // 动态创建API客户端（使用用户配置的API Key）
    const ai = new GoogleGenAI({ apiKey });

    // 限制历史记录长度，只保留最近的20条消息（约10轮对话）
    const MAX_HISTORY = 20;
    const MAX_INPUT_TOKENS = 100000; // 用户设定的输入限制

    // 简单的字符估算 (1 token ≈ 4 chars for English, ~1-2 chars for Chinese)
    // 为了安全起见，我们假设平均 1 char = 1 token 来做保守限制
    let limitedHistory = history.slice(-MAX_HISTORY);

    // 额外的 Token 限制检查
    let currentLength = 0;
    const truncatedHistory: typeof history = [];

    // 从后往前添加，直到达到限制
    for (let i = limitedHistory.length - 1; i >= 0; i--) {
      const msg = limitedHistory[i];
      const msgLen = msg.content.length; // 粗略估算
      if (currentLength + msgLen > MAX_INPUT_TOKENS) {
        break;
      }
      currentLength += msgLen;
      truncatedHistory.unshift(msg);
    }

    // 转换历史消息格式
    const historyForModel = truncatedHistory.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Inject dynamic World Info if available
    const finalSystemInstruction = dynamicContext
      ? `${SYSTEM_INSTRUCTION}\n\n=== WORLD INFO / 世界书 ===\n${dynamicContext}`
      : SYSTEM_INSTRUCTION;

    // 创建聊天会话
    const chatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.8,
        topK: 40,
        maxOutputTokens: 8000,  // 增加到8000以支持1000-2000中文字（每字约2-3 tokens）
      },
      history: historyForModel
    });

    // 发送消息并获取响应
    const result = await chatSession.sendMessage({ message: newMessage });
    return result.text || '（命运的迷雾遮蔽了回应……请重试。）';

  } catch (error: any) {
    console.error("Gemini Interaction Error:", error);

    // 提供更详细的错误信息
    if (error?.message?.includes('API key')) {
      return '（API Key 无效或已过期。请在设置中检查您的 API Key。）';
    }
    if (error?.message?.includes('quota')) {
      return '（API 配额已用尽。请稍后再试或更换 API Key。）';
    }
    if (error?.message?.includes('model')) {
      return '（模型不可用。请在设置中选择其他模型。）';
    }

    return '（以太网络连接中断，无法连接到命运织布机。请检查您的网络连接和 API 配置。）';
  }
};

// 检查API是否已配置
export const isApiConfigured = (): boolean => {
  const { apiKey } = getApiConfig();
  return !!apiKey;
};