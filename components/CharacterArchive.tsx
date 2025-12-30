import React, { useState } from 'react';
import { Crown, Flame, Scale, Heart, ChevronDown, ChevronUp, User, X } from 'lucide-react';

// NPC数据类型定义
interface NPCCharacter {
    id: string;
    name: string;
    englishName: string;
    age: number;
    nationality: string;
    role: string;
    faction: 'empire' | 'revolution' | 'neutral';
    affection: number; // 0-100
    portrait: string; // emoji placeholder
    appearance: string;
    personality: string;
    background: string;
    abilities: string[];
    relationToPlayer: string;
}

// 阵营配置
const FACTION_CONFIG = {
    empire: {
        icon: Crown,
        label: '帝国派',
        color: 'text-gold',
        bgColor: 'bg-gold/10',
        borderColor: 'border-gold'
    },
    revolution: {
        icon: Flame,
        label: '革命派',
        color: 'text-crimson',
        bgColor: 'bg-crimson/10',
        borderColor: 'border-crimson'
    },
    neutral: {
        icon: Scale,
        label: '中立派',
        color: 'text-academy',
        bgColor: 'bg-academy/10',
        borderColor: 'border-academy'
    }
};

// 基于巴别塔参考资料的8位核心NPC数据
const NPC_DATA: NPCCharacter[] = [
    {
        id: 'william_norman',
        name: '威廉·诺曼',
        englishName: 'William Norman',
        age: 36,
        nationality: '不列颠尼亚帝国',
        role: '教授 / 实用类魔法系主任',
        faction: 'empire',
        affection: 50,
        portrait: 'https://i.ibb.co/zWbhSsyn/image.png',
        appearance: '身姿挺拔，金发碧眼，面容英俊，嘴角总是挂着令人如沐春风的微笑。常戴金丝边眼镜，穿着剪裁时髦的浅灰色或海军蓝西装。',
        personality: '伪善的温情主义者，精致的利己主义者。表面温文尔雅、开明包容，实则是冷酷的工具论者。',
        background: '诺曼家族现任家主，你的养父。出身日渐没落的贵族家庭，年轻时作为外交官游历东方。',
        abilities: ['中英翻译（精通）', '刻银术（全类型精通）', '情感操控与心理洞察'],
        relationToPlayer: '养父'
    },
    {
        id: 'eleanor_norman',
        name: '埃莉诺·诺曼',
        englishName: 'Eleanor Norman',
        age: 18,
        nationality: '不列颠尼亚帝国（中英混血）',
        role: '一年级新生 / 社交名媛',
        faction: 'revolution',
        affection: 45,
        portrait: 'https://i.ibb.co/nMhHSnHV/image.png',
        appearance: '纤细优雅，肤色苍白如瓷。深褐色黑发盘成复杂的维多利亚发髻，插着一支玉簪。眼神深邃如墨，令人惊叹的中英混血美貌。',
        personality: '变色龙，复仇女神。表面八面玲珑、天真烂漫，内心燃烧着冰冷的怒火。',
        background: '威廉的私生女，赫耳墨斯社的高级情报员。在广东度过童年，十年前被带回不列颠尼亚。',
        abilities: ['中英翻译（精通）', '刻银术（全类型精通）', '表演与伪装'],
        relationToPlayer: '堂亲 / 同学'
    },
    {
        id: 'heinrich_von_kleist',
        name: '海因里希·冯·克莱斯特',
        englishName: 'Heinrich von Kleist',
        age: 26,
        nationality: '普鲁士王国',
        role: '一年级新生 / 退役军官',
        faction: 'empire',
        affection: 30,
        portrait: 'https://i.ibb.co/TDb8P8Hx/image.png',
        appearance: '高大魁梧(192cm)，浅金发军官短发，冰蓝色眼睛。轮廓如刀削斧凿，左脸颊有练剑时留下的浅浅伤疤。',
        personality: '严谨、刻板、傲慢。推崇秩序与等级制度，坚定的社会达尔文主义者。',
        background: '普鲁士容克贵族，前军官。家族在反法战争中军功显赫，被派来学习刻银术以强化普鲁士军工。',
        abilities: ['德英翻译（精通）', '实用类刻银术（结构强化/弹道修正）'],
        relationToPlayer: '同学'
    },
    {
        id: 'minamoto_yuetsuki',
        name: '源结月',
        englishName: 'Minamoto Yuetsuki',
        age: 19,
        nationality: '日本',
        role: '一年级新生 / 源氏贵族',
        faction: 'empire',
        affection: 35,
        portrait: 'https://i.ibb.co/1tQW31L3/image.png',
        appearance: '纤细单薄(158cm)，黑发如瀑，皮肤呈现病态的苍白。美得具有侵略性，嘴唇总是涂着猩红色的口脂。',
        personality: '高岭之花与疯批恶女。表面优雅神秘，实则是完美主义者和控制狂，崇拜强权。',
        background: '源氏旁系血脉，与德川家关系密切。家族曾炮击西洋商人，同时派遣她来不列颠尼亚学习。',
        abilities: ['日英翻译', '医疗与心理类刻银术（感官操控）'],
        relationToPlayer: '同学'
    },
    {
        id: 'sophia_obolensky',
        name: '索菲亚·奥博连斯基',
        englishName: 'Sophia Obolensky',
        age: 21,
        nationality: '俄罗斯帝国',
        role: '一年级新生 / 流亡贵族',
        faction: 'revolution',
        affection: 55,
        portrait: 'https://i.ibb.co/hRpDTP4k/image.png',
        appearance: '身材高挑(170cm)，浅金发略显凌乱，锐利的绿色猫眼。俄罗斯美女，颧骨高耸，手指上沾满烟草味和墨水迹。',
        personality: '热情、直率且充满知性魅力。辩论狂，激进派革命者。',
        background: '俄罗斯留里克王朝后裔，家族因参与十二月党人起义失败而被清洗。赫耳墨斯社激进派成员。',
        abilities: ['俄英翻译', '战斗类魔法（能量释放/爆炸）'],
        relationToPlayer: '同学'
    },
    {
        id: 'guan_qi',
        name: '关祁',
        englishName: 'Guan Qi',
        age: 23,
        nationality: '大清（满族）',
        role: '一年级新生 / 两广总督之子',
        faction: 'revolution',
        affection: 60,
        portrait: 'https://i.ibb.co/gML1H8JS/image.png',
        appearance: '身形修长(183cm)，黑色短发，眼神慵懒。气质清贵，穿着极其昂贵的定制西装但领带总是松松垮垮。',
        personality: '犬儒主义者，优雅的毒舌家。表面闲散，实则被动的守护者。',
        background: '满族瓜尔佳氏，父亲是两广总督。广州十三行带来巨额财富，被家族命令加入赫耳墨斯社。',
        abilities: ['中英翻译（精通）', '实用类/娱乐类魔法', '找出魔法逻辑漏洞'],
        relationToPlayer: '同学 / 同胞'
    },
    {
        id: 'pedro_de_sousa',
        name: '佩德罗·德·索萨',
        englishName: 'Pedro de Sousa',
        age: 19,
        nationality: '巴西帝国',
        role: '一年级新生 / 庄园主之子',
        faction: 'neutral',
        affection: 70,
        portrait: 'https://i.ibb.co/cK27c402/image.png',
        appearance: '凌乱不羁的深棕色卷发，明亮的琥珀色眼睛，古铜色皮肤。笑起来露出洁白的牙齿，穿着色彩鲜艳的马甲。',
        personality: '享乐主义的自由灵魂，混乱中立的乐天派。社交达人，对政治有意逃避。',
        background: '巴西里约热内卢咖啡与蔗糖庄园主之子，含着金汤匙出生的少爷。派对组织者。',
        abilities: ['葡英翻译', '娱乐型魔法刻银术（情感共鸣）'],
        relationToPlayer: '同学'
    },
    {
        id: 'colette_valois',
        name: '科莱特·瓦卢瓦',
        englishName: 'Colette Valois',
        age: 27,
        nationality: '法兰西/突尼斯（混血）',
        role: '教授 / 娱乐类魔法系主任',
        faction: 'neutral',
        affection: 40,
        portrait: 'https://i.ibb.co/0yr0sjS4/image.png',
        appearance: '栗色波浪卷发，深邃的琥珀色眼睛。带有神秘异域风情的法式美人，神情慵懒而迷离。',
        personality: '浪漫主义者，感官享乐主义者。不羁的教授，清醒的旁观者。',
        background: '法国殖民贵族后裔，巴别塔史上最年轻的终身教授。开发了基于"诱惑与感知"的刻银术体系。',
        abilities: ['法英阿拉伯语', '娱乐型魔法（幻术/情感操控）'],
        relationToPlayer: '导师'
    }
];

