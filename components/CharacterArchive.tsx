import React from 'react';
import { Crown, Flame, Scale, MapPin, Heart, Shirt, Activity, MessageCircle } from 'lucide-react';
import { CharacterDynamicData } from '../types';

/**
 * 角色基本信息配置 - 静态数据，不由LLM更新
 * Character base info config - Static data, not updated by LLM
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
        label: '帝国派',
        labelEn: 'Empire',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50'
    },
    revolution: {
        icon: Flame,
        label: '革命派',
        labelEn: 'Revolution',
        color: 'text-red-700',
        bgColor: 'bg-red-50'
    },
    neutral: {
        icon: Scale,
        label: '中立派',
        labelEn: 'Neutral',
        color: 'text-slate-600',
        bgColor: 'bg-slate-50'
    }
};

/**
 * 单个角色卡片组件 - 报纸风格
 * Individual character card - newspaper style
 */
interface CharacterEntryProps {
    config: CharacterConfig;
    dynamicData?: CharacterDynamicData;
}

const CharacterEntry: React.FC<CharacterEntryProps> = ({ config, dynamicData }) => {
    const faction = FACTION_CONFIG[config.faction];
    const FactionIcon = faction.icon;

    // 使用动态数据或默认值
    const location = dynamicData?.location || '未知';
    const clothing = dynamicData?.clothing || '---';
    const activity = dynamicData?.activity || '---';
    const thought = dynamicData?.thought || '...';
    const affection = dynamicData?.affection ?? 50;

    return (
        <div className="break-inside-avoid mb-6 pb-5 border-b border-ink/20 flex gap-4 items-start">
            {/* 头像 - 报纸mugshot风格 */}
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-[3px] border-ink p-0.5 bg-paper-contrast shadow-[3px_3px_0_rgba(0,0,0,0.2)] -rotate-1">
                <img
                    src={config.portrait}
                    alt={config.name}
                    className="w-full h-full object-cover sepia-[0.3] contrast-110 hover:sepia-0 hover:contrast-100 transition-all duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=?';
                    }}
                />
            </div>

            {/* 信息列 */}
            <div className="flex-1 min-w-0">
                {/* 标题行：名字 + 好感度贴纸 */}
                <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="font-display text-xl md:text-2xl font-normal leading-tight">
                        {config.name}
                    </h3>
                    {/* 好感度贴纸 - 红色斜角标签 */}
                    <span
                        className="inline-block bg-crimson text-white font-mono text-xs px-2 py-0.5 -rotate-3 shadow-[2px_2px_0_rgba(0,0,0,0.2)] border border-dashed border-white/40"
                    >
                        LOVE: {affection}%
                    </span>
                </div>

                {/* 副标题：身份 + 阵营 */}
                <div className="flex items-center gap-2 mb-3 text-ink/60">
                    <span className="text-sm italic">{config.identity}</span>
                    <span className="text-xs">·</span>
                    <span className={`flex items-center gap-1 text-xs ${faction.color}`}>
                        <FactionIcon className="w-3 h-3" />
                        {faction.label}
                    </span>
                </div>

                {/* 动态状态行 */}
                <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <MapPin className="w-3 h-3" /> Seen At
                        </span>
                        <span className="text-ink/80">{location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <Shirt className="w-3 h-3" /> Wearing
                        </span>
                        <span className="text-ink/80 truncate">{clothing}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink/50 w-16 flex-shrink-0">
                            <Activity className="w-3 h-3" /> Activity
                        </span>
                        <span className="text-ink/80">{activity}</span>
                    </div>
                </div>

                {/* 引语框 - 角色当前想法 */}
                <div className="mt-3 p-2 bg-ink/5 border-l-[3px] border-ink/30 italic text-sm text-ink/70">
                    <MessageCircle className="w-3 h-3 inline mr-1 opacity-50" />
                    "{thought}"
                </div>
            </div>
        </div>
    );
};

/**
 * 主组件：角色档案 - 报纸"社交版"风格
 * Main component: Character Archive - Newspaper "Society" section style
 */
interface CharacterArchiveProps {
    characterDynamics?: Record<string, CharacterDynamicData>;
}

export const CharacterArchive: React.FC<CharacterArchiveProps> = ({ characterDynamics = {} }) => {
    return (
        <div className="w-full h-full overflow-y-auto bg-paper p-4 md:p-6">
            {/* 报纸标题区 */}
            <div className="text-center mb-6 pb-4 border-b-2 border-double border-ink">
                <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-2">
                    SOCIETY & RUMORS
                </h1>
                <p className="text-sm italic text-ink/60">
                    社交动态与流言蜚语 · Who's Who in the Tower
                </p>
            </div>

            {/* 引言 */}
            <div className="mb-6 pb-4 border-b border-ink/30">
                <p className="text-base italic text-ink/70 leading-relaxed">
                    "牛津城内最引人注目的面孔们正在塔内穿行。本版追踪他们的行踪，记录他们的风采。请注意，所有信息均来自可靠线人。"
                </p>
                <p className="text-xs text-ink/50 mt-2 italic">
                    — The most notable faces in Oxford are traversing the Tower. This section tracks their movements and records their elegance.
                </p>
            </div>

            {/* 双栏布局 - 报纸风格 */}
            <div className="columns-1 md:columns-2 gap-6 md:gap-8" style={{ columnRule: '1px solid rgba(0,0,0,0.2)' }}>
                {CHARACTER_CONFIG.map((config) => (
                    <CharacterEntry
                        key={config.id}
                        config={config}
                        dynamicData={characterDynamics[config.id]}
                    />
                ))}
            </div>

            {/* 页脚 */}
            <div className="mt-8 pt-4 border-t border-ink/30 text-center">
                <p className="text-xs text-ink/40 uppercase tracking-widest">
                    — End of Society Section —
                </p>
                <p className="text-[10px] text-ink/30 mt-1 italic">
                    Character data updated dynamically by LLM each turn · 角色数据由LLM每回合动态更新
                </p>
            </div>
        </div>
    );
};

export default CharacterArchive;
