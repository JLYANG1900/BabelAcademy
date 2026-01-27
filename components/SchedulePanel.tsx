import React, { useState } from 'react';
import {
    Sun, Sunrise, Sunset, Moon, Star,
    BookOpen, Briefcase, Building, Users, Zap, Bed,
    Scale, Globe, Feather, ChevronRight, Send
} from 'lucide-react';

interface TimeSlot {
    id: string;
    name: string;
    englishName: string;
    icon: React.ReactNode;
    hours: string;
}

interface ActionCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    subActions?: { id: string; name: string; description: string }[];
}

interface SchedulePanelProps {
    currentTime?: string;
    onScheduleAction?: (timeSlot: string, action: string, subAction?: string) => void;
}

const TIME_SLOTS: TimeSlot[] = [
    { id: 'morning', name: '早晨', englishName: 'Morning', icon: <Sunrise className="w-4 h-4" />, hours: '06:00 - 09:00' },
    { id: 'forenoon', name: '上午', englishName: 'Forenoon', icon: <Sun className="w-4 h-4" />, hours: '09:00 - 12:00' },
    { id: 'afternoon', name: '午后', englishName: 'Afternoon', icon: <Sun className="w-4 h-4" />, hours: '12:00 - 17:00' },
    { id: 'evening', name: '傍晚', englishName: 'Evening', icon: <Sunset className="w-4 h-4" />, hours: '17:00 - 20:00' },
    { id: 'night', name: '夜晚', englishName: 'Night', icon: <Moon className="w-4 h-4" />, hours: '20:00 - 24:00' },
    { id: 'latenight', name: '深夜', englishName: 'Late Night', icon: <Star className="w-4 h-4" />, hours: '00:00 - 06:00' }
];

const ACTION_CATEGORIES: ActionCategory[] = [
    {
        id: 'study',
        name: '上课学习',
        icon: <BookOpen className="w-5 h-5" />,
        description: '参加学院课程，提升语言能力和刻银术技巧'
    },
    {
        id: 'internship',
        name: '部门实习',
        icon: <Briefcase className="w-5 h-5" />,
        description: '前往各部门进行实践工作',
        subActions: [
            { id: 'legal', name: '法务部', description: '起草贸易条约，处理跨国纠纷。获得银币报酬。' },
            { id: 'literature', name: '文学系', description: '参加沙龙社交，获取情报与人脉。' }
        ]
    },
    {
        id: 'explore',
        name: '探索校园',
        icon: <Building className="w-5 h-5" />,
        description: '在巴别塔各处探索，可能触发随机事件'
    },
    {
        id: 'social',
        name: '社交互动',
        icon: <Users className="w-5 h-5" />,
        description: '与特定NPC进行互动，发展人际关系'
    },
    {
        id: 'secret',
        name: '秘密行动',
        icon: <Zap className="w-5 h-5" />,
        description: '为赫耳墨斯社执行任务（需足够社团贡献）'
    },
    {
        id: 'rest',
        name: '休息',
        icon: <Bed className="w-5 h-5" />,
        description: '恢复精力，推进时间'
    }
];

const INTERNSHIP_ICONS: Record<string, React.ReactNode> = {
    legal: <Scale className="w-4 h-4" />,
    interpretation: <Globe className="w-4 h-4" />,
    literature: <Feather className="w-4 h-4" />
};

