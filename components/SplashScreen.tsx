import React, { useState, useRef, useEffect } from 'react';
import {
    Compass, Crown, Book, Star, Briefcase, MapPin, Users,
    Feather, Play, Pause, Volume2, VolumeX, Eye, GraduationCap,
    Shield, Flame, Lock, Zap, Scroll
} from 'lucide-react';

// ===== BILINGUAL CONTENT DATA =====

const WORLD_SETTING = {
    title: { zh: '世界观设定', en: 'World Setting' },
    cards: [
        {
            title: { zh: '帝国背景与魔法源泉', en: 'Imperial Background' },
            content: [
                {
                    zh: '架空世界的19世纪初，不列颠尼亚帝国率先发动了工业革命，一跃成为世界霸主，并向全世界发起殖民。',
                    en: 'In an alternate early 19th century, the Britannian Empire pioneered the Industrial Revolution, becoming the world\'s dominant power and launching global colonization.'
                },
                {
                    zh: '在这个世界观中，工业的力量源泉是白银、语言和魔法。刻有两种语言的银条能产生魔法、驱动工业，让不列颠尼亚帝国的军队所向披靡。',
                    en: 'In this world, industrial power stems from silver, language, and magic. Silver bars inscribed with two languages generate magic that drives industry and makes the Imperial army invincible.'
                },
                {
                    zh: '而牛津的巴别塔（又称"皇家翻译学院"）则是帝国培养全世界多语言人才，将他们打造为帝国武器的根据地。',
                    en: 'Oxford\'s Babel Tower (the Royal Institute of Translation) is the Empire\'s base for training multilingual talent worldwide, forging them into imperial weapons.'
                }
            ]
        },
        {
            title: { zh: '刻银术 (Silver-work)', en: 'Core Magic System' },
            content: [
                { zh: '核心媒介：银条 (Silver Bar)', en: 'Core Medium: Silver Bar' },
                { zh: '运作原理：配对 (Match-pair) 与 蚀刻 (Etch)。通过在银条上刻写词汇，利用语言间的"意义缺失" (Meaning Gap) 产生魔法效应。', en: 'Operating Principle: Match-pair and Etch. By inscribing vocabulary on silver bars, magic effects are generated through the "Meaning Gap" between languages.' }
            ]
        }
    ],
    factions: {
        title: { zh: '势力阵营', en: 'Factions' },
        items: [
            { name: { zh: '不列颠尼亚帝国', en: 'Britannian Empire' }, desc: { zh: '利用翻译学院扩张殖民霸权', en: 'Expanding colonial hegemony through the Translation Institute' } },
            { name: { zh: '赫耳墨斯社', en: 'Hermes Society' }, desc: { zh: '地下抵抗组织，从事破坏活动', en: 'Underground resistance organization engaged in sabotage' } },
            { name: { zh: '忠诚的破坏者', en: 'Loyal Saboteur' }, desc: { zh: '处于夹缝中的身份，不仅是学者，更是潜伏者', en: 'Caught between worlds - not just a scholar, but an infiltrator' } }
        ]
    }
};