// 角色卡片组件
const CharacterCard: React.FC<{
    character: NPCCharacter;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ character, isExpanded, onToggle }) => {
    const factionConfig = FACTION_CONFIG[character.faction];
    const FactionIcon = factionConfig.icon;

    return (
        <div
            className={`border-2 ${factionConfig.borderColor} bg-parchment shadow-md transition-all duration-300 hover:shadow-gothic cursor-pointer overflow-hidden`}
            onClick={onToggle}
        >
            {/* 卡片头部 */}
            <div className="p-4 flex items-start gap-4">
                {/* 头像 */}
                <div className="w-16 h-16 bg-ink/10 border-2 border-ink/20 overflow-hidden shrink-0">
                    <img
                        src={character.portrait}
                        alt={character.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 基本信息 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-ink truncate">{character.name}</h3>
                        <span className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase ${factionConfig.bgColor} ${factionConfig.color} rounded-sm`}>
                            <FactionIcon className="w-3 h-3" />
                            {factionConfig.label}
                        </span>
                    </div>
                    <p className="text-xs text-ink/60 font-mono">{character.englishName}</p>
                    <p className="text-sm text-ink/80 mt-1">{character.role}</p>

                    {/* 好感度进度条 */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="flex items-center gap-1 text-crimson">
                                <Heart className="w-3 h-3" />
                                好感度
                            </span>
                            <span className="font-mono">{character.affection}%</span>
                        </div>
                        <div className="h-2 bg-ink/10 border border-ink/20 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-crimson/60 to-crimson transition-all duration-500"
                                style={{ width: `${character.affection}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 展开图标 */}
                <div className="text-ink/40">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>

            {/* 展开的详细信息 */}
            {isExpanded && (
                <div className="border-t border-ink/20 p-4 bg-white/30 animate-in slide-in-from-top-2 duration-300 space-y-4">
                    {/* 基本资料 */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-bold text-ink/60">年龄：</span>{character.age}岁</div>
                        <div><span className="font-bold text-ink/60">国籍：</span>{character.nationality}</div>
                        <div className="col-span-2"><span className="font-bold text-ink/60">与你的关系：</span>{character.relationToPlayer}</div>
                    </div>

                    {/* 外貌 */}
                    <div>
                        <h4 className="font-display font-bold text-sm text-ink border-b border-ink/20 pb-1 mb-2">外貌特征</h4>
                        <p className="text-sm text-ink/80 leading-relaxed">{character.appearance}</p>
                    </div>

                    {/* 性格 */}
                    <div>
                        <h4 className="font-display font-bold text-sm text-ink border-b border-ink/20 pb-1 mb-2">性格特质</h4>
                        <p className="text-sm text-ink/80 leading-relaxed">{character.personality}</p>
                    </div>

                    {/* 背景 */}
                    <div>
                        <h4 className="font-display font-bold text-sm text-ink border-b border-ink/20 pb-1 mb-2">背景故事</h4>
                        <p className="text-sm text-ink/80 leading-relaxed">{character.background}</p>
                    </div>

                    {/* 能力 */}
                    <div>
                        <h4 className="font-display font-bold text-sm text-ink border-b border-ink/20 pb-1 mb-2">技能与专长</h4>
                        <div className="flex flex-wrap gap-2">
                            {character.abilities.map((ability, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-ink/5 border border-ink/10 text-xs text-ink/70"
                                >
                                    {ability}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 主组件
export const CharacterArchive: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterFaction, setFilterFaction] = useState<'all' | 'empire' | 'revolution' | 'neutral'>('all');

    const filteredNPCs = filterFaction === 'all'
        ? NPC_DATA
        : NPC_DATA.filter(npc => npc.faction === filterFaction);

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* 标题与过滤器 */}
            <div className="text-center space-y-4">
                <div className="inline-block">
                    <h2 className="font-display text-2xl font-bold text-ink tracking-wider uppercase">
                        人物档案馆
                    </h2>
                    <p className="text-sm text-ink/60 font-serif italic mt-1">Character Archives</p>
                </div>

                {/* 阵营过滤器 */}
                <div className="flex justify-center gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterFaction('all')}
                        className={`px-3 py-1 text-sm font-bold border transition-colors ${filterFaction === 'all'
                            ? 'bg-ink text-parchment border-ink'
                            : 'bg-transparent text-ink border-ink/30 hover:border-ink'
                            }`}
                    >
                        全部 ({NPC_DATA.length})
                    </button>
                    {Object.entries(FACTION_CONFIG).map(([key, config]) => {
                        const count = NPC_DATA.filter(n => n.faction === key).length;
                        const Icon = config.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterFaction(key as any)}
                                className={`px-3 py-1 text-sm font-bold border transition-colors flex items-center gap-1 ${filterFaction === key
                                    ? `${config.bgColor} ${config.color} ${config.borderColor}`
                                    : 'bg-transparent text-ink border-ink/30 hover:border-ink'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {config.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 角色卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNPCs.map(character => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        isExpanded={expandedId === character.id}
                        onToggle={() => setExpandedId(expandedId === character.id ? null : character.id)}
                    />
                ))}
            </div>

            {/* 底部装饰 */}
            <div className="text-center text-ink/30 text-sm font-mono pt-4 border-t border-ink/10">
                ❖ BABEL ARCHIVE SYSTEM ❖
            </div>
        </div>
    );
};
