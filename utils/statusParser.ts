// 解析LLM响应中的状态数据块
import { CharacterDynamicData, GameEvent } from '../types';

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
    // 事件更新 - Event updates from LLM
    eventUpdates?: GameEvent[];
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

    // 解析事件更新 - Parse event updates section
    const eventUpdates = parseEventUpdates(statusContent);
    if (eventUpdates.length > 0) {
        status.eventUpdates = eventUpdates;
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
 * 获取默认的角色动态数据 - 与 worldBook.json [initvar]变量初始化 保持同步
 * Get default character dynamics data for all 8 main characters - synced with worldBook.json
 */
export function getDefaultCharacterDynamics(): Record<string, CharacterDynamicData> {
    return {
        '埃莉诺': {
            location: '巴别塔 - 教室前排',
            clothing: '学院制服长袍，领口系着代表"优等生"的丝带',
            activity: '端庄地坐在第一排，羽毛笔飞快地记录着笔记，偶尔优雅地举手提问',
            thought: '父亲的眼神像鹰一样盯着所有人...我必须表现得完美无缺。',
            affection: 15
        },
        '关祁': {
            location: '巴别塔 - 教室后排',
            clothing: '学院制服长袍，但袖口露出了里面精致的中式丝绸衬里',
            activity: '半靠在椅背上转动着银条，眼神迷离地看着窗外的雾气，似乎在神游',
            thought: '哈欠...这鬼天气真让人犯困。昨晚的茶不该喝那么浓的。',
            affection: 0
        },
        '海因里希': {
            location: '巴别塔 - 教室角落',
            clothing: '即使是校服也穿得像军装一样笔挺，扣子扣到最上面一颗',
            activity: '笔直地坐在角落里，虽然没做笔记，但目光如炬地盯着黑板',
            thought: '英国人的效率太低了。这堂课的内容我五岁时就已经掌握了。',
            affection: 0
        },
        '索菲亚': {
            location: '巴别塔 - 教室窗边',
            clothing: '学院制服长袍，袖子随意挽起，露出苍白的手腕',
            activity: '手里转着银条，眼神冷冷地扫过讲台上的威廉，嘴角带着一丝嘲讽',
            thought: '这种把语言当作工具的教学...简直是对灵魂的亵渎。但为了力量，我必须忍受。',
            affection: 0
        },
        '源结月': {
            location: '巴别塔 - 教室中排',
            clothing: '学院制服长袍，腰间系着带有家族纹饰的熏香袋',
            activity: '正在反复小声练习刚才教授演示的咒语，眉头微锁，追求完美的语调',
            thought: '这个发音的共鸣频率...如果稍微调整一下，是不是能产生更锋利的效果？',
            affection: 0
        },
        '佩德罗': {
            location: '巴别塔 - 教室后排',
            clothing: '学院制服长袍，但领带系得歪歪扭扭，充满了热带的慵懒',
            activity: '正在给旁边的人传纸条，脸上挂着漫不经心的迷人微笑',
            thought: '嘿，坐在前面的那个法国妞真辣...还有多久才下课？我想去喝酒了。',
            affection: 0
        },
        '科莱特': {
            location: '巴别塔 - 教室后门',
            clothing: '深紫色的助教长袍，剪裁极其修身，散发着迷人的香气',
            activity: '靠在教室后门的门框上旁听，手里夹着一支未点燃的细长香烟，饶有兴致地观察着学生们',
            thought: '威廉的教学风格还是这么乏味...不过这些年轻的灵魂倒是充满了欲望的味道。',
            affection: 0
        },
        '威廉': {
            location: '巴别塔 - 教室讲台',
            clothing: '深红色的教授长袍，领口别着金色的帝国徽章',
            activity: '站在黑板前，用力敲击着讲台，试图压过窗外的雷声',
            thought: '让我看看今年的新生里有没有可塑之才...尤其是我的这把"新匕首"。',
            affection: 15
        }
    };
}

/**
 * 解析事件更新数据
 * Parse event updates from status content
 * 
 * Expected format:
 * 事件更新:
 * - headline|1830年9月2日 · 早报|标题|内容摘要
 * - social|1830年9月2日 · 社交版|标题|内容摘要
 */
export function parseEventUpdates(statusContent: string): GameEvent[] {
    const result: GameEvent[] = [];

    // 查找"事件更新:"段落
    const eventMatch = statusContent.match(/事件更新:\s*([\s\S]*?)(?=\n[^\-\s]|$)/);
    if (!eventMatch) {
        return result;
    }

    const eventContent = eventMatch[1];
    const lines = eventContent.split('\n').filter(line => line.trim().startsWith('-'));

    for (const line of lines) {
        try {
            // 移除开头的"- "
            const cleanLine = line.replace(/^-\s*/, '').trim();
            if (!cleanLine) continue;

            // 用"|"分割各字段: type|timestamp|title|content
            const parts = cleanLine.split('|');
            if (parts.length < 4) continue;

            const eventType = parts[0].trim().toLowerCase() as GameEvent['type'];
            const timestamp = parts[1].trim();
            const title = parts[2].trim();
            const content = parts[3].trim();

            // 验证类型有效性
            if (!['headline', 'social', 'secret', 'system'].includes(eventType)) {
                console.warn('Invalid event type:', eventType);
                continue;
            }

            result.push({
                id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: eventType,
                timestamp,
                title,
                content,
                isNew: true,
                isLocked: false
            });
        } catch (e) {
            console.warn('Failed to parse event line:', line, e);
        }
    }

    return result;
}
