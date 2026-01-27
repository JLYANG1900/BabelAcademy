import React, { useState } from 'react';
import {
    Newspaper, Users, Lock, Bell,
    ChevronDown, ChevronUp, Clock, Filter
} from 'lucide-react';
import { GameEvent } from '../types';

// 事件类型配置
const EVENT_TYPE_CONFIG = {
    headline: {
        icon: Newspaper,
        label: 'HEADLINE',
        labelCn: '头条'
    },
    social: {
        icon: Users,
        label: 'SOCIETY',
        labelCn: '社会'
    },
    secret: {
        icon: Lock,
        label: 'CLASSIFIED',
        labelCn: '密报'
    },
    system: {
        icon: Bell,
        label: 'NOTICE',
        labelCn: '通知'
    }
};

// 示例事件数据
const SAMPLE_EVENTS: GameEvent[] = [
    {
        id: '1',
        type: 'headline',
        timestamp: '1830年9月2日 · 早报',
        title: '皇家翻译学院新学期正式开课',
        content: '巴别塔迎来新学期首日，来自世界各地的语言天才齐聚牛津。据悉，本届新生阵容堪称豪华，包括普鲁士军官、日本贵族、俄国流亡公主等。威廉·诺曼教授将亲自执教开学第一课。',
        isNew: true
    },
    {
        id: '2',
        type: 'headline',
        timestamp: '1830年9月2日 · 早报',
        title: '威廉·诺曼教授发表开学第一课',
        content: '诺曼教授在教室中强调："语言是帝国的基石，翻译是文明的桥梁。"他演示了基础刻银术，银条在他手中泛着冷冽的光芒。',
        isNew: true
    },
    {
        id: '3',
        type: 'social',
        timestamp: '1830年9月2日 · 早报',
        title: '今年新生阵容豪华，多国贵族子弟云集',
        content: '本届巴别塔新生堪称"万国博览"：关祁是大清两广总督之子，海因里希曾是普鲁士军官，索菲亚来自俄国流亡贵族家庭。',
        isNew: false
    },
    {
        id: '4',
        type: 'social',
        timestamp: '1830年9月2日 · 早报',
        title: '源结月小姐的和服引发课堂侧目',
        content: '尽管穿着学院制服，但源结月腰间系着的熏香袋引起了不少同学的好奇。',
        isNew: false
    },
    {
        id: '5',
        type: 'secret',
        timestamp: '1830年9月1日 · 晚报',
        title: '【加密】「赫耳墨斯社」欢迎新成员',
        content: '如果你渴望自由而非枷锁，如果你相信语言不应成为帝国的武器——我们在暗处等你。寻找墙上的Ψ符号。——赫耳墨斯社',
        isNew: false,
        isLocked: false
    },
    {
        id: '6',
        type: 'secret',
        timestamp: '1830年9月1日 · 晚报',
        title: '【未解锁】关于"复仇女神号"的传闻',
        content: '???????????????????????????',
        isNew: false,
        isLocked: true
    },
    {
        id: '7',
        type: 'system',
        timestamp: '1830年9月1日 · 系统',
        title: '开学典礼已结束，请前往教室报到',
        content: '欢迎加入皇家翻译学院。请于明日上午九时前往六楼教室参加新学期第一课。',
        isNew: false
    },
    {
        id: '8',
        type: 'system',
        timestamp: '1830年9月1日 · 系统',
        title: '学院制服已发放，请注意仪容规范',
        content: '您的学院制服长袍已放置于宿舍衣柜。巴别塔学生在校园内必须穿着正式学院制服。',
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
            className={`border-l-3 border-ink bg-paper hover:bg-paper-contrast transition-all cursor-pointer
                ${event.isLocked ? 'opacity-60' : ''}`}
            onClick={onToggle}
        >
            {/* Header */}
            <div className="p-3 flex items-start gap-3">
                {/* Type Icon */}
                <div className="p-2 bg-ink text-paper shrink-0">
                    <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {event.isNew && (
                            <span className="px-2 py-0.5 bg-crimson text-paper text-[9px] font-mono font-bold uppercase">
                                NEW
                            </span>
                        )}
                        <span className="text-[10px] font-mono font-bold uppercase text-ink/60">
                            {config.label}
                        </span>
                    </div>

                    <h3 className={`font-headline font-bold text-ink uppercase tracking-wide ${event.isLocked ? 'blur-sm' : ''}`}>
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-ink/50 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{event.timestamp}</span>
                    </div>
                </div>

                {/* Expand Icon */}
                <div className="text-ink/30 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && !event.isLocked && (
                <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="pl-11 border-t border-ink/20 pt-3">
                        <p className="text-sm text-ink/80 leading-relaxed font-serif text-justify">
                            {event.content}
                        </p>
                    </div>
                </div>
            )}

            {/* Locked Notice */}
            {isExpanded && event.isLocked && (
                <div className="px-3 pb-3 pt-0">
                    <div className="pl-11 border-t border-ink/20 pt-3">
                        <p className="text-sm text-crimson font-mono uppercase flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Higher club contribution required to view
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
        <div className="w-full space-y-6">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-double border-ink pb-4">
                <div className="flex justify-between items-end border-b border-ink mb-3 pb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">Est. 1842</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">Vol. XCII</span>
                </div>
                <h1 className="font-masthead text-4xl md:text-5xl text-ink tracking-wide mb-2">
                    The Babel Daily
                </h1>
                <p className="text-sm font-serif italic text-ink/60">事件日志 · Event Chronicle</p>
                {newCount > 0 && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-crimson text-paper text-xs font-mono uppercase">
                        <Bell className="w-3 h-3" />
                        {newCount} New {newCount === 1 ? 'Article' : 'Articles'}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-ink/50" />
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border-2 transition-colors
                        ${filterType === 'all' ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-ink/30 hover:border-ink'}`}
                >
                    All
                </button>
                {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    const count = events.filter(e => e.type === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterType(key as any)}
                            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border-2 transition-colors flex items-center gap-1
                                ${filterType === key ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-ink/30 hover:border-ink'}`}
                        >
                            <Icon className="w-3 h-3" />
                            {config.labelCn} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Event List */}
            <div className="space-y-2">
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
                    <p className="font-serif italic">No events of this type</p>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-ink/30 text-[10px] font-mono uppercase tracking-widest pt-4 border-t border-ink/20">
                ❖ Fin ❖
            </div>
        </div>
    );
};
