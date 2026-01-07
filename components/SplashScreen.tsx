import React, { useState, useRef, useEffect } from 'react';
import {
    Compass, Play, Pause, Volume2, VolumeX, Crown, Feather, Users,
    Globe, Scale, GraduationCap, Book, Shield, Flame, MapPin, Library,
    Landmark, Hammer, Star, Eye, Lock, AlertTriangle, Anchor, Music, Zap, Heart, Coffee, Briefcase
} from 'lucide-react';

// ===== TYPES =====
interface SplashScreenProps {
    onStartGame: () => void;
}

// ===== CONSTANTS =====
const MUSIC_URL = 'https://files.catbox.moe/z5yg2z.mp3';

// 8 Main Characters with images
const CHARACTERS = [
    {
        name: 'William Norman', cnName: '威廉·诺曼',
        role: '36岁 / 教授 / 诺曼家族家主', origin: 'Britannia Empire',
        image: 'https://i.ibb.co/zWbhSsyn/image.png',
        desc: '温文尔雅的巴别塔教授，你的养父。擅长人情世故与外交辞令的他，好像有着不为人知的另一面……',
        quote: '语言是武器，是阶梯，是帝国能够统治这个世界的根基。'
    },
    {
        name: 'Eleanor Norman', cnName: '埃莉诺·诺曼',
        role: '18岁 / 学生 / 社交名媛', origin: 'Britannia (Mixed)',
        image: 'https://i.ibb.co/nMhHSnHV/image.png',
        desc: '威廉18年前在大清生下的私生女，八面玲珑的社交名媛。柔弱和美貌的表象之下，好像也有着另一面……',
        quote: '在巴别塔，察言观色比任何魔法都管用。'
    },
    {
        name: 'Heinrich von Kleist', cnName: '海因里希·冯·克莱斯特',
        role: '26岁 / 学生 / 容克贵族', origin: 'Kingdom of Prussia',
        image: 'https://i.ibb.co/TDb8P8Hx/image.png',
        desc: '普鲁士容克贵族，退役军官。严谨的社会达尔文主义者，推崇秩序与力量。',
        quote: '如果不列颠尼亚如此轻易就能被你撼动……那它就不配存在。'
    },
    {
        name: 'Guan Qi', cnName: '关祁',
        role: '23岁 / 学生 / 八旗子弟', origin: 'Great Qing (Manchu)',
        image: 'https://i.ibb.co/gML1H8JS/image.png',
        desc: '大清两广总督之子。优雅的犬儒主义者和毒舌家。只想在混乱的世界做一个体面的闲人。',
        quote: '看着蠢货在我面前死掉会影响我的心情。'
    },
    {
        name: 'Minamoto Yuetsuki', cnName: '源结月',
        role: '19岁 / 学生 / 源氏贵族', origin: 'Japan',
        image: 'https://i.ibb.co/1tQW31L3/image.png',
        desc: '源氏贵族后裔。优雅神秘的东洋女人，总是在追求极致的美感、力量与控制权。',
        quote: '这间房的布置还差些意思...我必须成为最耀眼的那一个。'
    },
    {
        name: 'Sophia Obolensky', cnName: '索菲亚·奥博连斯基',
        role: '21岁 / 学生 / 流亡贵族', origin: 'Russian Empire',
        image: 'https://i.ibb.co/hRpDTP4k/image.png',
        desc: '沙俄流亡贵族。热情直率的激进革命者，与赫耳墨斯社有着千丝万缕的联系。',
        quote: '这该死的世界谁都可以死，唯独你不行！'
    },
    {
        name: 'Pedro de Sousa', cnName: '佩德罗·德·索萨',
        role: '19岁 / 学生 / 庄园主之子', origin: 'Empire of Brazil',
        image: 'https://i.ibb.co/cK27c402/image.png',
        desc: '巴西糖业大亨之子。享乐主义的乐天派，巴别塔最受欢迎的派对组织者。',
        quote: '走吧！我们去喝酒！今天我教你跳桑巴？'
    },
    {
        name: 'Colette Valois', cnName: '科莱特·瓦卢瓦',
        role: '27岁 / 教授 / 文学系主任', origin: 'France / Tunisia',
        image: 'https://i.ibb.co/0yr0sjS4/image.png',
        desc: '法兰西贵族，文学教授。极擅长感官魔法。她的面容明显是两种族裔的混血。',
        quote: '昨晚的月色太美了……所以我迟到了。'
    }
];

// Navigation sections (with apply at the rightmost)
const NAV_SECTIONS = [
    { id: 'world', label: '世界观 World', icon: Compass },
    { id: 'campus', label: '校园生活 Campus', icon: GraduationCap },
    { id: 'internship', label: '实习制度 Internship', icon: Globe },
    { id: 'magic', label: '语言魔法 Magic', icon: Star },
    { id: 'internal', label: '巴别塔 Tower', icon: Landmark },
    { id: 'people', label: '人物档案 People', icon: Users },
    { id: 'apply', label: '入学申请 Apply', icon: Feather },
];

