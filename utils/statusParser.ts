// 解析LLM响应中的状态数据块
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

    return { content: cleanContent, status };
}

// 格式化时间显示（结合时间和时段）
export function formatTimeDisplay(time?: string, period?: string): string {
    if (time && period) {
        return `${time} · ${period}`;
    }
    return time || period || '--:--';
}
