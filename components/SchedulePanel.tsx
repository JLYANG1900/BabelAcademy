import React, { useState } from 'react';
import {
    Sun, Sunrise, Sunset, Moon, CloudMoon, Star,
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
    color: string;
    subActions?: { id: string; name: string; description: string }[];
}

interface SchedulePanelProps {
    currentTime?: string;
    onScheduleAction?: (timeSlot: string, action: string, subAction?: string) => void;
}

const TIME_SLOTS: TimeSlot[] = [
    { id: 'morning', name: '早晨', englishName: 'Morning', icon: <Sunrise className="w-5 h-5" />, hours: '06:00 - 09:00' },
    { id: 'forenoon', name: '上午', englishName: 'Forenoon', icon: <Sun className="w-5 h-5" />, hours: '09:00 - 12:00' },
    { id: 'afternoon', name: '午后', englishName: 'Afternoon', icon: <Sun className="w-5 h-5" />, hours: '12:00 - 17:00' },
    { id: 'evening', name: '傍晚', englishName: 'Evening', icon: <Sunset className="w-5 h-5" />, hours: '17:00 - 20:00' },
    { id: 'night', name: '夜晚', englishName: 'Night', icon: <Moon className="w-5 h-5" />, hours: '20:00 - 24:00' },
    { id: 'latenight', name: '深夜', englishName: 'Late Night', icon: <Star className="w-5 h-5" />, hours: '00:00 - 06:00' }
];

const ACTION_CATEGORIES: ActionCategory[] = [
    {
        id: 'study',
        name: '上课学习',
        icon: <BookOpen className="w-5 h-5" />,
        description: '参加学院课程，提升语言能力和刻银术技巧',
        color: 'bg-blue-500'
    },
    {
        id: 'internship',
        name: '部门实习',
        icon: <Briefcase className="w-5 h-5" />,
        description: '前往各部门进行实践工作',
        color: 'bg-amber-500',
        subActions: [
            { id: 'legal', name: '法务部', description: '起草贸易条约，处理跨国纠纷。获得银币报酬。' },
            { id: 'literature', name: '文学系', description: '参加沙龙社交，获取情报与人脉。' }
        ]
    },
    {
        id: 'explore',
        name: '探索校园',
        icon: <Building className="w-5 h-5" />,
        description: '在巴别塔各处探索，可能触发随机事件',
        color: 'bg-green-500'
    },
    {
        id: 'social',
        name: '社交互动',
        icon: <Users className="w-5 h-5" />,
        description: '与特定NPC进行互动，发展人际关系',
        color: 'bg-purple-500'
    },
    {
        id: 'secret',
        name: '秘密行动',
        icon: <Zap className="w-5 h-5" />,
        description: '为赫耳墨斯社执行任务（需足够社团贡献）',
        color: 'bg-crimson'
    },
    {
        id: 'rest',
        name: '休息',
        icon: <Bed className="w-5 h-5" />,
        description: '恢复精力，推进时间',
        color: 'bg-gray-500'
    }
];

