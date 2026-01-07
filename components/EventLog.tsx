import React, { useState } from 'react';
import {
    Newspaper, Users, Lock, Bell,
    ChevronDown, ChevronUp, Clock, Filter
} from 'lucide-react';

// 事件类型定义
interface GameEvent {
    id: string;
    type: 'headline' | 'social' | 'secret' | 'system';
    timestamp: string;
    title: string;
    content: string;
    isNew?: boolean;
    isLocked?: boolean;
}

// 事件类型配置
const EVENT_TYPE_CONFIG = {
    headline: {
        icon: Newspaper,
        label: '头条新闻',
        color: 'text-crimson',
        bgColor: 'bg-crimson/10',
        borderColor: 'border-crimson'
    },
    social: {
        icon: Users,
        label: '社会版',
        color: 'text-academy',
        bgColor: 'bg-academy/10',
        borderColor: 'border-academy'
    },
    secret: {
        icon: Lock,
        label: '密报',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500'
    },
    system: {
        icon: Bell,
        label: '系统提示',
        color: 'text-gold',
        bgColor: 'bg-gold/10',
        borderColor: 'border-gold'
    }
};

// 示例事件数据
const SAMPLE_EVENTS: GameEvent[] = [
    {
        id: '1',
        type: 'headline',
        timestamp: '1830年11月15日 · 早报',
        title: '皇家翻译学院迎来新学期开学典礼',
        content: '威廉·诺曼教授在巴别塔大厅发表开学演讲，强调"语言是帝国的基石，翻译是文明的桥梁"。全体一年级新生参加了刻银术入门仪式。',
        isNew: true
    },
    {
        id: '2',
        type: 'social',
        timestamp: '1830年11月14日 · 晚报',
        title: '诺曼庄园举办秋季舞会',
        content: '威廉·诺曼教授在其家族庄园举办了一场盛大的秋季舞会。据悉，多位外国使节的子女出席了活动。埃莉诺·诺曼小姐的舞姿成为当晚焦点。',
        isNew: false
    },
    {
        id: '3',
        type: 'system',
        timestamp: '系统通知',
        title: '帝国贡献度提升',
        content: '由于按时完成法务部实习任务，你的帝国贡献度提升了5点。当前：45% → 50%',
        isNew: true
    },
    {
        id: '4',
        type: 'secret',
        timestamp: '匿名情报',
        title: '【加密】赫耳墨斯社会议通知',
        content: '今晚子时，图书馆地下室。暗号：「鹦鹉学舌」。——Ψ',
        isNew: false,
        isLocked: false // 已解锁的密报
    },
    {
        id: '5',
        type: 'secret',
        timestamp: '匿名情报',
        title: '【未解锁】需要更高的社团贡献度',
        content: '???????????????????????????',
        isNew: false,
        isLocked: true // 未解锁的密报
    },
    {
        id: '6',
        type: 'headline',
        timestamp: '1830年11月13日 · 号外',
        title: '南安普顿港发生爆炸事故',
        content: '帝国皇家海军"凯旋号"战列舰在港口发生不明原因爆炸。官方声称是银条储存不当导致的意外，但有目击者称看到了可疑人物逃离现场。巴别塔加强了安保措施。',
        isNew: false
    },
    {
        id: '7',
        type: 'social',
        timestamp: '1830年11月12日 · 晚报',
        title: '海因里希·冯·克莱斯特在刻银术考试中获得满分',
        content: '来自普鲁士的留学生海因里希在实用类魔法考试中展现惊人天赋。威廉教授亲自表示赞赏，称其"将成为不列颠尼亚与普鲁士友谊的桥梁"。',
        isNew: false
    },
    {
        id: '8',
        type: 'system',
        timestamp: '系统通知',
        title: '怀疑度上升警告',
        content: '由于深夜出现在禁区附近，你的怀疑度上升了3点。当前：12% → 15%。请谨慎行事。',
        isNew: false
    }
];

