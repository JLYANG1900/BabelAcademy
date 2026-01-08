// 解析LLM响应中的状态数据块
import { CharacterDynamicData } from '../types';

export interface ParsedStatus {
    time?: string;
    period?: string;
    location?: string;
    weather?: string;
    clothing?: string;
    coins?: number;
    // 三维属性
    empireContribution?: number;
    clubContribution?: number;
    suspicion?: number;
    // 行动建议
    actions?: string[];
    // 角色动态数据 - Dynamic character data from LLM
    characterDynamics?: Record<string, CharacterDynamicData>;
}

// 从LLM响应中提取状态数据块
export function parseStatusBlock(response: string): { content: string; status: ParsedStatus | null } {
    // 匹配 ```status ... ``` 代码块
    const statusRegex = /```status\s*\n([\s\S]*?)```/;
    const match = response.match(statusRegex);

    if (!match) {
        return { content: response, status: null };
    }

    const statusContent = match[1];
    const cleanContent = response.replace(statusRegex, '').trim();

    // 解析状态字段
    const status: ParsedStatus = {};

    const lines = statusContent.split('\n');
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        switch (key) {
            case '时间':
                status.time = value;
                break;
            case '时段':
                status.period = value;
                break;
            case '地点':
                status.location = value;
                break;
            case '天气':
                status.weather = value;
                break;
            case '服装':
                status.clothing = value;
                break;
            case '银币':
                const coins = parseInt(value, 10);
                if (!isNaN(coins)) {
                    status.coins = coins;
                }
                break;
            case '帝国贡献':
                const empire = parseInt(value, 10);
                if (!isNaN(empire)) {
                    status.empireContribution = Math.max(0, Math.min(100, empire));
                }
                break;
            case '社团声望':
                const club = parseInt(value, 10);
                if (!isNaN(club)) {
                    status.clubContribution = Math.max(0, Math.min(100, club));
                }
                break;
            case '怀疑度':
                const susp = parseInt(value, 10);
                if (!isNaN(susp)) {
                    status.suspicion = Math.max(0, Math.min(100, susp));
                }
                break;
            case '行动1':
                if (!status.actions) status.actions = [];
                if (value) status.actions[0] = value;
                break;
            case '行动2':
                if (!status.actions) status.actions = [];
                if (value) status.actions[1] = value;
                break;
            case '行动3':
                if (!status.actions) status.actions = [];
                if (value) status.actions[2] = value;
                break;
        }
    }

    // 解析角色动态数据 - Parse character dynamics section
    const charDynamics = parseCharacterDynamics(statusContent);
    if (Object.keys(charDynamics).length > 0) {
        status.characterDynamics = charDynamics;
    }

    return { content: cleanContent, status };
}

/**
 * 解析角色动态数据块
 * Parse character dynamics data from status content
 * 
 * 预期格式 / Expected format:
 * 角色动态:
 * - 埃莉诺|位置=诺曼庄园|穿着=深色晚礼服|行动=与贵族交谈|想法=伪善...|好感度=45
 * - 关祁|位置=金狮茶室|穿着=松垮西装|行动=品茶阅报|想法=无聊...|好感度=60
 */
export function parseCharacterDynamics(statusContent: string): Record<string, CharacterDynamicData> {
    const result: Record<string, CharacterDynamicData> = {};

    // 查找"角色动态:"段落
    const dynamicsMatch = statusContent.match(/角色动态:\s*([\s\S]*?)(?=\n[^\-\s]|$)/);
    if (!dynamicsMatch) {
        return result;
    }

    const dynamicsContent = dynamicsMatch[1];
    const lines = dynamicsContent.split('\n').filter(line => line.trim().startsWith('-'));

    for (const line of lines) {
        try {
            // 移除开头的"- "
            const cleanLine = line.replace(/^-\s*/, '').trim();
            if (!cleanLine) continue;

            // 用"|"分割各字段
            const parts = cleanLine.split('|');
            if (parts.length < 2) continue;

            // 第一个字段是角色名
            const characterName = parts[0].trim();
            if (!characterName) continue;

            // 解析其他字段
            const data: Partial<CharacterDynamicData> = {
                location: '未知',
                clothing: '未知',
                activity: '未知',
                thought: '未知',
                affection: 50
            };

            for (let i = 1; i < parts.length; i++) {
                const part = parts[i].trim();
                const eqIndex = part.indexOf('=');
                if (eqIndex === -1) continue;

                const fieldKey = part.substring(0, eqIndex).trim();
                const fieldValue = part.substring(eqIndex + 1).trim();

                switch (fieldKey) {
                    case '位置':
                        data.location = fieldValue;
                        break;
                    case '穿着':
                        data.clothing = fieldValue;
                        break;
                    case '行动':
                        data.activity = fieldValue;
                        break;
                    case '想法':
                        data.thought = fieldValue;
                        break;
                    case '好感度':
                        const affection = parseInt(fieldValue, 10);
                        if (!isNaN(affection)) {
                            data.affection = Math.max(0, Math.min(100, affection));
                        }
                        break;
                }
            }

            result[characterName] = data as CharacterDynamicData;
        } catch (e) {
            // 解析单行失败，继续处理下一行
            console.warn('Failed to parse character dynamics line:', line, e);
        }
    }

    return result;
}

// 格式化时间显示（结合时间和时段）
export function formatTimeDisplay(time?: string, period?: string): string {
    if (time && period) {
        return `${time} · ${period}`;
    }
    return time || period || '--:--';
}

/**
 * 获取默认的角色动态数据
 * Get default character dynamics data for all 8 main characters
 */
export function getDefaultCharacterDynamics(): Record<string, CharacterDynamicData> {
    const defaultData: CharacterDynamicData = {
        location: '未知',
        clothing: '学院制服',
        activity: '未知',
        thought: '...',
        affection: 50
    };

    return {
        '埃莉诺': { ...defaultData, location: '巴别塔-教室前排', clothing: '学院制服(优等生)', activity: '正在记笔记', thought: '必须表现得完美无缺', affection: 45 },
        '关祁': { ...defaultData, location: '巴别塔-教室后排', clothing: '学院制服(内衬丝绸)', activity: '转笔神游', thought: '好困...昨晚不该熬夜', affection: 60 },
        '海因里希': { ...defaultData, location: '巴别塔-教室角落', clothing: '学院制服(笔挺)', activity: '盯着黑板', thought: '这也太简单了', affection: 30 },
        '索菲亚': { ...defaultData, location: '巴别塔-教室窗边', clothing: '学院制服(挽起袖口)', activity: '把玩银条', thought: '这就是帝国的洗脑教育', affection: 55 },
        '源结月': { ...defaultData, location: '巴别塔-教室中排', clothing: '学院制服(系着香囊)', activity: '练习发音', thought: '再完美一点...', affection: 35 },
        '佩德罗': { ...defaultData, location: '巴别塔-教室后排', clothing: '学院制服(歪领带)', activity: '传纸条', thought: '下课去哪喝酒？', affection: 70 },
        '科莱特': { ...defaultData, location: '巴别塔-教室后门', clothing: '深紫助教袍', activity: '旁听观察', thought: '年轻的欲望真有趣', affection: 40 },
        '威廉': { ...defaultData, location: '巴别塔-教室讲台', clothing: '深红教授袍', activity: '敲击讲台', thought: '这届新生有些意思', affection: 50 }
    };
}