// Magic Data
const MAGIC_DATA = [
    {
        id: 'utility', title: '实用类 (Utility)', icon: Anchor, isForbidden: false,
        description: '日常生活辅助、工业应用与物理性质改变。',
        descEn: 'Daily life assistance, industrial applications and physical property changes.',
        pairs: [
            { lang: '中英', words: '"稳" (Wěn) / "Stable"', diff: '"稳"含禾与急，引申为沉着、靠得住。', effect: '重心锚定：交通工具如被钉在地面般平稳。' },
            { lang: '日英', words: '"道" (Dō) / "Way"', diff: '"道"包含技艺修行的精神境界。', effect: '自动导航：心中想着目的地，双脚自动选择正确路径。' },
            { lang: '法英', words: '"Clef" / "Key"', diff: '"Clef"亦指乐谱中的谱号。', effect: '声波开锁：哼出特定音调即可开锁。' },
        ]
    },
    {
        id: 'entertainment', title: '娱乐类 (Entertainment)', icon: Music, isForbidden: false,
        description: '用于社交、表演与感官愉悦的戏法。',
        descEn: 'Tricks for social events, performances and sensory pleasure.',
        pairs: [
            { lang: '中英', words: '"韵" (Yùn) / "Rhyme"', diff: '"韵"指余韵、风度、悠长回味。', effect: '余音绕梁：旋律在听众脑海中清晰回荡数日。' },
            { lang: '日英', words: '"花火" (Hanabi) / "Fireworks"', diff: '字面意为"火之花"，赋予植物般生命力。', effect: '火树银花：烟花如真花般在空中盛开。' },
        ]
    },
    {
        id: 'medical', title: '治疗与心理类 (Medical & Mental)', icon: Heart, isForbidden: false,
        description: '针对肉体创伤与精神状态的干涉与治愈。',
        descEn: 'Intervention and healing for physical trauma and mental states.',
        pairs: [
            { lang: '中英', words: '"安" (Ān) / "Peace"', diff: '"安"字形含屋顶与女，意指家宅稳固。', effect: '精神镇静剂：创造极致安全感。' },
            { lang: '德英', words: '"Gestalt" / "Shape"', diff: '"Gestalt"指完形，整体大于部分之和。', effect: '肢体重塑：引导碎骨按原本结构自动归位。' },
        ]
    },
    {
        id: 'combat', title: '战斗类 (Combat)', icon: Zap, isForbidden: true,
        description: '具有直接破坏力或战术优势的攻击性刻银术。',
        descEn: 'Offensive silver-work with direct destructive power.',
        pairs: [
            { lang: '中英', words: '"煞" (Shà) / "Fiend"', diff: '"煞"指凶恶终结的气数或凶神。', effect: '生机断绝：伤口周围细胞坏死，极难愈合。' },
            { lang: '日英', words: '"斬る" (Kiru) / "Cut"', diff: '"斬る"带有武士道的决绝杀意。', effect: '锋利度增幅：将"杀意"转化为物理锋利度。' },
            { lang: '德英', words: '"Blitz" / "Lightning"', diff: '"Blitz"带有"闪电战"的军事突袭含义。', effect: '极速突袭：赋予超常反应速度与爆发力。' },
        ]
    },
    {
        id: 'stealth', title: '潜行类 (Stealth)', icon: Eye, isForbidden: true,
        description: '用于隐蔽行动、藏匿与消除踪迹的刻银术。',
        descEn: 'Silver-work for covert operations and concealment.',
        pairs: [
            { lang: '中英', words: '"潜" (Qián) / "Submerge"', diff: '"潜"含"潜伏、隐蔽、深藏不露"之意。', effect: '介质同化：融入环境，消除摩擦声与阻力。' },
            { lang: '日英', words: '"気配" (Kehai) / "Sign"', diff: '"気配"指第六感般的"气息"或氛围。', effect: '气息遮断：抹除存在感，让人下意识忽略。' },
        ]
    },
];

// Internship Data
const INTERNSHIP_DATA = [
    {
        id: 'legal', title: '法务部 (Legal Department)', scenarioName: '法务部实习',
        subtitle: '帝国的掠夺之手 The Hand of Plunder', icon: Scale,
        tags: ['现实主义商战', '律政惊悚', '资源管理'],
        core: { desc: '起草贸易条约，解决跨国纠纷。', tasks: '起草对外贸易条款；通过翻译为帝国赢得银矿开采权。', rewards: '金钱与佣金。' },
        paths: {
            imperialist: { title: '帝国精英路线 Imperial Elite', desc: '用法律构建和平框架，获得权贵赏识。' },
            resistance: { title: '反抗潜伏路线 Resistance Spy', desc: '在条约中寻找漏洞，传递情报给赫耳墨斯社。' }
        }
    },
    {
        id: 'literature', title: '文学部 (Literature)', scenarioName: '文学部实习',
        subtitle: '白银时代的社交场 The Socialite', icon: Feather,
        tags: ['恋爱模拟', '宫廷权谋', '上流社会'],
        core: { desc: '享乐主义的温床。武器是魅力、诗歌和八卦。', tasks: '参加精英沙龙；追求或被追求。', rewards: '情报与人脉。' },
        paths: {
            imperialist: { title: '帝国精英路线 Imperial Elite', desc: '社交界的宠儿，巩固阶级地位。' },
            resistance: { title: '反抗潜伏路线 Resistance Spy', desc: '戴着面具的间谍，套取机密。' }
        }
    },
    {
        id: 'interpretation', title: '口译部 (Interpretation)', scenarioName: '口译部实习',
        subtitle: '悬崖上的冒险家 The Adventurer', icon: Globe,
        tags: ['全球探险', '危机生存', '公路电影'],
        core: { desc: '随皇家海军和商船出海，作为沟通的桥梁。', tasks: '在持枪对峙的谈判桌上进行同声传译。', rewards: '风险极高，但能亲历世界。' },
        paths: {
            imperialist: { title: '帝国精英路线 Imperial Elite', desc: '象征帝国的理性声音，保护军队安全。' },
            resistance: { title: '反抗潜伏路线 Resistance Spy', desc: '赫耳墨斯社的地下联络人。' }
        }
    }
];