const TOWER_FLOORS = [
    {
        level: 1,
        name: { zh: '大堂 (The Lobby)', en: 'The Lobby' },
        icon: 'Users',
        image: 'https://i.ibb.co/v4XfX0Dx/1.png',
        desc: { zh: '巴别塔与世俗世界交汇的边界，充满了商业与行政的喧嚣。', en: 'The boundary where Babel Tower meets the secular world, bustling with commerce and administration.' },
        access: { zh: '公开', en: 'Public' }
    },
    {
        level: 2,
        name: { zh: '文学系 (Literature Dept)', en: 'Literature Department' },
        icon: 'Book',
        image: 'https://i.ibb.co/3ypCX4Sm/2.png',
        desc: { zh: '翻译与比较文学的殿堂，培育帝国的语言武器。', en: 'The hall of translation and comparative literature, forging the Empire\'s linguistic weapons.' },
        access: { zh: '一年级生', en: 'First Years' }
    },
    {
        level: 3,
        name: { zh: '口译部 (Interpretation)', en: 'Interpretation Dept' },
        icon: 'Users',
        image: 'https://i.ibb.co/0R1ytgRw/3.png',
        desc: { zh: '外交口译培训，帝国对外谈判的人才库。', en: 'Diplomatic interpretation training, the Empire\'s talent pool for foreign negotiations.' },
        access: { zh: '三年级生', en: 'Third Years' }
    },
    {
        level: 4,
        name: { zh: '法务部 (Legal Dept)', en: 'Legal Department' },
        icon: 'Briefcase',
        image: 'https://i.ibb.co/GQnLWdYF/4.png',
        desc: { zh: '帝国法律与殖民地条约的翻译机构。', en: 'Translation institution for Imperial law and colonial treaties.' },
        access: { zh: '一年级生', en: 'First Years' }
    },
    {
        level: 5,
        name: { zh: '教授楼层 (Faculty Floor)', en: 'Faculty Floor' },
        icon: 'GraduationCap',
        image: 'https://i.ibb.co/SXQJXzhD/5.png',
        desc: { zh: '教授办公室与高级研讨室，巴别塔权力的核心。', en: 'Faculty offices and advanced seminar rooms, the core of Babel Tower\'s power.' },
        access: { zh: '受邀者', en: 'By Invitation' }
    },
    {
        level: 6,
        name: { zh: '参考资料室 (Reference Room)', en: 'Reference Room' },
        icon: 'Book',
        image: 'https://i.ibb.co/sJpFh2vG/6.png',
        desc: { zh: '珍贵典籍与稀有语言文献的宝库。', en: 'Treasury of precious texts and rare language documents.' },
        access: { zh: '全体师生', en: 'All Staff & Students' }
    },
    {
        level: 7,
        name: { zh: '刻银部 (Silver-working)', en: 'Silver-working Department' },
        icon: 'Zap',
        image: 'https://i.ibb.co/ymMxKz9P/7.png',
        desc: { zh: '最高机密的银条制造区域，只有四年级生方可进入。', en: 'Top-secret silver bar manufacturing area, accessible only to fourth-year students.' },
        access: { zh: '四年级生', en: 'Fourth Years Only' }
    },
    {
        level: 8,
        name: { zh: '禁忌区 (Forbidden Zone)', en: 'The Forbidden Zone' },
        icon: 'Lock',
        image: null,
        desc: { zh: '塔顶的神秘区域，据说藏有巴别塔最黑暗的秘密。', en: 'The mysterious apex of the Tower, said to hold Babel\'s darkest secrets.' },
        access: { zh: '禁止进入', en: 'FORBIDDEN' }
    }
];

const INTERNSHIP_PATHS = [
    {
        id: 'literature',
        title: { zh: '文学系', en: 'Literature Department' },
        subtitle: { zh: '语言与文化研究', en: 'Language & Culture Studies' },
        icon: 'Book',
        tags: ['Translation', 'Research', 'Academic'],
        core: {
            desc: { zh: '深入研究语言的本质，探索翻译的艺术与背叛。', en: 'Deep research into the nature of language, exploring the art and betrayal of translation.' },
            tasks: { zh: '文献翻译、词源研究、文化分析', en: 'Document translation, etymology research, cultural analysis' },
            rewards: { zh: '学术声望提升，可接触珍稀文献', en: 'Enhanced academic reputation, access to rare documents' }
        },
        paths: {
            empire: { title: { zh: '帝国路线', en: 'Imperial Path' }, desc: { zh: '成为帝国宣传机器的一部分，翻译殖民文献。', en: 'Become part of the Imperial propaganda machine, translating colonial documents.' } },
            resistance: { title: { zh: '抵抗路线', en: 'Resistance Path' }, desc: { zh: '暗中保存被禁文献，传播革命思想。', en: 'Secretly preserve banned documents, spread revolutionary ideas.' } }
        }
    },
    {
        id: 'legal',
        title: { zh: '法务部', en: 'Legal Department' },
        subtitle: { zh: '法律与条约翻译', en: 'Law & Treaty Translation' },
        icon: 'Briefcase',
        tags: ['Legal', 'Diplomacy', 'Power'],
        core: {
            desc: { zh: '翻译帝国法律与殖民地条约，语言即权力。', en: 'Translating Imperial law and colonial treaties - language is power.' },
            tasks: { zh: '条约起草、法律文件翻译、外交斡旋', en: 'Treaty drafting, legal document translation, diplomatic mediation' },
            rewards: { zh: '政治影响力，人脉资源', en: 'Political influence, network resources' }
        },
        paths: {
            empire: { title: { zh: '帝国路线', en: 'Imperial Path' }, desc: { zh: '帮助帝国起草不平等条约，巩固殖民统治。', en: 'Help the Empire draft unequal treaties, consolidating colonial rule.' } },
            resistance: { title: { zh: '抵抗路线', en: 'Resistance Path' }, desc: { zh: '在条约中埋下漏洞，为被殖民者保留希望。', en: 'Plant loopholes in treaties, preserving hope for the colonized.' } }
        }
    }
];

