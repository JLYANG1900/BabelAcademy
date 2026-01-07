import React, { useState, useRef, useEffect } from 'react';
import {
    Compass, Play, Pause, Volume2, VolumeX, Crown, Feather, Users,
    Globe, Scale, GraduationCap, Book, Shield, Flame, MapPin, Library,
    Landmark, Hammer, Star, Eye
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
    { id: 'world', label: '世界观', icon: Compass },
    { id: 'campus', label: '校园生活', icon: GraduationCap },
    { id: 'internship', label: '实习制度', icon: Globe },
    { id: 'magic', label: '语言魔法', icon: Star },
    { id: 'internal', label: '巴别塔', icon: Landmark },
    { id: 'people', label: '人物档案', icon: Users },
    { id: 'apply', label: '入学申请', icon: Feather },
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
                                <div className="space-y-4">
                                    <p>架空世界的19世纪初，不列颠尼亚帝国率先发动了工业革命，一跃成为世界霸主。</p>
                                    <p>工业的力量源泉是白银、语言和魔法。刻有两种语言的银条能产生魔法、驱动工业。</p>
                                    <p>牛津的巴别塔是帝国培养全世界多语言人才的根据地。</p>
                                </div>
                            </Card>
                            <Card title="刻银术 (Silver-work)" subtitle="Core Magic System">
                                <div className="space-y-3">
                                    <p><strong>核心媒介：</strong>银条 (Silver Bar)</p>
                                    <p><strong>运作原理：</strong>配对 (Match-pair) 与蚀刻 (Etch)。利用语言间的"意义缺失"产生魔法。</p>
                                </div>
                            </Card>
                            <Card title="势力阵营" subtitle="The Conflict" className="md:col-span-2">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Crown className="w-5 h-5 text-blue-700 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">不列颠尼亚帝国</strong>
                                            <p className="text-sm text-slate-600">利用翻译学院扩张殖民霸权</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Flame className="w-5 h-5 text-red-700 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">赫耳墨斯社</strong>
                                            <p className="text-sm text-slate-600">地下抵抗组织，从事破坏活动</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Scale className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-slate-800">忠诚的破坏者</strong>
                                            <p className="text-sm text-slate-600">处于夹缝中的潜伏者身份</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
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
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Users className="w-6 h-6" />}>人物档案 (Personnel)</SectionTitle>
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
                )}

                {/* Internship Section */}
                {activeSection === 'internship' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Globe className="w-6 h-6" />}>实习与抉择 (Internship & Factions)</SectionTitle>
                        <div className="p-4 bg-slate-800 text-[#bfa67a] rounded text-center font-serif italic border border-[#bfa67a]/30">
                            "实习不仅是工作，更是关于掠夺与权力的选择。你将成为谁？"
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card title="法务部" subtitle="Legal Department">
                                <div className="space-y-3">
                                    <p className="text-sm">起草贸易条约，解决跨国纠纷。金钱与佣金是主要回报。</p>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="p-3 bg-blue-50 border-t-2 border-blue-800">
                                            <h4 className="font-bold text-blue-800 text-sm flex items-center gap-1"><Crown className="w-3 h-3" /> 帝国精英路线</h4>
                                            <p className="text-xs text-slate-600 mt-1">用法律构建和平框架，获得权贵赏识</p>
                                        </div>
                                        <div className="p-3 bg-red-50 border-t-2 border-red-800">
                                            <h4 className="font-bold text-red-800 text-sm flex items-center gap-1"><Flame className="w-3 h-3" /> 反抗潜伏路线</h4>
                                            <p className="text-xs text-slate-600 mt-1">在条约中寻找漏洞，传递情报</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card title="文学部" subtitle="Literature">
                                <div className="space-y-3">
                                    <p className="text-sm">战场是舞厅和沙龙，武器是魅力、诗歌和八卦。情报与人脉为主要回报。</p>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="p-3 bg-blue-50 border-t-2 border-blue-800">
                                            <h4 className="font-bold text-blue-800 text-sm flex items-center gap-1"><Crown className="w-3 h-3" /> 帝国精英路线</h4>
                                            <p className="text-xs text-slate-600 mt-1">社交界的宠儿，享受奢靡生活</p>
                                        </div>
                                        <div className="p-3 bg-red-50 border-t-2 border-red-800">
                                            <h4 className="font-bold text-red-800 text-sm flex items-center gap-1"><Flame className="w-3 h-3" /> 反抗潜伏路线</h4>
                                            <p className="text-xs text-slate-600 mt-1">戴着面具的间谍，套取机密</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Magic Section */}
                {activeSection === 'magic' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Star className="w-6 h-6" />}>语言魔法 (Language Magic)</SectionTitle>
                        <Card title="魔法分类" subtitle="Magic Categories">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: '实用类 (Utility)', desc: '日常生活辅助与物理性质改变', example: '"稳" (Wěn) / "Stable" → 重心锚定' },
                                    { name: '娱乐类 (Entertainment)', desc: '社交、表演与感官愉悦', example: '"韵" (Yùn) / "Rhyme" → 余音绕梁' },
                                    { name: '治疗类 (Medical)', desc: '肉体创伤与精神状态干涉', example: '"安" (Ān) / "Peace" → 精神镇静' },
                                    { name: '战斗类 (Combat)', desc: '具有直接破坏力的攻击性魔法', forbidden: true, example: '"煞" (Shà) / "Fiend" → 生机断绝' },
                                    { name: '潜行类 (Stealth)', desc: '隐蔽行动与消除踪迹', forbidden: true, example: '"潜" (Qián) / "Submerge" → 介质同化' },
                                ].map((cat, idx) => (
                                    <div key={idx} className={`p-4 border rounded ${cat.forbidden ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                                        <h4 className={`font-bold mb-2 ${cat.forbidden ? 'text-red-800' : 'text-slate-800'}`}>
                                            {cat.name}
                                            {cat.forbidden && <span className="ml-2 text-xs bg-red-800 text-white px-1 rounded">禁术</span>}
                                        </h4>
                                        <p className="text-xs text-slate-600 mb-2">{cat.desc}</p>
                                        <p className="text-xs italic text-[#bfa67a]">{cat.example}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Internal Tower Section */}
                {activeSection === 'internal' && (
                    <div className="animate-fade-in space-y-8">
                        <SectionTitle icon={<Landmark className="w-6 h-6" />}>巴别塔 (Internal)</SectionTitle>
                        <div className="space-y-4">
                            {[8, 7, 6, 5, 4, 3, 2, 1].map(level => {
                                const floors: Record<number, { name: string; eng: string; desc: string }> = {
                                    8: { name: '刻银部', eng: 'Silver-working', desc: '禁地，银条制造车间' },
                                    7: { name: '教授办公室', eng: 'Faculty Offices', desc: '教授与高级研究员的私人领地' },
                                    6: { name: '教室', eng: 'Instruction Rooms', desc: '从基础拉丁语到翻译理论' },
                                    5: { name: '参考资料室', eng: 'Reference Materials', desc: '学术宝库，世界语言词典' },
                                    4: { name: '文学系', eng: 'Literature', desc: '翻译与比较文学' },
                                    3: { name: '口译部', eng: 'Interpretation', desc: '外交口译培训' },
                                    2: { name: '法务部', eng: 'Legal Department', desc: '条约与法律翻译' },
                                    1: { name: '大堂', eng: 'The Lobby', desc: '唯一对公众开放的区域' },
                                };
                                const floor = floors[level];
                                return (
                                    <div key={level} className="flex items-center gap-4 p-4 bg-[#f4f1ea] border border-[#d4c5a9] rounded">
                                        <div className="w-12 h-12 bg-slate-800 text-[#bfa67a] font-bold text-lg flex items-center justify-center rounded-full">
                                            {level}F
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{floor.name} <span className="text-xs text-slate-500">({floor.eng})</span></h4>
                                            <p className="text-sm text-slate-600">{floor.desc}</p>
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
            <footer className="border-t border-[#bfa67a]/30 py-6 text-center text-xs text-slate-500">
                <p>巴别塔档案馆 | The Babel Archive · Oxford · MDCCCXXX</p>
            </footer>

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
