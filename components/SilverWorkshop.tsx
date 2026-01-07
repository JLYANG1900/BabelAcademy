import React, { useState } from 'react';
import { Zap, Shield, Heart, Wrench, Music, Eye, AlertTriangle, Lock } from 'lucide-react';

// Types
interface SilverBar {
    id: string;
    sourceLang: string;
    sourceWord: string;
    targetLang: string;
    targetWord: string;
    category: 'utility' | 'entertainment' | 'medical' | 'combat' | 'stealth';
    effect: string;
    isForbidden: boolean;
}

interface SilverWorkshopProps {
    inventory?: SilverBar[];
    onSelectBar?: (bar: SilverBar) => void;
}

// Sample silver bars based on 语言魔法.xyaml
const SAMPLE_BARS: SilverBar[] = [
    {
        id: '1',
        sourceLang: '中文',
        sourceWord: '稳 (Wěn)',
        targetLang: '英文',
        targetWord: 'Stable',
        category: 'utility',
        effect: '重心锚定：交通工具如被钉在地面般平稳，无视风浪颠簸。',
        isForbidden: false
    },
    {
        id: '2',
        sourceLang: '日文',
        sourceWord: '道 (Dō)',
        targetLang: '英文',
        targetWord: 'Way',
        category: 'utility',
        effect: '自动导航：心中想着目的地，双脚或车轮自动选择正确路径。',
        isForbidden: false
    },
    {
        id: '3',
        sourceLang: '中文',
        sourceWord: '安 (Ān)',
        targetLang: '英文',
        targetWord: 'Peace',
        category: 'medical',
        effect: '精神镇静剂：创造如同处于母亲怀抱般的极致安全感。',
        isForbidden: false
    },
    {
        id: '4',
        sourceLang: '日文',
        sourceWord: '花火 (Hanabi)',
        targetLang: '英文',
        targetWord: 'Fireworks',
        category: 'entertainment',
        effect: '火树银花：烟花如真花般在空中盛开并悬浮，散发花香。',
        isForbidden: false
    },
    {
        id: '5',
        sourceLang: '日文',
        sourceWord: '斬る (Kiru)',
        targetLang: '英文',
        targetWord: 'Cut',
        category: 'combat',
        effect: '锋利度增幅：将"杀意"转化为物理锋利度，切开坚硬物体。',
        isForbidden: true
    },
    {
        id: '6',
        sourceLang: '中文',
        sourceWord: '潜 (Qián)',
        targetLang: '英文',
        targetWord: 'Submerge',
        category: 'stealth',
        effect: '介质同化：像融入水中一样融入环境，消除摩擦声与阻力。',
        isForbidden: true
    }
];