const MAGIC_PAIRS = [
    { words: { zh: '安 / Peace', en: 'An / Peace' }, lang: 'ZH-EN', diff: { zh: '"安"强调内心平静，"Peace"侧重外部冲突的缺失。', en: '"安" emphasizes inner tranquility, while "Peace" focuses on absence of external conflict.' }, effect: { zh: '创造宁静结界', en: 'Creates a tranquility barrier' } },
    { words: { zh: '義 / Justice', en: 'Yi / Justice' }, lang: 'ZH-EN', diff: { zh: '"義"包含道德责任与关系，"Justice"强调法律公正。', en: '"義" encompasses moral duty and relationships, "Justice" emphasizes legal fairness.' }, effect: { zh: '揭示隐藏的真相', en: 'Reveals hidden truths' } },
    { words: { zh: '龍 / Dragon', en: 'Long / Dragon' }, lang: 'ZH-EN', diff: { zh: '"龍"象征皇权与祥瑞，"Dragon"在西方代表邪恶与毁灭。', en: '"龍" symbolizes imperial power and auspiciousness, while Western "Dragon" represents evil and destruction.' }, effect: { zh: '引发强大的破坏力', en: 'Unleashes devastating power' } }
];

// ===== ICON COMPONENT =====
const IconComponent: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
    const icons: Record<string, React.ReactNode> = {
        Compass: <Compass className={className} />,
        Crown: <Crown className={className} />,
        Book: <Book className={className} />,
        Star: <Star className={className} />,
        Briefcase: <Briefcase className={className} />,
        MapPin: <MapPin className={className} />,
        Users: <Users className={className} />,
        Feather: <Feather className={className} />,
        Play: <Play className={className} />,
        Pause: <Pause className={className} />,
        Volume2: <Volume2 className={className} />,
        VolumeX: <VolumeX className={className} />,
        Eye: <Eye className={className} />,
        GraduationCap: <GraduationCap className={className} />,
        Shield: <Shield className={className} />,
        Flame: <Flame className={className} />,
        Lock: <Lock className={className} />,
        Zap: <Zap className={className} />,
        Scroll: <Scroll className={className} />
    };
    return <>{icons[name] || <Star className={className} />}</>;
};

// ===== AUDIO PLAYER COMPONENT =====
const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="flex items-center gap-2 bg-ink/90 px-4 py-2 rounded-full border border-gold/50 shadow-lg">
            <button onClick={togglePlay} className="text-gold hover:text-paper transition-colors p-1">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="w-16 h-1 bg-gold/30 rounded-full overflow-hidden">
                <div className={`h-full bg-gold ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: '60%' }} />
            </div>
            <button onClick={toggleMute} className="text-gold hover:text-paper transition-colors p-1">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
        </div>
    );
};

// ===== SECTION TITLE COMPONENT =====
const SectionTitle: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gold/50" />
            <div className="p-2 bg-ink rounded-full">
                <IconComponent name={icon} className="w-6 h-6 text-gold" />
            </div>
            <div className="w-16 h-px bg-gold/50" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-ink tracking-wider">{children}</h2>
    </div>
);

// ===== CARD COMPONENT =====
const Card: React.FC<{ title: string; subtitle?: string; className?: string; children: React.ReactNode }> = ({ title, subtitle, className = '', children }) => (
    <div className={`bg-paper-contrast border border-gold/30 rounded-sm shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>
        <div className="border-b border-gold/30 pb-3 mb-4">
            <h3 className="text-lg font-display font-bold text-ink">{title}</h3>
            {subtitle && <p className="text-xs text-ink/60 italic mt-1">{subtitle}</p>}
        </div>
        <div className="text-ink/80 font-serif">{children}</div>
    </div>
);