// Floors Data
const FLOORS_DATA = [
    { level: 1, name: '大堂 The Lobby', icon: Users, image: 'https://i.ibb.co/v4XfX0Dx/1.png', desc: '巴别塔与世俗世界交汇的边界。', descEn: 'The boundary where Babel meets the secular world.' },
    { level: 2, name: '法务部 Legal Dept', icon: Scale, image: 'https://i.ibb.co/kgwd2z83/2.png', desc: '被称为"帝国的齿轮"，创收最多的部门。', descEn: 'Called "the Gears of Empire", the highest revenue department.' },
    { level: 3, name: '口译部 Interpretation', icon: Coffee, image: 'https://i.ibb.co/Rp2w9r71/3.png', desc: '属于冒险家的流动空间。', descEn: 'A fluid space for adventurers.' },
    { level: 4, name: '文学系 Literature', icon: Feather, image: 'https://i.ibb.co/XkLdhB0J/4.png', desc: '保存着语言最纯粹的生命力。', descEn: 'Preserves the purest vitality of language.' },
    { level: 5, name: '参考资料室 Reference', icon: Library, image: 'https://i.ibb.co/wNhBKtWn/5.png', desc: '安静的学术宝库。', descEn: 'A quiet academic treasure trove.' },
    { level: 6, name: '教室 Instruction', icon: GraduationCap, image: 'https://i.ibb.co/Rk92J1p4/6.png', desc: '学习的紧张感和求知的渴望。', descEn: 'Tension of learning and thirst for knowledge.' },
    { level: 7, name: '办公室 Faculty', icon: Landmark, image: 'https://i.ibb.co/k2TSXX0k/7.png', desc: '教授与高级研究员的私人领地。', descEn: 'Private domain of professors and senior scholars.' },
    { level: 8, name: '刻银部 Silver-working', icon: Hammer, image: '', desc: '唯一的禁地，隐藏在重门之后。', descEn: 'The only forbidden zone, hidden behind heavy doors.' },
];

// ===== COMPONENTS =====

