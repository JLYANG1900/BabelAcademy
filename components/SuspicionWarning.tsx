import React, { useEffect, useState } from 'react';
import { AlertTriangle, Eye, Shield, Skull, X, Clock } from 'lucide-react';

// 警告级别类型
type WarningLevel = 'none' | 'caution' | 'warning' | 'wanted';

// 警告配置
const WARNING_CONFIG = {
    caution: {
        threshold: 50,
        title: '注意',
        englishTitle: 'CAUTION',
        icon: Eye,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        glowColor: 'shadow-yellow-500/30',
        message: '审判庭开始注意到你的活动。请保持低调，避免引起更多怀疑。',
        suggestions: [
            '按时完成帝国任务以降低怀疑度',
            '避免在深夜出现在可疑区域',
            '与帝国派NPC保持良好关系'
        ]
    },
    warning: {
        threshold: 70,
        title: '警告',
        englishTitle: 'WARNING',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
        glowColor: 'shadow-orange-500/40',
        message: '你已被审判庭列入重点观察名单。任何可疑行为都将被记录在案。',
        suggestions: [
            '立即停止与赫耳墨斯社的公开接触',
            '考虑向威廉教授表忠心',
            '销毁所有未编号的银条'
        ]
    },
    wanted: {
        threshold: 90,
        title: '通缉',
        englishTitle: 'WANTED',
        icon: Skull,
        color: 'text-crimson',
        bgColor: 'bg-crimson/10',
        borderColor: 'border-crimson',
        glowColor: 'shadow-crimson/50',
        message: '你已被帝国审判庭正式通缉！「清洗」行动即将启动，逃离巴别塔是你唯一的选择。',
        suggestions: [
            '立即联系赫耳墨斯社寻求庇护',
            '前往泰晤士河地下水道寻找\"复仇女神号\"',
            '收集所有银条和情报，准备流亡'
        ]
    }
};

// 获取警告级别
const getWarningLevel = (suspicion: number): WarningLevel => {
    if (suspicion >= 90) return 'wanted';
    if (suspicion >= 70) return 'warning';
    if (suspicion >= 50) return 'caution';
    return 'none';
};

// 闪烁动画组件
const PulsingBorder: React.FC<{ color: string; intensity: 'low' | 'medium' | 'high' }> = ({ color, intensity }) => {
    const animationClass = {
        low: 'animate-pulse',
        medium: 'animate-[pulse_1s_ease-in-out_infinite]',
        high: 'animate-[pulse_0.5s_ease-in-out_infinite]'
    }[intensity];

    return (
        <div className={`absolute inset-0 border-4 ${color} ${animationClass} pointer-events-none`} />
    );
};

// 主警告弹窗组件
interface SuspicionWarningProps {
    suspicion: number;
    onClose: () => void;
    onDismiss?: () => void;
}

