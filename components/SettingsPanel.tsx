import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, Check, AlertCircle, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

interface SettingsPanelProps {
    onApiKeyChange?: (apiKey: string) => void;
}

// 支持的LLM模型
const LLM_MODELS = [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onApiKeyChange }) => {
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const [isSaved, setIsSaved] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    // 从localStorage加载保存的设置
    useEffect(() => {
        const savedApiKey = localStorage.getItem('babel_api_key');
        const savedModel = localStorage.getItem('babel_llm_model');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            setIsSaved(true);
        }
        if (savedModel) {
            setSelectedModel(savedModel);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('babel_api_key', apiKey);
        localStorage.setItem('babel_llm_model', selectedModel);
        setIsSaved(true);
        onApiKeyChange?.(apiKey);

        // 显示保存成功提示
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleTestConnection = async () => {
        if (!apiKey) {
            setTestStatus('error');
            return;
        }

        setTestStatus('testing');

        try {
            // 简单的API测试 - 尝试初始化并发送一个简单请求
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

            if (response.ok) {
                setTestStatus('success');
            } else {
                setTestStatus('error');
            }
        } catch (error) {
            setTestStatus('error');
        }

        // 3秒后重置状态
        setTimeout(() => setTestStatus('idle'), 3000);
    };

    const handleDelete = () => {
        localStorage.removeItem('babel_api_key');
        localStorage.removeItem('babel_llm_model');
        setApiKey('');
        setSelectedModel('gemini-2.5-flash');
        setIsSaved(false);
        setTestStatus('idle');
        onApiKeyChange?.('');
    };

    const maskedApiKey = apiKey ? `${apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}` : '';

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* 标题 */}
            <div className="text-center border-b border-ink/20 pb-4">
                <div className="inline-flex items-center gap-2">
                    <Settings className="w-6 h-6 text-gold" />
                    <h2 className="font-display text-2xl font-bold text-ink tracking-wider uppercase">
                        设置
                    </h2>
                </div>
                <p className="text-sm text-ink/60 font-serif italic mt-1">Settings & Configuration</p>
            </div>

            {/* API Key 配置 */}
            <div className="bg-white/50 border-2 border-ink/20 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                    <Key className="w-5 h-5 text-gold" />
                    <h3 className="font-display font-bold text-ink">LLM 接口配置</h3>
                </div>

                {/* API Key 输入 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink/70">
                        Google Gemini API Key
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setIsSaved(false);
                                }}
                                placeholder="输入您的 API Key..."
                                className="w-full px-4 py-2 border-2 border-ink/20 bg-parchment text-ink font-mono text-sm focus:border-gold focus:outline-none transition-colors"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-mono"
                            >
                                {showKey ? '隐藏' : '显示'}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-ink/50">
                        您的 API Key 将安全存储在本地浏览器中，不会上传到任何服务器。
                    </p>
                </div>

                {/* 模型选择 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink/70">
                        选择模型
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setIsSaved(false);
                        }}
                        className="w-full px-4 py-2 border-2 border-ink/20 bg-parchment text-ink font-mono text-sm focus:border-gold focus:outline-none transition-colors cursor-pointer"
                    >
                        {LLM_MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name} ({model.provider})
                            </option>
                        ))}
                    </select>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-ink/10">
                    <button
                        onClick={handleTestConnection}
                        disabled={!apiKey || testStatus === 'testing'}
                        className={`flex items-center gap-2 px-4 py-2 border-2 font-display font-bold text-sm transition-all ${testStatus === 'testing'
                            ? 'border-gold/50 text-gold/50 cursor-wait'
                            : testStatus === 'success'
                                ? 'border-green-500 text-green-600 bg-green-50'
                                : testStatus === 'error'
                                    ? 'border-crimson text-crimson bg-crimson/10'
                                    : 'border-ink/30 text-ink hover:border-gold hover:text-gold'
                            }`}
                    >
                        {testStatus === 'testing' ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : testStatus === 'success' ? (
                            <Check className="w-4 h-4" />
                        ) : testStatus === 'error' ? (
                            <AlertCircle className="w-4 h-4" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {testStatus === 'testing' ? '测试中...' :
                            testStatus === 'success' ? '连接成功' :
                                testStatus === 'error' ? '连接失败' : '测试连接'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!apiKey}
                        className={`flex items-center gap-2 px-6 py-2 font-display font-bold text-sm transition-all ${isSaved
                            ? 'bg-green-600 text-white'
                            : apiKey
                                ? 'bg-ink text-parchment hover:bg-gold'
                                : 'bg-ink/30 text-ink/50 cursor-not-allowed'
                            }`}
                    >
                        {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaved ? '已保存' : '保存设置'}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={!apiKey}
                        className={`flex items-center gap-2 px-4 py-2 border-2 font-display font-bold text-sm transition-all ${apiKey
                                ? 'border-crimson text-crimson hover:bg-crimson hover:text-white'
                                : 'border-ink/20 text-ink/30 cursor-not-allowed'
                            }`}
                    >
                        <Trash2 className="w-4 h-4" />
                        删除配置
                    </button>
                </div>
            </div>

            {/* 使用说明 */}
            <div className="bg-gold/5 border border-gold/30 p-4">
                <h4 className="font-display font-bold text-sm text-ink mb-2">📖 如何获取 API Key？</h4>
                <ol className="text-sm text-ink/70 space-y-1 list-decimal list-inside">
                    <li>访问 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-crimson">Google AI Studio</a></li>
                    <li>登录您的 Google 账户</li>
                    <li>点击 "Create API key" 创建新的 API Key</li>
                    <li>复制生成的 Key 并粘贴到上方输入框</li>
                </ol>
            </div>

            {/* 当前状态 */}
            {apiKey && (
                <div className="bg-ink/5 border border-ink/10 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-ink">当前配置</p>
                        <p className="text-xs text-ink/60 font-mono mt-1">
                            API Key: {maskedApiKey}
                        </p>
                        <p className="text-xs text-ink/60 font-mono">
                            模型: {LLM_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-crimson'}`}></div>
                        <span className="text-xs text-ink/60">{apiKey ? '已配置' : '未配置'}</span>
                    </div>
                </div>
            )}

            {/* 底部装饰 */}
            <div className="text-center text-ink/30 text-sm font-mono pt-4 border-t border-ink/10">
                ❖ BABEL CONFIGURATION SYSTEM ❖
            </div>
        </div>
    );
};