const INTERNSHIP_ICONS = {
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

    // Determine current time slot based on time
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
                let commandText = `【日程安排】${timeSlot.name}：${action.name}`;
                if (selectedSubAction) {
                    const subAction = action.subActions?.find(s => s.id === selectedSubAction);
                    if (subAction) {
                        commandText += ` - ${subAction.name}`;
                    }
                }
                onScheduleAction?.(selectedTimeSlot, selectedAction, selectedSubAction || undefined);
            }
        }
    };

    const selectedActionData = ACTION_CATEGORIES.find(a => a.id === selectedAction);
    const hasSubActions = selectedActionData?.subActions && selectedActionData.subActions.length > 0;

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center border-b-2 border-gold pb-4">
                <h3 className="font-display text-2xl font-bold text-ink">日程规划</h3>
                <p className="text-sm text-ink/60 italic mt-1">Schedule Your Day</p>
            </div>

            {/* Current Time Display */}
            <div className="text-center p-3 bg-ink/5 border border-ink/10 rounded-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/50">当前时间</span>
                <p className="font-mono text-2xl font-bold text-ink">{currentTime}</p>
            </div>

            {/* Step 1: Select Time Slot */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                    <span className="w-6 h-6 rounded-full bg-ink text-parchment flex items-center justify-center text-xs">1</span>
                    选择时段
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                        const isCurrent = slot.id === currentTimeSlotId;
                        const isSelected = slot.id === selectedTimeSlot;

                        return (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedTimeSlot(slot.id)}
                                className={`
                  p-3 border-2 rounded-sm transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-gold bg-gold/10 shadow-md'
                                        : 'border-ink/20 hover:border-ink/40 bg-white/60'}
                  ${isCurrent ? 'ring-2 ring-gold ring-offset-1' : ''}
                `}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={isSelected ? 'text-gold' : 'text-ink/60'}>{slot.icon}</span>
                                    <span className="font-display font-bold text-ink">{slot.name}</span>
                                </div>
                                <p className="text-[10px] text-ink/50 font-mono">{slot.hours}</p>
                                {isCurrent && (
                                    <span className="inline-block mt-1 text-[10px] bg-gold text-ink px-1.5 py-0.5 rounded-sm font-bold">
                                        现在
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 2: Select Action */}
            {selectedTimeSlot && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 text-sm font-bold text-ink">
                        <span className="w-6 h-6 rounded-full bg-ink text-parchment flex items-center justify-center text-xs">2</span>
                        选择行动
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
                                    className={`
                    p-4 border-2 rounded-sm transition-all duration-200 text-left
                    ${isSelected
                                            ? 'border-gold bg-gold/10 shadow-md'
                                            : 'border-ink/20 hover:border-ink/40 bg-white/60'}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-sm ${action.color}/20`}>
                                            <span className={action.color.replace('bg-', 'text-')}>{action.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-display font-bold text-ink">{action.name}</h4>
                                            <p className="text-xs text-ink/60 mt-0.5">{action.description}</p>
                                        </div>
                                        {action.subActions && (
                                            <ChevronRight className={`w-4 h-4 text-ink/30 transition-transform ${isSelected ? 'rotate-90 text-gold' : ''}`} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 3: Select Sub-Action (if applicable) */}
            {hasSubActions && selectedAction && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 text-sm font-bold text-ink">
                        <span className="w-6 h-6 rounded-full bg-ink text-parchment flex items-center justify-center text-xs">3</span>
                        选择部门
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {selectedActionData?.subActions?.map(subAction => {
                            const isSelected = subAction.id === selectedSubAction;

                            return (
                                <button
                                    key={subAction.id}
                                    onClick={() => setSelectedSubAction(subAction.id)}
                                    className={`
                    p-4 border-2 rounded-sm transition-all duration-200 text-left
                    ${isSelected
                                            ? 'border-gold bg-gold/10 shadow-md'
                                            : 'border-ink/20 hover:border-ink/40 bg-white/60'}
                  `}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {INTERNSHIP_ICONS[subAction.id as keyof typeof INTERNSHIP_ICONS]}
                                        <span className="font-display font-bold text-ink">{subAction.name}</span>
                                    </div>
                                    <p className="text-xs text-ink/60">{subAction.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Confirm Button */}
            {selectedTimeSlot && selectedAction && (!hasSubActions || selectedSubAction) && (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={handleConfirmAction}
                        className="w-full p-4 bg-ink text-parchment font-display font-bold text-lg tracking-wider 
                       hover:bg-crimson transition-colors duration-300 flex items-center justify-center gap-3
                       border-2 border-ink hover:border-crimson"
                    >
                        <Send className="w-5 h-5" />
                        确认行动
                    </button>

                    {/* Preview */}
                    <div className="mt-3 p-3 bg-ink/5 border border-ink/10 rounded-sm text-center">
                        <span className="text-xs text-ink/50">将发送指令：</span>
                        <p className="font-mono text-sm text-ink mt-1">
                            【日程安排】{TIME_SLOTS.find(t => t.id === selectedTimeSlot)?.name}：
                            {ACTION_CATEGORIES.find(a => a.id === selectedAction)?.name}
                            {selectedSubAction && ` - ${selectedActionData?.subActions?.find(s => s.id === selectedSubAction)?.name}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="text-center text-xs text-ink/50 italic border-t border-ink/10 pt-4">
                每个行动将推进时间并可能影响你的各项属性值。谨慎规划你在巴别塔的每一天。
            </div>
        </div>
    );
};
