import React from 'react';
import { Crown, Flame, Scale, MapPin, Heart, Shirt, Activity, MessageCircle } from 'lucide-react';
import { CharacterDynamicData } from '../types';

/**
 * 角色基本信息配置 - 静态数据，不由LLM更新
 */
interface CharacterConfig {
    id: string;
    name: string;
    englishName: string;
    identity: string;
    faction: 'empire' | 'revolution' | 'neutral';
    portrait: string;
}

const CHARACTER_CONFIG: CharacterConfig[] = [
    {
        id: '埃莉诺',
        name: '埃莉诺·诺曼',
        englishName: 'Eleanor Norman',
        identity: '一年级新生 / 社交名媛',
        faction: 'revolution',
        portrait: 'https://i.ibb.co/XxmhT3hd/image.png'
    },
    {
        id: '关祁',
        name: '关祁',
        englishName: 'Guan Qi',
        identity: '一年级新生 / 两广总督之子',
        faction: 'revolution',
        portrait: 'https://i.ibb.co/N6dhQqK9/image.png'
    },
    {
        id: '海因里希',
        name: '海因里希·冯·克莱斯特',
        englishName: 'Heinrich von Kleist',
        identity: '一年级新生 / 退役军官',
        faction: 'empire',
        portrait: 'https://i.ibb.co/8nd5P5jL/image.png'
    },
    {
        id: '索菲亚',
        name: '索菲亚·奥博连斯基',
        englishName: 'Sophia Obolensky',
        identity: '一年级新生 / 流亡贵族',
        faction: 'revolution',
        portrait: 'https://i.ibb.co/BV8qYXQm/image.png'
    },
    {
        id: '源结月',
        name: '源结月',
        englishName: 'Minamoto Yuetsuki',
        identity: '一年级新生 / 源氏贵族',
        faction: 'empire',
        portrait: 'https://i.ibb.co/0R2bkTck/image.png'
    },
    {
        id: '佩德罗',
        name: '佩德罗·德·索萨',
        englishName: 'Pedro de Sousa',
        identity: '一年级新生 / 庄园主之子',
        faction: 'neutral',
        portrait: 'https://i.ibb.co/BHTSV0bT/image.png'
    },
    {
        id: '科莱特',
        name: '科莱特·瓦卢瓦',
        englishName: 'Colette Valois',
        identity: '教授 / 法国沙龙女王',
        faction: 'neutral',
        portrait: 'https://i.ibb.co/yFqz4n1v/image.png'
    },
    {
        id: '威廉',
        name: '威廉·诺曼',
        englishName: 'William Norman',
        identity: '教授 / 诺曼家族家主',
        faction: 'empire',
        portrait: 'https://i.ibb.co/j9GvLhc6/image.png'
    }
];

// 阵营配置
const FACTION_CONFIG = {
    empire: {
        icon: Crown,
        label: 'EMPIRE',
        labelCn: '帝国派'
    },
    revolution: {
        icon: Flame,
        label: 'REVOLUTION',
        labelCn: '革命派'
    },
    neutral: {
        icon: Scale,
        label: 'NEUTRAL',
        labelCn: '中立派'
    }
};

/**
 * 单个角色卡片组件 - 报纸档案风格
 */
interface CharacterEntryProps {
    config: CharacterConfig;
    dynamicData?: CharacterDynamicData;
}

