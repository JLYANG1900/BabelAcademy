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

// Sample silver bars
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
    utility: { icon: Wrench, label: 'UTILITY', labelCn: '实用类' },
    entertainment: { icon: Music, label: 'ENTERTAINMENT', labelCn: '娱乐类' },
    medical: { icon: Heart, label: 'MEDICAL', labelCn: '医疗类' },
    combat: { icon: Zap, label: 'COMBAT', labelCn: '战斗类' },
    stealth: { icon: Eye, label: 'STEALTH', labelCn: '潜行类' }
};

const SilverBarCard: React.FC<{ bar: SilverBar; onClick?: () => void }> = ({ bar, onClick }) => {
    const config = CATEGORY_CONFIG[bar.category];
    const IconComponent = config.icon;

    return (
        <div
            onClick={onClick}
            className={`relative p-4 border-2 cursor-pointer transition-all duration-200 group
                ${bar.isForbidden ? 'border-crimson bg-crimson/5' : 'border-ink/30 bg-paper hover:border-ink'}
                hover:shadow-newspaper hover:-translate-y-0.5
            `}
        >
            {/* Forbidden Badge */}
            {bar.isForbidden && (
                <div className="absolute -top-2 -right-2 bg-crimson text-paper text-[9px] font-mono uppercase px-2 py-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> FORBIDDEN
                </div>
            )}

            {/* Category Label */}
            <div className="flex items-center gap-2 mb-3 text-ink/70">
                <IconComponent className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{config.label}</span>
            </div>

            {/* Silver Bar Visual - Newspaper illustration style */}
            <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 border-2 border-ink p-4 mb-3">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]"></div>

                {/* Word Pair */}
                <div className="relative z-10 text-center">
                    <div className="font-headline text-lg font-bold text-ink uppercase">{bar.sourceWord}</div>
                    <div className="text-[10px] text-ink/50 my-1 font-mono">↕</div>
                    <div className="font-headline text-lg font-bold text-ink uppercase">{bar.targetWord}</div>
                </div>
            </div>

            {/* Language Labels */}
            <div className="flex justify-between text-[10px] text-ink/50 font-mono uppercase mb-2">
                <span>{bar.sourceLang}</span>
                <span>{bar.targetLang}</span>
            </div>

            {/* Effect Preview */}
            <p className="text-xs text-ink/70 font-serif italic line-clamp-2 group-hover:line-clamp-none transition-all">
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
        <div className="w-full space-y-6">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-ink pb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Babel Workshop</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-ink uppercase tracking-wider">
                    Silver-Working Catalogue
                </h1>
                <p className="text-sm font-serif italic text-ink/60 mt-2">刻银术工坊</p>
            </div>

            {/* Warning Banner */}
            <div className="flex items-start gap-3 p-4 bg-crimson/10 border-2 border-crimson">
                <AlertTriangle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                <div className="text-sm text-ink">
                    <span className="font-headline font-bold text-crimson uppercase">Imperial Decree:</span>{' '}
                    <span className="font-serif">Combat and Stealth silver-working are forbidden arts. The Academy prohibits teaching or practice. Violators face Inquisition.</span>
                    <span className="text-ink/50 italic block mt-1 font-serif">(The Hermes Society's underground network may have other paths...)</span>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 border-b-2 border-ink/20 pb-4">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 text-sm font-mono uppercase tracking-wider border-2 transition-all
                        ${!activeCategory ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-ink/30 hover:border-ink'}`}
                >
                    All Items
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const IconComponent = config.icon;
                    const isForbidden = key === 'combat' || key === 'stealth';
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`px-4 py-2 text-sm font-mono uppercase tracking-wider border-2 transition-all flex items-center gap-2
                                ${activeCategory === key ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-ink/30 hover:border-ink'}
                                ${isForbidden ? 'border-dashed' : ''}`}
                        >
                            <IconComponent className="w-4 h-4" />
                            {config.labelCn}
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
                <div className="p-6 border-3 border-ink bg-paper-contrast">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="font-headline text-xl font-bold text-ink uppercase">
                                {selectedBar.sourceWord} / {selectedBar.targetWord}
                            </h4>
                            <p className="text-sm text-ink/60 font-mono">
                                {selectedBar.sourceLang} ↔ {selectedBar.targetLang}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-ink text-paper text-sm font-mono uppercase">
                            {CATEGORY_CONFIG[selectedBar.category].labelCn}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/50">Magic Effect</span>
                            <p className="text-ink font-serif mt-1">{selectedBar.effect}</p>
                        </div>

                        {selectedBar.isForbidden && (
                            <div className="flex items-center gap-2 text-crimson text-sm font-mono font-bold uppercase">
                                <AlertTriangle className="w-4 h-4" />
                                This item is forbidden. Possession may result in Inquisition.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-[10px] text-ink/40 font-serif italic border-t border-ink/20 pt-4">
                "Magic exists in the meaning lost in translation—the unbridgeable semantic gap between languages."
            </div>
        </div>
    );
};