export const SchedulePanel: React.FC<SchedulePanelProps> = ({
    currentTime = '14:30',
    onScheduleAction
}) => {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedSubAction, setSelectedSubAction] = useState<string | null>(null);

    const getCurrentTimeSlot = () => {
        const hour = parseInt(currentTime.split(':')[0]);
        if (hour >= 6 && hour < 9) return 'morning';
        if (hour >= 9 && hour < 12) return 'forenoon';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 20) return 'evening';
        if (hour >= 20) return 'night';
        return 'latenight';
    };

    const currentTimeSlotId = getCurrentTimeSlot();

    const handleConfirmAction = () => {
        if (selectedTimeSlot && selectedAction) {
            const timeSlot = TIME_SLOTS.find(t => t.id === selectedTimeSlot);
            const action = ACTION_CATEGORIES.find(a => a.id === selectedAction);

            if (timeSlot && action) {
                onScheduleAction?.(selectedTimeSlot, selectedAction, selectedSubAction || undefined);
            }
        }
    };

    const selectedActionData = ACTION_CATEGORIES.find(a => a.id === selectedAction);
    const hasSubActions = selectedActionData?.subActions && selectedActionData.subActions.length > 0;

    return (
        <div className="w-full space-y-6">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-ink pb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Daily Planner</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-ink uppercase tracking-wider">
                    Schedule Your Day
                </h1>
                <p className="text-sm font-serif italic text-ink/60 mt-2">日程规划</p>
            </div>

            {/* Current Time Display */}
            <div className="text-center p-4 bg-ink text-paper">
                <span className="text-[10px] font-mono uppercase tracking-widest text-paper/60">Current Time</span>
                <p className="font-mono text-3xl font-bold">{currentTime}</p>
            </div>

            {/* Step 1: Select Time Slot */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-ink text-paper flex items-center justify-center text-sm font-mono font-bold">1</span>
                    <span className="font-headline font-bold text-sm uppercase tracking-wide">Select Time Period</span>
                    <div className="flex-1 h-px bg-ink/20"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                        const isCurrent = slot.id === currentTimeSlotId;
                        const isSelected = slot.id === selectedTimeSlot;

                        return (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedTimeSlot(slot.id)}
                                className={`p-3 border-2 transition-all duration-200 text-left
                                    ${isSelected ? 'border-ink bg-paper-contrast shadow-newspaper' : 'border-ink/30 hover:border-ink bg-paper'}
                                    ${isCurrent ? 'ring-2 ring-crimson ring-offset-1' : ''}
                                `}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={isSelected ? 'text-ink' : 'text-ink/60'}>{slot.icon}</span>
                                    <span className="font-headline font-bold text-sm uppercase">{slot.name}</span>
                                </div>
                                <p className="text-[10px] text-ink/50 font-mono">{slot.hours}</p>
                                {isCurrent && (
                                    <span className="inline-block mt-1 text-[9px] bg-crimson text-paper px-2 py-0.5 font-mono uppercase">
                                        ● NOW
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 2: Select Action */}
            {selectedTimeSlot && (
                <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-ink text-paper flex items-center justify-center text-sm font-mono font-bold">2</span>
                        <span className="font-headline font-bold text-sm uppercase tracking-wide">Select Activity</span>
                        <div className="flex-1 h-px bg-ink/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ACTION_CATEGORIES.map(action => {
                            const isSelected = action.id === selectedAction;

                            return (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        setSelectedAction(action.id);
                                        setSelectedSubAction(null);
                                    }}
                                    className={`p-4 border-2 transition-all duration-200 text-left flex items-start gap-3
                                        ${isSelected ? 'border-ink bg-paper-contrast shadow-newspaper' : 'border-ink/30 hover:border-ink bg-paper'}
                                    `}
                                >
                                    <div className="p-2 bg-ink/10 text-ink">
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-headline font-bold text-sm uppercase">{action.name}</h4>
                                        <p className="text-xs text-ink/60 font-serif mt-0.5">{action.description}</p>
                                    </div>
                                    {action.subActions && (
                                        <ChevronRight className={`w-4 h-4 text-ink/30 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 3: Select Sub-Action (if applicable) */}
            {hasSubActions && selectedAction && (
                <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-ink text-paper flex items-center justify-center text-sm font-mono font-bold">3</span>
                        <span className="font-headline font-bold text-sm uppercase tracking-wide">Select Department</span>
                        <div className="flex-1 h-px bg-ink/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {selectedActionData?.subActions?.map(subAction => {
                            const isSelected = subAction.id === selectedSubAction;

                            return (
                                <button
                                    key={subAction.id}
                                    onClick={() => setSelectedSubAction(subAction.id)}
                                    className={`p-4 border-2 transition-all duration-200 text-left
                                        ${isSelected ? 'border-ink bg-paper-contrast shadow-newspaper' : 'border-ink/30 hover:border-ink bg-paper'}
                                    `}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {INTERNSHIP_ICONS[subAction.id]}
                                        <span className="font-headline font-bold text-sm uppercase">{subAction.name}</span>
                                    </div>
                                    <p className="text-xs text-ink/60 font-serif">{subAction.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Confirm Button */}
            {selectedTimeSlot && selectedAction && (!hasSubActions || selectedSubAction) && (
                <div className="animate-in slide-in-from-bottom-2 duration-300 pt-4 border-t-2 border-ink">
                    <button
                        onClick={handleConfirmAction}
                        className="w-full p-4 bg-ink text-paper font-headline font-bold text-lg uppercase tracking-widest
                            hover:bg-crimson transition-colors duration-300 flex items-center justify-center gap-3 border-2 border-ink"
                    >
                        <Send className="w-5 h-5" />
                        Confirm Action
                    </button>

                    {/* Preview */}
                    <div className="mt-4 p-3 bg-paper-contrast border-2 border-ink/20 text-center">
                        <span className="text-[10px] font-mono uppercase text-ink/50">Command Preview:</span>
                        <p className="font-mono text-sm text-ink mt-1">
                            【日程安排】{TIME_SLOTS.find(t => t.id === selectedTimeSlot)?.name}：
                            {ACTION_CATEGORIES.find(a => a.id === selectedAction)?.name}
                            {selectedSubAction && ` - ${selectedActionData?.subActions?.find(s => s.id === selectedSubAction)?.name}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-[10px] text-ink/40 font-serif italic border-t border-ink/20 pt-4">
                Each action advances time and may affect your attributes. Plan your days at Babel wisely.
            </div>
        </div>
    );
};