export const SuspicionWarning: React.FC<SuspicionWarningProps> = ({
    suspicion,
    onClose,
    onDismiss
}) => {
    const level = getWarningLevel(suspicion);
    const [countdown, setCountdown] = useState(10);
    const [dismissed, setDismissed] = useState(false);

    // 通缉状态倒计时
    useEffect(() => {
        if (level === 'wanted' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [level, countdown]);

    if (level === 'none' || dismissed) return null;

    const config = WARNING_CONFIG[level];
    const Icon = config.icon;
    const intensity = level === 'wanted' ? 'high' : level === 'warning' ? 'medium' : 'low';

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-sm animate-in fade-in duration-300">
            {/* 全屏红色闪烁效果（仅通缉状态） */}
            {level === 'wanted' && (
                <div className="absolute inset-0 bg-crimson/20 animate-[pulse_0.5s_ease-in-out_infinite]" />
            )}

            <div className={`relative w-full max-w-lg mx-4 ${config.bgColor} border-4 ${config.borderColor} shadow-2xl ${config.glowColor} overflow-hidden`}>
                {/* 闪烁边框 */}
                <PulsingBorder color={config.borderColor} intensity={intensity} />

                {/* 关闭按钮（非通缉状态） */}
                {level !== 'wanted' && (
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1 text-ink/50 hover:text-ink transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* 头部 */}
                <div className={`p-4 ${level === 'wanted' ? 'bg-crimson text-white' : 'bg-ink/5'} border-b-2 ${config.borderColor}`}>
                    <div className="flex items-center justify-center gap-3">
                        <Icon className={`w-8 h-8 ${level === 'wanted' ? 'text-white animate-bounce' : config.color}`} />
                        <div className="text-center">
                            <h2 className={`font-display text-3xl font-black tracking-widest uppercase ${level === 'wanted' ? 'text-white' : config.color}`}>
                                {config.englishTitle}
                            </h2>
                            <p className={`text-sm font-bold ${level === 'wanted' ? 'text-white/80' : 'text-ink/60'}`}>
                                {config.title}
                            </p>
                        </div>
                        <Icon className={`w-8 h-8 ${level === 'wanted' ? 'text-white animate-bounce' : config.color}`} />
                    </div>
                </div>

                {/* 怀疑度显示 */}
                <div className="p-4 border-b border-ink/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-ink">怀疑度 Suspicion Level</span>
                        <span className={`font-mono text-2xl font-black ${config.color}`}>{suspicion}%</span>
                    </div>
                    <div className="h-4 bg-ink/10 border-2 border-ink/20 overflow-hidden relative">
                        <div
                            className={`h-full ${level === 'wanted'
                                ? 'bg-gradient-to-r from-crimson to-red-400 animate-pulse'
                                : level === 'warning'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                } transition-all duration-1000`}
                            style={{ width: `${suspicion}%` }}
                        />
                        {/* 阈值标记 */}
                        <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-ink/30" />
                        <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-ink/30" />
                        <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-crimson/50" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-ink/50 mt-1">
                        <span>0%</span>
                        <span>50% 注意</span>
                        <span>70% 警告</span>
                        <span>90% 通缉</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* 警告信息 */}
                <div className="p-4 space-y-4">
                    <p className={`text-center font-serif text-lg leading-relaxed ${level === 'wanted' ? 'text-crimson font-bold' : 'text-ink/80'}`}>
                        {config.message}
                    </p>

                    {/* 建议行动 */}
                    <div className="bg-white/50 border border-ink/10 p-3">
                        <h4 className="font-display font-bold text-sm text-ink mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            建议行动
                        </h4>
                        <ul className="space-y-1">
                            {config.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm text-ink/70 flex items-start gap-2">
                                    <span className="text-gold">▸</span>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 通缉状态倒计时 */}
                    {level === 'wanted' && (
                        <div className="text-center p-3 bg-crimson/20 border-2 border-crimson animate-pulse">
                            <div className="flex items-center justify-center gap-2 text-crimson font-bold">
                                <Clock className="w-5 h-5" />
                                <span className="font-mono text-2xl">{countdown}</span>
                                <span className="text-sm">秒后启动「清洗」程序</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 底部按钮 */}
                <div className="p-4 border-t border-ink/10 flex justify-center gap-3">
                    {level !== 'wanted' ? (
                        <button
                            onClick={handleDismiss}
                            className="px-6 py-2 bg-ink text-parchment font-display font-bold hover:bg-crimson transition-colors"
                        >
                            我知道了
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-crimson text-white font-display font-bold hover:bg-red-700 transition-colors animate-pulse"
                            >
                                立即逃亡
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 bg-ink text-parchment font-display font-bold hover:bg-ink/80 transition-colors"
                            >
                                接受命运
                            </button>
                        </>
                    )}
                </div>

                {/* 底部装饰 */}
                <div className="text-center py-2 text-[10px] font-mono text-ink/30 border-t border-ink/10">
                    ❖ IMPERIAL INQUISITION TRIBUNAL ❖
                </div>
            </div>
        </div>
    );
};

// 简化的内联警告条组件（用于在侧边栏等位置显示）
interface SuspicionBarProps {
    suspicion: number;
    onClick?: () => void;
}

export const SuspicionBar: React.FC<SuspicionBarProps> = ({ suspicion, onClick }) => {
    const level = getWarningLevel(suspicion);

    if (level === 'none') return null;

    const config = WARNING_CONFIG[level];
    const Icon = config.icon;

    return (
        <div
            onClick={onClick}
            className={`p-2 border-2 ${config.borderColor} ${config.bgColor} cursor-pointer transition-all hover:shadow-md ${level === 'wanted' ? 'animate-pulse' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-xs font-bold ${config.color}`}>
                    {config.title}: {suspicion}%
                </span>
            </div>
        </div>
    );
};