const CharacterEntry: React.FC<CharacterEntryProps> = ({ config, dynamicData }) => {
    const faction = FACTION_CONFIG[config.faction];
    const FactionIcon = faction.icon;

    const location = dynamicData?.location || '未知';
    const clothing = dynamicData?.clothing || '---';
    const activity = dynamicData?.activity || '---';
    const thought = dynamicData?.thought || '...';
    const affection = dynamicData?.affection ?? 50;

    return (
        <div className="break-inside-avoid mb-6 pb-5 border-b-2 border-ink/20 flex gap-4 items-start">
            {/* Portrait - Newspaper mugshot style */}
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-3 border-ink p-0.5 bg-paper shadow-newspaper">
                <img
                    src={config.portrait}
                    alt={config.name}
                    className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 hover:contrast-100 transition-all duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=?';
                    }}
                />
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0">
                {/* Name + Affection Badge */}
                <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="font-headline text-xl md:text-2xl font-bold uppercase tracking-wide leading-tight">
                        {config.name}
                    </h3>
                    {/* Affection Badge - Newspaper stamp style */}
                    <span className="inline-block bg-crimson text-paper font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider shadow-newspaper border border-paper/30">
                        ♥ {affection}%
                    </span>
                </div>

                {/* Subtitle: Identity + Faction */}
                <div className="flex items-center gap-2 mb-3 text-ink/60">
                    <span className="text-sm font-serif italic">{config.identity}</span>
                    <span className="text-xs">·</span>
                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase">
                        <FactionIcon className="w-3 h-3" />
                        {faction.label}
                    </span>
                </div>

                {/* Dynamic Status Rows */}
                <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <MapPin className="w-3 h-3" /> SEEN
                        </span>
                        <span className="text-ink/80 font-serif">{location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <Shirt className="w-3 h-3" /> ATTIRE
                        </span>
                        <span className="text-ink/80 font-serif">{clothing}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <Activity className="w-3 h-3" /> DOING
                        </span>
                        <span className="text-ink/80 font-serif">{activity}</span>
                    </div>
                </div>

                {/* Quote Box - Character thought */}
                <div className="mt-3 p-3 bg-paper-contrast border-l-3 border-ink font-serif italic text-sm text-ink/70">
                    <MessageCircle className="w-3 h-3 inline mr-1 opacity-50" />
                    "{thought}"
                </div>
            </div>
        </div>
    );
};

/**
 * 主组件：角色档案 - 报纸"社交版"风格
 */
interface CharacterArchiveProps {
    characterDynamics?: Record<string, CharacterDynamicData>;
}

export const CharacterArchive: React.FC<CharacterArchiveProps> = ({ characterDynamics = {} }) => {
    return (
        <div className="w-full h-full overflow-y-auto bg-paper p-4 md:p-6">
            {/* Newspaper Masthead */}
            <div className="text-center mb-6 pb-4 border-b-3 border-double border-ink">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Special Edition</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <h1 className="font-masthead text-4xl md:text-5xl text-ink tracking-wide mb-2">
                    Society & Rumors
                </h1>
                <p className="text-sm font-serif italic text-ink/60">
                    社交动态与流言蜚语 · Who's Who in the Tower
                </p>
            </div>

            {/* Introduction */}
            <div className="mb-6 pb-4 border-b border-ink/30">
                <p className="text-base font-serif italic text-ink/70 leading-relaxed text-justify">
                    "牛津城内最引人注目的面孔们正在塔内穿行。本版追踪他们的行踪，记录他们的风采。请注意，所有信息均来自可靠线人。"
                </p>
                <p className="text-xs text-ink/50 mt-2 font-serif italic">
                    — The most notable faces in Oxford traverse the Tower. This section tracks their movements and records their elegance.
                </p>
            </div>

            {/* Two-column Layout - Newspaper style */}
            <div className="columns-1 md:columns-2 gap-6 md:gap-8" style={{ columnRule: '2px solid rgba(21, 21, 21, 0.15)' }}>
                {CHARACTER_CONFIG.map((config) => (
                    <CharacterEntry
                        key={config.id}
                        config={config}
                        dynamicData={characterDynamics[config.id]}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t-2 border-ink/30 text-center">
                <p className="text-[10px] text-ink/40 font-mono uppercase tracking-widest">
                    — End of Society Section —
                </p>
                <p className="text-[9px] text-ink/30 mt-1 font-serif italic">
                    Character data updated dynamically by LLM each turn
                </p>
            </div>
        </div>
    );
};

export default CharacterArchive;