const CATEGORY_CONFIG = {
    utility: { icon: Wrench, label: '实用类', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
    entertainment: { icon: Music, label: '娱乐类', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-300' },
    medical: { icon: Heart, label: '医疗类', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
    combat: { icon: Zap, label: '战斗类', color: 'text-crimson', bgColor: 'bg-red-100', borderColor: 'border-red-300' },
    stealth: { icon: Eye, label: '潜行类', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' }
};

const SilverBarCard: React.FC<{ bar: SilverBar; onClick?: () => void }> = ({ bar, onClick }) => {
    const config = CATEGORY_CONFIG[bar.category];
    const IconComponent = config.icon;

    return (
        <div
            onClick={onClick}
            className={`
        relative p-4 border-2 rounded-sm cursor-pointer transition-all duration-300
        ${bar.isForbidden ? 'border-crimson/50 bg-red-50/50' : `${config.borderColor} bg-white/80`}
        hover:shadow-lg hover:-translate-y-1 group
      `}
        >
            {/* Forbidden Badge */}
            {bar.isForbidden && (
                <div className="absolute -top-2 -right-2 bg-crimson text-white text-[10px] px-2 py-0.5 rounded-sm font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    禁忌
                </div>
            )}

            {/* Category Icon */}
            <div className={`flex items-center gap-2 mb-3 ${config.color}`}>
                <IconComponent className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{config.label}</span>
            </div>

            {/* Silver Bar Visual */}
            <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 border border-gray-400 p-3 mb-3 shadow-inner">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.3)_2px,rgba(255,255,255,0.3)_4px)]"></div>

                {/* Word Pair */}
                <div className="relative z-10 text-center">
                    <div className="text-sm font-bold text-ink">{bar.sourceWord}</div>
                    <div className="text-[10px] text-ink/50 my-1">↕</div>
                    <div className="text-sm font-bold text-ink">{bar.targetWord}</div>
                </div>
            </div>

            {/* Language Labels */}
            <div className="flex justify-between text-[10px] text-ink/60 font-mono mb-2">
                <span>{bar.sourceLang}</span>
                <span>{bar.targetLang}</span>
            </div>

            {/* Effect Preview */}
            <p className="text-xs text-ink/70 italic line-clamp-2 group-hover:line-clamp-none transition-all">
                {bar.effect}
            </p>
        </div>
    );
};

export const SilverWorkshop: React.FC<SilverWorkshopProps> = ({ inventory = SAMPLE_BARS, onSelectBar }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedBar, setSelectedBar] = useState<SilverBar | null>(null);

    const filteredBars = activeCategory
        ? inventory.filter(bar => bar.category === activeCategory)
        : inventory;

    const handleBarClick = (bar: SilverBar) => {
        setSelectedBar(bar);
        onSelectBar?.(bar);
    };

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center border-b-2 border-gold pb-4">
                <h3 className="font-display text-2xl font-bold text-ink">刻银术工坊</h3>
                <p className="text-sm text-ink/60 italic mt-1">Silver-working Workshop</p>
            </div>

            {/* Warning Banner for Forbidden Categories */}
            <div className="flex items-start gap-3 p-3 bg-crimson/10 border border-crimson/30 rounded-sm">
                <AlertTriangle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                <div className="text-sm text-ink/80">
                    <span className="font-bold text-crimson">帝国法令：</span>
                    战斗类与潜行类刻银术为禁忌魔法。学院禁止教授或练习，违者将面临审讯。
                    <span className="text-ink/50 italic block mt-1">（赫耳墨斯社的地下网络可能有其他途径...）</span>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 text-sm font-display tracking-wider border transition-all
            ${!activeCategory
                            ? 'bg-ink text-parchment border-ink'
                            : 'bg-transparent text-ink border-ink/30 hover:border-ink'}`}
                >
                    全部
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const IconComponent = config.icon;
                    const isForbidden = key === 'combat' || key === 'stealth';
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`px-4 py-2 text-sm font-display tracking-wider border transition-all flex items-center gap-2
                ${activeCategory === key
                                    ? `${config.bgColor} ${config.color} ${config.borderColor}`
                                    : 'bg-transparent text-ink border-ink/30 hover:border-ink'}
                ${isForbidden ? 'border-dashed' : ''}`}
                        >
                            <IconComponent className="w-4 h-4" />
                            {config.label}
                            {isForbidden && <Lock className="w-3 h-3 text-crimson" />}
                        </button>
                    );
                })}
            </div>

            {/* Silver Bar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBars.map(bar => (
                    <SilverBarCard
                        key={bar.id}
                        bar={bar}
                        onClick={() => handleBarClick(bar)}
                    />
                ))}
            </div>

            {/* Selected Bar Detail */}
            {selectedBar && (
                <div className="p-6 border-2 border-gold bg-parchment-dark rounded-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="font-display text-xl font-bold text-ink">
                                {selectedBar.sourceWord} / {selectedBar.targetWord}
                            </h4>
                            <p className="text-sm text-ink/60">
                                {selectedBar.sourceLang} ↔ {selectedBar.targetLang}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-sm ${CATEGORY_CONFIG[selectedBar.category].bgColor} ${CATEGORY_CONFIG[selectedBar.category].color} text-sm font-bold`}>
                            {CATEGORY_CONFIG[selectedBar.category].label}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">魔法效果</span>
                            <p className="text-ink mt-1">{selectedBar.effect}</p>
                        </div>

                        {selectedBar.isForbidden && (
                            <div className="flex items-center gap-2 text-crimson text-sm font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                此银条为禁忌物品，持有可能招致审讯
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Principle Reminder */}
            <div className="text-center text-xs text-ink/50 italic border-t border-ink/10 pt-4">
                "魔法存在于翻译中流失的意义里——即语言间不可逾越的语义差异。"
            </div>
        </div>
    );
};