// 事件卡片组件
const EventCard: React.FC<{
    event: GameEvent;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ event, isExpanded, onToggle }) => {
    const config = EVENT_TYPE_CONFIG[event.type];
    const Icon = config.icon;

    return (
        <div
            className={`border-l-4 ${config.borderColor} bg-white/50 shadow-sm transition-all hover:shadow-md cursor-pointer ${event.isLocked ? 'opacity-60' : ''
                }`}
            onClick={onToggle}
        >
            {/* 头部 */}
            <div className="p-3 flex items-start gap-3">
                {/* 类型图标 */}
                <div className={`p-2 rounded-sm ${config.bgColor} ${config.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {event.isNew && (
                            <span className="px-1.5 py-0.5 bg-crimson text-white text-[9px] font-bold uppercase">
                                NEW
                            </span>
                        )}
                        <span className={`text-[10px] font-bold uppercase ${config.color}`}>
                            {config.label}
                        </span>
                    </div>

                    <h3 className={`font-display font-bold text-ink ${event.isLocked ? 'blur-sm' : ''}`}>
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-ink/50">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{event.timestamp}</span>
                    </div>
                </div>

                {/* 展开图标 */}
                <div className="text-ink/30 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* 展开的详细内容 */}
            {isExpanded && !event.isLocked && (
                <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="pl-11 border-t border-ink/10 pt-3">
                        <p className="text-sm text-ink/80 leading-relaxed font-serif">
                            {event.content}
                        </p>
                    </div>
                </div>
            )}

            {/* 锁定提示 */}
            {isExpanded && event.isLocked && (
                <div className="px-3 pb-3 pt-0">
                    <div className="pl-11 border-t border-ink/10 pt-3">
                        <p className="text-sm text-crimson italic flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            需要更高的社团贡献度才能查看此密报
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// 主组件
interface EventLogProps {
    events?: GameEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events = SAMPLE_EVENTS }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'headline' | 'social' | 'secret' | 'system'>('all');

    const filteredEvents = filterType === 'all'
        ? events
        : events.filter(e => e.type === filterType);

    const newCount = events.filter(e => e.isNew).length;

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* 报纸风格标题 */}
            <div className="text-center border-b-4 border-double border-ink pb-4">
                <div className="flex justify-between items-end border-b border-ink mb-2 pb-1 text-[10px] font-bold tracking-widest uppercase text-ink/60">
                    <span>Est. 1842</span>
                    <span>Vol. XCII</span>
                </div>
                <h1 className="font-display text-4xl font-black text-ink tracking-tight uppercase leading-[0.9] mb-2">
                    The Babel<br /><span className="text-3xl">Daily</span>
                </h1>
                <p className="text-sm text-ink/60 font-serif italic">事件日志 · Event Chronicle</p>
                {newCount > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-crimson text-white text-xs font-bold">
                        <Bell className="w-3 h-3" />
                        {newCount} 条新消息
                    </div>
                )}
            </div>

            {/* 过滤器 */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-ink/50" />
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 text-xs font-bold border transition-colors ${filterType === 'all'
                        ? 'bg-ink text-parchment border-ink'
                        : 'bg-transparent text-ink border-ink/20 hover:border-ink'
                        }`}
                >
                    全部
                </button>
                {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    const count = events.filter(e => e.type === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterType(key as any)}
                            className={`px-3 py-1 text-xs font-bold border transition-colors flex items-center gap-1 ${filterType === key
                                ? `${config.bgColor} ${config.color} ${config.borderColor}`
                                : 'bg-transparent text-ink border-ink/20 hover:border-ink'
                                }`}
                        >
                            <Icon className="w-3 h-3" />
                            {config.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* 事件列表 */}
            <div className="space-y-3">
                {filteredEvents.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        isExpanded={expandedId === event.id}
                        onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-ink/40">
                    <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="font-serif italic">暂无此类事件记录</p>
                </div>
            )}

            {/* 底部装饰 */}
            <div className="text-center text-ink/30 text-sm font-mono pt-4 border-t border-ink/10">
                ❖ FIN ❖
            </div>
        </div>
    );
};