/** 复古音乐播放器 */
const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#bfa67a] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(191,166,122,0.2)] hover:bg-[#2a2a2a] transition-colors">
            <audio ref={audioRef} src={MUSIC_URL} loop />

            {/* Spinning Record */}
            <div className={`w-8 h-8 rounded-full border-2 border-[#5c4d32] bg-black flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                <div className="w-2 h-2 rounded-full bg-[#bfa67a]" />
            </div>

            <button onClick={togglePlay} className="flex items-center gap-2">
                {isPlaying ? <Pause className="w-4 h-4 text-[#bfa67a]" /> : <Play className="w-4 h-4 text-slate-400" />}
                <span className={`text-xs tracking-widest uppercase ${isPlaying ? 'text-[#bfa67a]' : 'text-slate-500'}`}>
                    {isPlaying ? 'Now Playing' : 'Play Music'}
                </span>
            </button>

            <button onClick={toggleMute} className="ml-2">
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#bfa67a]" />}
            </button>
        </div>
    );
};

/** Section Title Component */
const SectionTitle: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-center gap-3 mb-10 border-b-2 border-slate-400/30 pb-4">
        <div className="p-3 bg-slate-800 rounded-full border border-slate-600 shadow-inner text-slate-200">
            {icon}
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-wide font-serif">{children}</h2>
    </div>
);

/** Card Component */
const Card: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className = '' }) => (
    <div className={`bg-[#f0eadd] border border-[#d4c5a9] rounded-sm p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden ${className}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-20" />
        {title && <h3 className="text-xl font-bold text-slate-900 mb-1 font-serif">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-600 italic mb-4 border-b border-slate-300 pb-2 inline-block">{subtitle}</p>}
        <div className="text-slate-800 leading-relaxed">{children}</div>
    </div>
);

/** Silver Bar Component for magic system */
const SilverBar: React.FC<{ label: string; description: string }> = ({ label, description }) => (
    <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 border border-gray-400 rounded p-4 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 w-full">
        <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
            <span className="font-bold text-slate-800 tracking-widest uppercase text-sm">{label}</span>
        </div>
        <p className="text-xs text-slate-700 italic text-center px-2">{description}</p>
    </div>
);

/** Character Card */
const CharacterCard: React.FC<{ character: typeof CHARACTERS[0] }> = ({ character }) => (
    <div className="bg-[#f4f1ea] border border-[#d4c5a9] rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row">
            {/* Portrait */}
            <div className="w-full md:w-32 h-40 md:h-auto relative overflow-hidden flex-shrink-0">
                <img src={character.image} alt={character.cnName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]" />
            </div>
            {/* Info */}
            <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-slate-900 font-serif">{character.cnName}</span>
                    <span className="text-xs text-slate-500">({character.name})</span>
                </div>
                <div className="text-xs text-[#bfa67a] mb-2">{character.role} · {character.origin}</div>
                <p className="text-sm text-slate-700 mb-3">{character.desc}</p>
                <p className="text-xs italic text-slate-600 border-l-2 border-[#bfa67a] pl-2">"{character.quote}"</p>
            </div>
        </div>
    </div>
);

// ===== MAIN COMPONENT =====
export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
    const [activeSection, setActiveSection] = useState('apply');
    const [isScrolled, setIsScrolled] = useState(false);

    // Form state for admission
    const [charName, setCharName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
    const [personality, setPersonality] = useState('');
    const [appearance, setAppearance] = useState('');
    const [showLockedModal, setShowLockedModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#e6ded1] text-slate-900 font-serif">
            {/* Texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />

            {/* Hero Section */}
            <header className="relative min-h-[20rem] py-12 flex items-center justify-center bg-slate-900 overflow-hidden border-b-8 border-double border-[#bfa67a]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 text-center px-4 mt-8">
                    <div className="mb-6 flex justify-center">
                        <AudioPlayer />
                    </div>
                    <div className="w-20 h-20 mx-auto mb-4 border-2 border-[#bfa67a] rounded-full flex items-center justify-center bg-slate-800 shadow-[0_0_15px_rgba(191,166,122,0.3)]">
                        <Compass className="w-10 h-10 text-[#bfa67a]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#e6ded1] mb-2 tracking-wider font-serif" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        ROYAL INSTITUTE OF TRANSLATION
                    </h1>
                    <p className="text-lg text-[#bfa67a] tracking-[0.2em] uppercase">Babel · Oxford · Britannia</p>
                </div>
            </header>

            {/* Navigation */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#bfa67a] ${isScrolled ? 'bg-slate-900 shadow-xl py-2' : 'bg-slate-800 py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-8 text-[#e6ded1] text-xs md:text-sm font-medium tracking-wide">
                    {NAV_SECTIONS.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`hover:text-[#bfa67a] transition-colors uppercase relative group ${activeSection === section.id ? 'text-[#bfa67a]' : ''}`}
                        >
                            {section.label}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#bfa67a] transition-all duration-300 group-hover:w-full ${activeSection === section.id ? 'w-full' : ''}`} />
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10">

                {/* World Section */}
                {activeSection === 'world' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon={<Compass className="w-6 h-6" />}>世界观设定 (World Setting)</SectionTitle>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card title="帝国背景与魔法源泉" subtitle="Imperial Background">
                                <div className="space-y-4 text-slate-800">
                                    <p>架空世界的19世纪初，不列颠尼亚帝国率先发动了工业革命，一跃成为世界霸主，并向全世界发起殖民。</p>
                                    <p className="text-sm text-slate-600 italic">In the early 19th century of an alternate world, the Britannia Empire led the Industrial Revolution, becoming the world's hegemon.</p>
                                    <p>工业的力量源泉是白银、语言和魔法。刻有两种语言的银条能产生魔法、驱动工业。</p>
                                    <p className="text-sm text-slate-600 italic">The source of industrial power is silver, language, and magic. Silver bars inscribed with two languages can produce magic.</p>
                                    <p>牛津的巴别塔是帝国培养全世界多语言人才的根据地。</p>
                                </div>
                            </Card>
                            <Card title="刻银术 (Silver-work)" subtitle="Core Magic System">
                                <div className="space-y-4">
                                    <p><strong>核心媒介 Core Medium：</strong>银条 (Silver Bar)</p>
                                    <p><strong>运作原理 Mechanism：</strong>配对 (Match-pair) 与蚀刻 (Etch)。利用语言间的"意义缺失" (Meaning Gap) 产生魔法。</p>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <SilverBar label="TRANSLATION" description="翻译即背叛 Traduire c'est trahir" />
                                        <SilverBar label="ETYMOLOGY" description="词源溯源 Root of Words" />
                                    </div>
                                </div>
                            </Card>
                            <Card title="势力阵营 (Factions)" subtitle="The Conflict" className="md:col-span-2">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Crown className="w-5 h-5 text-blue-700 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">不列颠尼亚帝国 Britannia Empire</strong>
                                            <p className="text-sm text-slate-600">利用翻译学院扩张殖民霸权。Uses the translation academy to expand colonial hegemony.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Flame className="w-5 h-5 text-red-700 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">赫耳墨斯社 Hermes Society</strong>
                                            <p className="text-sm text-slate-600">地下抵抗组织，从事破坏活动。Underground resistance, engaging in sabotage.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Scale className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">忠诚的破坏者 Loyal Saboteur</strong>
                                            <p className="text-sm text-slate-600">处于夹缝中的潜伏者身份。A double agent caught between worlds.</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {/* Quote Block */}
                        <div className="bg-slate-800 text-[#e6ded1] p-8 rounded-sm shadow-xl border border-[#bfa67a]">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5" /> 表象与真相 (Facade vs. Truth)</h3>
                            <p className="leading-relaxed italic opacity-90">
                                "巴别塔不仅是一座塔，它是帝国的心脏，也是谎言的堡垒。在这里，不可见之物往往比可见之物更加致命。"
                            </p>
                            <p className="leading-relaxed italic opacity-70 text-sm mt-2">
                                "Babel is not just a tower—it is the heart of the Empire, and a fortress of lies. Here, the invisible is often more deadly than the visible."
                            </p>
                        </div>
                    </div>
                )}

                {/* Campus Section */}
                {activeSection === 'campus' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<GraduationCap className="w-6 h-6" />}>校园生活 (Campus Life)</SectionTitle>
                        <div className="w-full max-w-md mx-auto mb-8 aspect-square rounded-sm overflow-hidden border-2 border-[#bfa67a] shadow-lg">
                            <img src="https://i.ibb.co/HD1RKHwV/image.jpg" alt="Campus Life" className="w-full h-full object-cover" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2" title="学术氛围" subtitle="Ivory Tower & Privilege">
                                <p className="mb-4">学院被描述为"象牙塔"，充满了特权与隔绝感。学生们穿梭于学术研究与Buttery闲谈之间。</p>
                                <div className="bg-[#e0d6c5] p-4 rounded border border-[#c9bb9e]">
                                    <h4 className="font-bold text-slate-800 mb-2">Town and Gown</h4>
                                    <p className="text-sm text-slate-700">"市井与长袍"的对立。学院是与外界市民阶层隔离的堡垒。</p>
                                </div>
                            </Card>
                            <Card title="核心课程" subtitle="Curriculum">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2"><Book className="w-4 h-4" /> 语言研究</li>
                                    <li className="flex items-center gap-2"><Book className="w-4 h-4" /> 语音学</li>
                                    <li className="flex items-center gap-2"><Book className="w-4 h-4" /> 翻译工坊</li>
                                    <li className="flex items-center gap-2"><Book className="w-4 h-4" /> 解谜 - 寻找词义的缝隙</li>
                                </ul>
                            </Card>
                        </div>
                        <Card title="管制与安全" subtitle="Control & Safety">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> 银条管制</h4>
                                    <p className="text-sm text-slate-700">所有刻银术的使用都受到严格监控。必须遵守学术规则与安全协议。</p>
                                </div>
                                <div className="flex-1 md:border-l border-slate-300 md:pl-6">
                                    <h4 className="font-bold text-red-800 mb-2">触发机制</h4>
                                    <p className="text-sm text-slate-700">若在课堂外非法施法，将触发[怀疑/没收]事件。</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* People Section */}
                {activeSection === 'people' && (
                    <div className="animate-fade-in space-y-16">
                        <SectionTitle icon={<Users className="w-6 h-6" />}>人物档案 (Personnel)</SectionTitle>

                        {/* Academy Members */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2 mb-6">
                                <h3 className="text-2xl font-bold text-slate-800 font-serif">学院成员 (Academy Members)</h3>
                                <span className="text-xs font-bold bg-[#bfa67a] text-white px-3 py-1 rounded-full uppercase tracking-wider">Class of 1830</span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {CHARACTERS.map((char, idx) => (
                                    <CharacterCard key={idx} character={char} />
                                ))}
                            </div>
                        </div>

                        {/* Key Figures */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-red-900/30 pb-2 mb-6">
                                <h3 className="text-2xl font-bold text-red-950 font-serif">关键人物 (Key Figures)</h3>
                                <span className="text-xs font-bold bg-red-900 text-white px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Classified</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Queen Victoria */}
                                <div className="bg-slate-800 text-[#e6ded1] p-6 rounded-sm shadow-xl border border-[#bfa67a] relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#bfa67a] rounded-full text-slate-900"><Crown className="w-6 h-6" /></div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#bfa67a]">维多利亚女王</h4>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest">银之暴君 The Silver Tyrant</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">帝国的绝对核心，仅20岁的年轻女王。被巴别塔最高级刻银术滋养的"银色共生体"。</p>
                                    <p className="text-xs text-slate-400 italic">The absolute core of the Empire, a young queen of only 20 years.</p>
                                    <div className="text-xs font-bold text-red-400 border-t border-slate-600 pt-2 mt-2">ABILITY: 君权神授 The Sovereign's Word</div>
                                </div>
                                {/* Duncan */}
                                <div className="bg-[#e8e8e8] p-6 rounded-sm shadow-md border-l-4 border-slate-600">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-slate-700 rounded-full text-white"><Anchor className="w-6 h-6" /></div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900">邓肯·柯克伦</h4>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest">海狼 The Sea Wolf</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed mb-4">前皇家海军少将，现赫耳墨斯社军事指挥官。驾驶魔法潜艇"复仇女神号"潜伏在泰晤士河底。</p>
                                    <div className="text-xs font-bold text-slate-600 border-t border-slate-300 pt-2 mt-2">STATUS: 巴别塔头号通缉犯 Most Wanted</div>
                                </div>
                                {/* Matilda */}
                                <div className="bg-[#fcfbf9] p-6 rounded-sm shadow-md border-l-4 border-[#bfa67a]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-slate-200 rounded-full text-slate-500"><Heart className="w-6 h-6" /></div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-600">玛蒂尔达·诺曼</h4>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest">已故 Deceased</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">主角的生母，威廉的堂姐。曾经的帝国天才外交官，为了爱跨越国界与种族。</p>
                                    <div className="text-xs font-bold text-[#bfa67a] border-t border-slate-200 pt-2 mt-2">LEGACY: 跨越种族的爱与语言天赋</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Internship Section */}
                {activeSection === 'internship' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Briefcase className="w-6 h-6" />}>实习与抉择 (Internship & Factions)</SectionTitle>
                        <div className="p-4 bg-slate-800 text-[#bfa67a] rounded text-center font-serif italic border border-[#bfa67a]/30">
                            "实习不仅是工作，更是关于掠夺与权力的选择。你将成为谁？"<br />
                            <span className="text-sm opacity-70">"Internship is not just work—it's a choice about plunder and power. Who will you become?"</span>
                        </div>
                        <div className="space-y-8">
                            {INTERNSHIP_DATA.map((dept) => (
                                <div key={dept.id} className="bg-[#f0eadd] border border-[#d4c5a9] rounded shadow-lg overflow-hidden flex flex-col md:flex-row">
                                    <div className="bg-[#e6ded1] p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#d4c5a9] flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-slate-800 rounded-full text-[#bfa67a]">
                                                <dept.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{dept.title}</h3>
                                                <p className="text-xs text-slate-600 italic">{dept.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {dept.tags.map(tag => (
                                                <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded border border-slate-300">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="space-y-3 text-sm text-slate-700 mb-4">
                                            <div><strong className="text-slate-900">核心体验 Core:</strong> {dept.core.desc}</div>
                                            <div><strong className="text-slate-900">任务 Tasks:</strong> {dept.core.tasks}</div>
                                            <div><strong className="text-slate-900">奖励 Rewards:</strong> {dept.core.rewards}</div>
                                        </div>
                                        <button
                                            onClick={() => dept.id === 'interpretation' ? setShowLockedModal(true) : null}
                                            className="mt-auto w-full bg-slate-800 hover:bg-[#bfa67a] text-white hover:text-slate-900 font-serif py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center gap-2 uppercase text-xs tracking-widest font-bold shadow-lg"
                                        >
                                            {dept.id === 'interpretation' ? <><Lock className="w-3 h-3" /> 进入部门 Enter Dept</> : <><Play className="w-3 h-3" /> 入职报到 Start</>}
                                        </button>
                                    </div>
                                    <div className="flex-1 p-6 bg-slate-50/50">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Dual Perspectives · 双重立场</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white border-t-4 border-blue-900 p-4 shadow-sm">
                                                <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Crown className="w-4 h-4" /> {dept.paths.imperialist.title}</h5>
                                                <p className="text-sm text-slate-600">{dept.paths.imperialist.desc}</p>
                                            </div>
                                            <div className="bg-white border-t-4 border-red-800 p-4 shadow-sm">
                                                <h5 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Flame className="w-4 h-4" /> {dept.paths.resistance.title}</h5>
                                                <p className="text-sm text-slate-600">{dept.paths.resistance.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Locked Silver-working Section */}
                            <div className="relative p-1 bg-gradient-to-r from-[#bfa67a] via-slate-400 to-[#bfa67a] rounded shadow-2xl">
                                <div className="bg-slate-900 text-[#e6ded1] p-8 rounded relative overflow-hidden">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center gap-2 bg-red-900/80 text-red-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-red-500/50 animate-pulse">
                                            <Lock className="w-3 h-3" /> Locked until Final Year · 仅限高年级
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#bfa67a] font-serif mb-2">刻银部 (Silver-working)</h3>
                                        <p className="text-slate-400 italic">命运的终极分歧点 The Endgame</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-slate-800 border border-blue-900/50 p-5 rounded">
                                            <h4 className="text-blue-400 font-bold mb-2">路线 A：帝国的栋梁 Pillar of Empire</h4>
                                            <p className="text-sm text-slate-300">你选择了繁荣、秩序和财富。你成为了帝国的守护者。</p>
                                        </div>
                                        <div className="bg-slate-800 border border-red-900/50 p-5 rounded">
                                            <h4 className="text-red-400 font-bold mb-2">路线 B：赫耳墨斯的信徒 Disciple of Hermes</h4>
                                            <p className="text-sm text-slate-300">你选择了自由、尊严和革命。你点燃了革命火炬。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Magic Section */}
                {activeSection === 'magic' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Star className="w-6 h-6" />}>语言魔法 (Language Magic)</SectionTitle>
                        {/* Quote */}
                        <div className="mb-8 p-6 bg-slate-800 text-[#e6ded1] rounded-lg shadow-xl border-l-4 border-[#bfa67a]">
                            <p className="italic font-serif leading-relaxed">
                                "翻译即背叛。正是这种背叛——词义在跨越语言边界时的流失与扭曲——创造了刻银术的力量。"
                            </p>
                            <p className="italic font-serif leading-relaxed text-sm opacity-70 mt-2">
                                "Translation is betrayal. It's this betrayal—the loss and distortion of meaning across linguistic boundaries—that creates the power of silver-work."
                            </p>
                        </div>
                        {/* Magic Categories */}
                        <div className="space-y-12">
                            {MAGIC_DATA.map((category) => (
                                <div key={category.id} className={`rounded-lg p-6 ${category.isForbidden ? 'bg-slate-900 border border-red-900/50' : 'bg-[#f4f1ea] border border-[#d4c5a9]'}`}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`p-2 rounded-full ${category.isForbidden ? 'bg-red-950 text-red-500' : 'bg-slate-200 text-slate-700'}`}>
                                            <category.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-bold font-serif flex items-center gap-3 ${category.isForbidden ? 'text-red-100' : 'text-slate-800'}`}>
                                                {category.title}
                                                {category.isForbidden && <span className="px-2 py-1 bg-red-900 text-white text-xs font-bold uppercase tracking-widest border border-red-500 flex items-center gap-1"><Lock className="w-3 h-3" /> 禁术 Forbidden</span>}
                                            </h3>
                                            <p className={`text-sm italic ${category.isForbidden ? 'text-red-300/70' : 'text-slate-600'}`}>{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.pairs.map((pair, idx) => (
                                            <div key={idx} className={`p-4 rounded shadow-sm border ${category.isForbidden ? 'bg-[#1a1a1a] border-red-900/30' : 'bg-white border-slate-200'}`}>
                                                <div className={`flex justify-between items-start mb-2 pb-2 border-b ${category.isForbidden ? 'border-red-900/30' : 'border-slate-200'}`}>
                                                    <span className={`font-bold font-serif ${category.isForbidden ? 'text-red-50' : 'text-slate-900'}`}>{pair.words}</span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${category.isForbidden ? 'bg-red-900 text-red-100' : 'bg-slate-700 text-white'}`}>{pair.lang}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${category.isForbidden ? 'text-red-400' : 'text-slate-500'}`}>语义差异 Gap</h4>
                                                        <p className={`text-xs ${category.isForbidden ? 'text-gray-400' : 'text-slate-700'}`}>{pair.diff}</p>
                                                    </div>
                                                    <div className={`p-2 rounded ${category.isForbidden ? 'bg-red-950/20' : 'bg-slate-50'}`}>
                                                        <h4 className={`text-xs font-bold mb-1 ${category.isForbidden ? 'text-red-200' : 'text-[#bfa67a]'}`}><Zap className="w-3 h-3 inline mr-1" />效果 Effect</h4>
                                                        <p className={`text-xs font-medium ${category.isForbidden ? 'text-red-100' : 'text-slate-800'}`}>{pair.effect}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Internal Tower Section */}
                {activeSection === 'internal' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<MapPin className="w-6 h-6" />}>巴别塔内部布局 (Inside Babel)</SectionTitle>
                        {/* Quote Header */}
                        <div className="bg-slate-800 text-[#e6ded1] p-6 rounded border-t-4 border-[#bfa67a] shadow-xl">
                            <p className="italic text-lg text-center font-serif opacity-90">
                                "巴别塔不仅是一座学术殿堂，更是一台巨大的帝国机器。从熙攘的大堂到危险的刻银部，每一层都精密运转。"
                            </p>
                            <p className="italic text-sm text-center font-serif opacity-70 mt-2">
                                "Babel is not just an academic hall—it's a massive imperial machine. From the bustling lobby to the dangerous silver-working floor, every level operates with precision."
                            </p>
                        </div>
                        {/* Floor List */}
                        <div className="space-y-6">
                            {[...FLOORS_DATA].reverse().map((floor, index) => {
                                const FloorIcon = floor.icon;
                                return (
                                    <div key={floor.level} className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Floor Card */}
                                        <div className="w-full md:w-1/2 bg-[#f4f1ea] p-6 rounded border border-[#dcd0bc] shadow-md">
                                            <div className="flex items-center gap-3 mb-3 border-b border-[#bfa67a]/40 pb-2">
                                                <div className="w-10 h-10 bg-slate-800 text-[#bfa67a] font-bold flex items-center justify-center rounded-full text-sm">{floor.level}F</div>
                                                <div className="p-2 bg-slate-200 rounded-full"><FloorIcon className="w-5 h-5 text-slate-800" /></div>
                                                <h3 className="text-xl font-bold text-slate-900">{floor.name}</h3>
                                            </div>
                                            <p className="text-sm text-slate-600 italic">{floor.desc}</p>
                                            <p className="text-xs text-slate-500 mt-1">{floor.descEn}</p>
                                        </div>
                                        {/* Floor Image */}
                                        <div className="w-full md:w-1/2">
                                            {floor.image ? (
                                                <div className="aspect-video rounded-sm border-2 border-[#bfa67a] shadow-lg overflow-hidden">
                                                    <img src={floor.image} alt={floor.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : floor.level === 8 && (
                                                <div className="aspect-video rounded-sm border-2 border-red-900/40 shadow-xl overflow-hidden bg-[#1a0f0f] flex items-center justify-center">
                                                    <div className="p-4 border border-red-900/30 bg-black/60 text-center">
                                                        <Lock className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                                        <span className="text-red-500/80 font-serif tracking-widest italic text-sm">这里是禁区… Restricted Area</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Apply/Admission Section */}
                {activeSection === 'apply' && (
                    <div className="animate-fade-in space-y-12">
                        <SectionTitle icon={<Feather className="w-6 h-6" />}>入学申请 (Admission)</SectionTitle>

                        <div className="max-w-3xl mx-auto bg-[#f4f1ea] border-2 border-[#bfa67a] p-8 md:p-12 shadow-2xl rounded-sm relative">
                            {/* Pending stamp */}
                            <div className="absolute top-4 right-4 w-24 h-24 border-4 border-red-900/30 rounded-full flex items-center justify-center -rotate-12 opacity-50">
                                <span className="text-red-900/50 font-bold text-xs uppercase tracking-widest border-t border-b border-red-900/30 py-1">Pending</span>
                            </div>

                            <div className="text-center mb-8 border-b-2 border-[#bfa67a]/30 pb-6">
                                <Crown className="w-12 h-12 text-[#bfa67a] mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 font-serif tracking-widest uppercase">Candidate Profile</h3>
                                <p className="text-sm text-slate-500 italic mt-1">Royal Institute of Translation · Oxford</p>
                            </div>

                            {/* Form */}
                            <div className="space-y-6 text-sm">
                                {/* Name & Age */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={charName}
                                            onChange={e => setCharName(e.target.value)}
                                            placeholder="Enter your name..."
                                            className="w-full bg-transparent border-b-2 border-slate-300 focus:border-[#bfa67a] outline-none py-1 text-lg font-bold transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                                        <input
                                            type="text"
                                            value={age}
                                            onChange={e => setAge(e.target.value)}
                                            placeholder="e.g. 18岁"
                                            className="w-full bg-transparent border-b-2 border-slate-300 focus:border-[#bfa67a] outline-none py-1 text-lg font-bold transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                                    <div className="flex flex-wrap items-center gap-4">
                                        {(['female', 'male', 'other'] as const).map(g => (
                                            <label key={g} className="inline-flex items-center cursor-pointer">
                                                <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} className="mr-2" />
                                                <span>{g === 'female' ? '女 (Female)' : g === 'male' ? '男 (Male)' : '其他 (Other)'}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Static Info */}
                                <div className="grid grid-cols-3 gap-4 bg-slate-100 p-3 rounded border border-slate-200 text-xs">
                                    <div>
                                        <span className="block text-slate-400 uppercase mb-1">Origin</span>
                                        <span className="font-bold text-slate-700">China</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 uppercase mb-1">Nationality</span>
                                        <span className="font-bold text-slate-700">不列颠尼亚帝国</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 uppercase mb-1">Ethnicity</span>
                                        <span className="font-bold text-slate-700">中英混血</span>
                                    </div>
                                </div>

                                {/* Personality & Appearance */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Personality</label>
                                        <input
                                            type="text"
                                            value={personality}
                                            onChange={e => setPersonality(e.target.value)}
                                            placeholder="e.g. 坚韧, 敏感..."
                                            className="w-full bg-transparent border-b-2 border-slate-300 focus:border-[#bfa67a] outline-none py-1 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Appearance</label>
                                        <input
                                            type="text"
                                            value={appearance}
                                            onChange={e => setAppearance(e.target.value)}
                                            placeholder="e.g. 身高183cm，黑发, 灰瞳..."
                                            className="w-full bg-transparent border-b-2 border-slate-300 focus:border-[#bfa67a] outline-none py-1 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Guardian */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Guardian</label>
                                    <span className="block text-lg font-bold text-slate-900 border-b border-slate-300 pb-1 bg-slate-50/50 cursor-not-allowed">Professor 威廉·诺曼</span>
                                </div>

                                {/* Background */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Background Note</label>
                                    <p className="leading-relaxed text-slate-700 italic border-l-2 border-[#bfa67a] pl-3 text-xs md:text-sm">
                                        曾任不列颠尼亚帝国驻清外交官的母亲去世后，你被亲戚威廉教授收养。你的母语是你最大的武器，也是你最大的原罪。这是一个关于语言、抗争或荣耀的故事。
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col items-center justify-center mt-12">
                                <button
                                    onClick={onStartGame}
                                    className="group relative inline-flex items-center justify-center px-8 py-3 font-serif font-bold text-white transition-all duration-200 bg-red-900 hover:bg-red-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 cursor-pointer"
                                >
                                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                                    <span className="relative flex items-center gap-2 tracking-widest uppercase">
                                        <Feather className="w-5 h-5" /> 进入诺曼庄园 / Enter Norman Manor
                                    </span>
                                </button>
                                <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-[0.2em]">By clicking above, you pledge your tongue to the Empire.</p>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-[#bfa67a] mt-12">
                <p className="font-serif italic mb-2">"Language is the key to the world."</p>
                <p className="text-xs uppercase tracking-widest opacity-50">© 1830 Royal Institute of Translation. All Rights Reserved.</p>
            </footer>

            {/* Locked Modal */}
            {showLockedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLockedModal(false)} />
                    <div className="relative bg-[#f0eadd] border-2 border-[#bfa67a] p-8 max-w-md w-full rounded shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="p-3 bg-slate-800 rounded-full border border-[#bfa67a]">
                                <Lock className="w-8 h-8 text-[#bfa67a]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">权限受限 (Access Denied)</h3>
                        <p className="text-slate-700 italic mb-6 leading-relaxed border-t border-b border-[#bfa67a]/30 py-4 my-4">
                            "仅限临近高年级学生进入。请先从开局玩起吧！"<br />
                            <span className="text-sm opacity-70">"Only final year students may enter. Please start from the beginning!"</span>
                        </p>
                        <button
                            onClick={() => setShowLockedModal(false)}
                            className="bg-slate-800 text-[#bfa67a] hover:bg-[#bfa67a] hover:text-slate-900 px-8 py-2 rounded transition-colors duration-200 font-bold uppercase tracking-widest text-xs"
                        >
                            返回 (Return)
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default SplashScreen;