// ===== MAIN SPLASH SCREEN COMPONENT =====
interface SplashScreenProps {
    onStartGame: () => void;
}

type SectionType = 'world' | 'tower' | 'internship' | 'magic';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
    const [activeSection, setActiveSection] = useState<SectionType>('world');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections: { id: SectionType; label: { zh: string; en: string } }[] = [
        { id: 'world', label: { zh: '世界观', en: 'World' } },
        { id: 'tower', label: { zh: '巴别塔', en: 'Tower' } },
        { id: 'internship', label: { zh: '实习制度', en: 'Internship' } },
        { id: 'magic', label: { zh: '语言魔法', en: 'Magic' } }
    ];

    return (
        <div className="min-h-screen bg-paper text-ink font-serif">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-multiply"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }} />

            {/* Hero Section */}
            <header className="relative min-h-[20rem] py-12 flex items-center justify-center bg-ink overflow-hidden border-b-8 border-double border-gold">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 text-center px-4 mt-8">
                    {/* Audio Player */}
                    <div className="mb-6 flex justify-center">
                        <AudioPlayer />
                    </div>
                    {/* Logo */}
                    <div className="w-20 h-20 mx-auto mb-4 border-2 border-gold rounded-full flex items-center justify-center bg-ink/80 shadow-[0_0_15px_rgba(191,166,122,0.3)]">
                        <Compass className="w-10 h-10 text-gold" />
                    </div>
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-paper mb-2 tracking-wider"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        ROYAL INSTITUTE OF TRANSLATION
                    </h1>
                    <p className="text-lg text-gold tracking-[0.2em] uppercase mb-2">皇家翻译学院</p>
                    <p className="text-sm text-paper/70 tracking-widest">Babel · Oxford · Britannia</p>
                </div>
            </header>

            {/* Navigation */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-gold ${isScrolled ? 'bg-ink shadow-xl py-2' : 'bg-ink/90 py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-10 text-paper text-xs md:text-base font-medium tracking-wide">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`hover:text-gold transition-colors uppercase relative group ${activeSection === section.id ? 'text-gold' : ''}`}
                        >
                            {section.label.zh} / {section.label.en}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full ${activeSection === section.id ? 'w-full' : ''}`} />
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10">

                {/* World Setting Section */}
                {activeSection === 'world' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon="Compass">{WORLD_SETTING.title.zh} / {WORLD_SETTING.title.en}</SectionTitle>

                        <div className="grid md:grid-cols-2 gap-8">
                            {WORLD_SETTING.cards.map((card, idx) => (
                                <Card key={idx} title={`${card.title.zh}`} subtitle={card.title.en}>
                                    <div className="space-y-4 text-sm">
                                        {card.content.map((para, pIdx) => (
                                            <div key={pIdx}>
                                                <p className="text-ink/90 mb-1">{para.zh}</p>
                                                <p className="text-ink/60 text-xs italic">{para.en}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card title={`${WORLD_SETTING.factions.title.zh}`} subtitle={WORLD_SETTING.factions.title.en}>
                            <ul className="space-y-4">
                                {WORLD_SETTING.factions.items.map((faction, idx) => (
                                    <li key={idx} className="border-l-2 border-gold pl-4">
                                        <strong className="text-ink block">{faction.name.zh} / {faction.name.en}</strong>
                                        <p className="text-sm text-ink/70">{faction.desc.zh}</p>
                                        <p className="text-xs text-ink/50 italic">{faction.desc.en}</p>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <div className="bg-ink text-paper p-8 rounded-sm shadow-xl border border-gold">
                            <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5" /> 表象与真相 / Facade vs. Truth
                            </h3>
                            <p className="leading-relaxed italic opacity-90">
                                "巴别塔不仅是一座塔，它是帝国的心脏，也是谎言的堡垒。在这里，不可见之物往往比可见之物更加致命。"
                            </p>
                            <p className="text-sm text-paper/60 mt-2 italic">
                                "Babel Tower is not just a tower - it is the Empire's heart and a fortress of lies. Here, the invisible is often more deadly than the visible."
                            </p>
                        </div>
                    </div>
                )}

                {/* Tower Section */}
                {activeSection === 'tower' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon="MapPin">巴别塔内部布局 / Inside Babel Tower</SectionTitle>

                        <div className="bg-ink text-paper p-6 mb-8 rounded border-t-4 border-gold shadow-xl">
                            <p className="italic text-lg text-center font-serif opacity-90">
                                "巴别塔不仅是一座学术殿堂，更是一台巨大的帝国机器。"
                            </p>
                            <p className="text-sm text-center text-paper/60 mt-2">
                                "Babel Tower is not just an academic hall, but a vast imperial machine."
                            </p>
                        </div>

                        <div className="space-y-6">
                            {TOWER_FLOORS.map((floor, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-6 items-stretch">
                                    {/* Floor Info Card */}
                                    <div className="flex-1 bg-paper-contrast p-6 rounded border border-gold/30 shadow-md hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-3 border-b border-gold/40 pb-2">
                                            <div className="w-10 h-10 bg-ink rounded-full flex items-center justify-center">
                                                <span className="text-gold font-bold text-sm">{floor.level}F</span>
                                            </div>
                                            <div className="p-2 bg-paper rounded-full">
                                                <IconComponent name={floor.icon} className="w-5 h-5 text-ink" />
                                            </div>
                                            <h3 className="text-lg font-display font-bold text-ink">{floor.name.zh}</h3>
                                        </div>
                                        <p className="text-sm text-ink/80 mb-2">{floor.desc.zh}</p>
                                        <p className="text-xs text-ink/50 italic mb-3">{floor.desc.en}</p>
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${floor.level === 8 ? 'bg-crimson text-white' : 'bg-gold/20 text-ink'}`}>
                                            {floor.level === 8 && <Lock className="w-3 h-3" />}
                                            {floor.access.zh} / {floor.access.en}
                                        </div>
                                    </div>
                                    {/* Floor Image */}
                                    {floor.image && (
                                        <div className="w-full md:w-64 h-40 rounded border-2 border-gold shadow-lg overflow-hidden">
                                            <img src={floor.image} alt={floor.name.en} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    {floor.level === 8 && !floor.image && (
                                        <div className="w-full md:w-64 h-40 rounded border-2 border-crimson/50 bg-ink flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <Lock className="w-8 h-8 text-crimson mx-auto mb-2" />
                                                <span className="text-crimson text-xs uppercase tracking-widest font-bold">RESTRICTED</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Internship Section */}
                {activeSection === 'internship' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon="Briefcase">实习与抉择 / Internship & Paths</SectionTitle>

                        <div className="mb-8 p-4 bg-ink text-gold rounded text-center font-serif italic border border-gold/30">
                            "实习不仅是工作，更是关于掠夺与权力的选择。你将成为谁？"
                            <br />
                            <span className="text-paper/60 text-sm">"Internship is not just work - it's a choice about plunder and power. Who will you become?"</span>
                        </div>

                        <div className="space-y-8">
                            {INTERNSHIP_PATHS.map((dept) => (
                                <div key={dept.id} className="bg-paper-contrast border border-gold/30 rounded shadow-lg overflow-hidden flex flex-col md:flex-row">
                                    <div className="bg-paper p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gold/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-ink rounded-full text-gold">
                                                <IconComponent name={dept.icon} className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-display font-bold text-ink">{dept.title.zh}</h3>
                                                <p className="text-xs text-ink/60 italic">{dept.title.en} · {dept.subtitle.en}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {dept.tags.map(tag => (
                                                <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-ink/10 text-ink rounded border border-ink/20">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="space-y-3 text-sm text-ink/80">
                                            <div>
                                                <strong className="block text-ink mb-1 flex items-center gap-1"><Star className="w-3 h-3" /> 核心体验</strong>
                                                <p>{dept.core.desc.zh}</p>
                                                <p className="text-xs text-ink/50 italic">{dept.core.desc.en}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 bg-paper/50">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-4 text-center">Dual Perspectives · 双重立场</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white border-t-4 border-blue-900 p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                    <Crown className="w-4 h-4" /> {dept.paths.empire.title.zh}
                                                </h5>
                                                <p className="text-sm text-ink/70">{dept.paths.empire.desc.zh}</p>
                                                <p className="text-xs text-ink/50 italic mt-1">{dept.paths.empire.desc.en}</p>
                                            </div>
                                            <div className="bg-white border-t-4 border-crimson p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <h5 className="font-bold text-crimson mb-2 flex items-center gap-2">
                                                    <Flame className="w-4 h-4" /> {dept.paths.resistance.title.zh}
                                                </h5>
                                                <p className="text-sm text-ink/70">{dept.paths.resistance.desc.zh}</p>
                                                <p className="text-xs text-ink/50 italic mt-1">{dept.paths.resistance.desc.en}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Magic Section */}
                {activeSection === 'magic' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon="Star">语言魔法 / Language Magic</SectionTitle>

                        <div className="mb-8 p-6 bg-ink text-paper rounded-lg shadow-xl border-l-4 border-gold">
                            <p className="italic font-serif leading-relaxed">
                                "翻译即背叛。正是这种背叛——这种词义在跨越语言边界时不可避免的流失与扭曲——创造了刻银术的力量。"
                            </p>
                            <p className="text-sm text-paper/60 mt-2 italic">
                                "Translation is betrayal. It is precisely this betrayal - the inevitable loss and distortion of meaning when crossing linguistic boundaries - that creates the power of Silver-work."
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MAGIC_PAIRS.map((pair, idx) => (
                                <div key={idx} className="bg-paper-contrast p-5 rounded shadow-md hover:shadow-lg transition-all border border-gold/30">
                                    <div className="flex justify-between items-start mb-3 pb-2 border-b border-gold/30">
                                        <span className="font-display font-bold text-lg text-ink">{pair.words.zh}</span>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-ink text-gold">{pair.lang}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest mb-1 text-ink/60 flex items-center gap-1">
                                                <Scroll className="w-3 h-3" /> 语义差异 / Gap
                                            </h4>
                                            <p className="text-sm text-ink/80 pl-2 border-l-2 border-gold/50">{pair.diff.zh}</p>
                                            <p className="text-xs text-ink/50 italic pl-2 mt-1">{pair.diff.en}</p>
                                        </div>
                                        <div className="p-3 rounded bg-ink/5">
                                            <h4 className="text-xs font-bold px-2 py-0.5 rounded inline-block mb-1 shadow-sm text-gold bg-ink">
                                                <Zap className="w-3 h-3 inline mr-1" /> 魔法效果
                                            </h4>
                                            <p className="text-sm font-medium text-ink">{pair.effect.zh}</p>
                                            <p className="text-xs text-ink/50 italic">{pair.effect.en}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Start Game Button */}
                <div className="mt-16 text-center">
                    <div className="w-24 h-px bg-gold mx-auto mb-8" />
                    <button
                        onClick={onStartGame}
                        className="group relative inline-flex items-center justify-center px-10 py-4 font-display font-bold text-white transition-all duration-300 bg-crimson hover:bg-crimson/80 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson cursor-pointer rounded-sm border border-crimson/50"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-sm opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                        <span className="relative flex items-center gap-3 tracking-widest uppercase">
                            <Feather className="w-5 h-5" />
                            <span>进入巴别塔 / Enter Babel Tower</span>
                        </span>
                    </button>
                    <p className="mt-4 text-xs text-ink/50 uppercase tracking-[0.2em]">
                        By clicking above, you pledge your tongue to the Empire.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-ink text-paper/60 py-8 border-t border-gold">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm font-serif italic">
                        Royal Institute of Translation · Oxford · Anno Domini 1830
                    </p>
                    <p className="text-xs mt-2 text-paper/40">
                        皇家翻译学院 · 牛津 · 公元1830年
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SplashScreen;
