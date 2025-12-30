import React, { useState } from 'react';
import {
    Users, Scale, Globe, Feather, Library, GraduationCap,
    Landmark, Hammer, Lock, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

interface FloorData {
    level: number;
    name: string;
    englishName: string;
    icon: React.ReactNode;
    description: string;
    details: string;
    accessLevel: 'public' | 'member' | 'restricted' | 'classified';
    requiredGrade: number;
}

interface TowerMapProps {
    currentGrade?: number;  // 玩家当前年级 (1-4)
    currentLocation?: string;
    onFloorClick?: (floor: FloorData) => void;
}

const FLOORS: FloorData[] = [
    {
        level: 8,
        name: '刻银部',
        englishName: 'Silver-working Department',
        icon: <Hammer className="w-5 h-5" />,
        description: '唯一的禁地，隐藏在重门和墙壁之后的工业车间。',
        details: '看起来像工厂车间。空气中充满嗡嗡声、钻孔声和金属鸣响。学者们像机械师一样工作，长袍上沾染银粉。因实验危险，设有厚重防火门。',
        accessLevel: 'classified',
        requiredGrade: 3
    },
    {
        level: 7,
        name: '教授办公室',
        englishName: 'Faculty Offices',
        icon: <Landmark className="w-5 h-5" />,
        description: '教授与高级研究员的私人领地，权力中枢。',
        details: '房间堆满书籍、私人信件和未完手稿。这里是决策中心，也是导师与学生一对一指导的场所。',
        accessLevel: 'restricted',
        requiredGrade: 2
    },
    {
        level: 6,
        name: '教室',
        englishName: 'Instruction Rooms',
        icon: <GraduationCap className="w-5 h-5" />,
        description: '从基础拉丁语变格到复杂翻译理论的传授之地。',
        details: '楼层中央的玻璃展柜下陈列着珍贵的《语法汇编》，红色皮革封面在灯光下闪着魔法般的光泽。',
        accessLevel: 'member',
        requiredGrade: 1
    },
    {
        level: 5,
        name: '参考资料室',
        englishName: 'Reference Materials',
        icon: <Library className="w-5 h-5" />,
        description: '安静的学术宝库，拥有世界上每种语言的词典。',
        details: '海量的初级读本、语法书、文选。每种语言至少有四个版本的词典。只有翻动书页和偶尔的低语声。',
        accessLevel: 'member',
        requiredGrade: 1
    },
    {
        level: 4,
        name: '文学系',
        englishName: 'Literature Department',
        icon: <Feather className="w-5 h-5" />,
        description: '保存着语言最纯粹的生命力，受上流社会青睐。',
        details: '研究非英语的小说、诗歌和美学。到处是珍贵的外国小说和诗集，旨在捕捉语言的灵魂与艺术。',
        accessLevel: 'member',
        requiredGrade: 1
    },
    {
        level: 3,
        name: '口译部',
        englishName: 'Interpretation Department',
        icon: <Globe className="w-5 h-5" />,
        description: '冒险家的流动空间，译员们短暂的休憩之所。',
        details: '通常空荡荡的，只有歪歪扭扭的桌子和几个还没收走的茶杯——大部分学者都在海外执行任务。',
        accessLevel: 'member',
        requiredGrade: 2
    },
    {
        level: 2,
        name: '法务部',
        englishName: 'Legal Department',
        icon: <Scale className="w-5 h-5" />,
        description: '被称为"帝国的齿轮"，巴别塔创收最多的部门。',
        details: '处理国际条约、海外贸易协定及帝国法律文件。学者们埋首于翻译《拿破仑法典》等文本。',
        accessLevel: 'member',
        requiredGrade: 1
    },
    {
        level: 1,
        name: '大堂',
        englishName: 'The Lobby',
        icon: <Users className="w-5 h-5" />,
        description: '巴别塔与世俗世界交汇的边界，充满商业气息。',
        details: '唯一对公众开放的区域。设有繁忙的收银窗口，市民和商人在此排队申请银条或公共工程维护。',
        accessLevel: 'public',
        requiredGrade: 0
    }
];

const ACCESS_CONFIG = {
    public: { label: '公开', color: 'bg-green-500', textColor: 'text-green-700' },
    member: { label: '学员', color: 'bg-blue-500', textColor: 'text-blue-700' },
    restricted: { label: '受限', color: 'bg-amber-500', textColor: 'text-amber-700' },
    classified: { label: '机密', color: 'bg-crimson', textColor: 'text-crimson' }
};

const FloorCard: React.FC<{
    floor: FloorData;
    isExpanded: boolean;
    isLocked: boolean;
    isCurrent: boolean;
    onToggle: () => void;
}> = ({ floor, isExpanded, isLocked, isCurrent, onToggle }) => {
    const accessConfig = ACCESS_CONFIG[floor.accessLevel];

    return (
        <div
            className={`
        relative border-2 transition-all duration-300 overflow-hidden
        ${isCurrent ? 'border-gold bg-gold/10 shadow-lg' : 'border-ink/20 bg-white/60'}
        ${isLocked ? 'opacity-60' : 'hover:border-ink/40 cursor-pointer'}
      `}
            onClick={() => !isLocked && onToggle()}
        >
            {/* Floor Number Badge */}
            <div className="absolute top-0 left-0 bg-ink text-parchment font-mono font-bold text-lg w-10 h-10 flex items-center justify-center">
                {floor.level}F
            </div>

            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-ink/20 flex items-center justify-center z-10">
                    <div className="bg-ink/80 text-parchment px-3 py-1 rounded-sm text-sm font-bold flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        需要 {floor.requiredGrade} 年级权限
                    </div>
                </div>
            )}

            {/* Current Location Indicator */}
            {isCurrent && (
                <div className="absolute top-2 right-2 bg-gold text-ink px-2 py-0.5 text-xs font-bold rounded-sm animate-pulse">
                    当前位置
                </div>
            )}

            {/* Main Content */}
            <div className="pl-12 pr-4 py-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-sm ${accessConfig.color}/10 ${accessConfig.textColor}`}>
                            {floor.icon}
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-ink">{floor.name}</h4>
                            <p className="text-xs text-ink/50 font-mono">{floor.englishName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${accessConfig.color}/20 ${accessConfig.textColor}`}>
                            {accessConfig.label}
                        </span>
                        {!isLocked && (
                            isExpanded ? <ChevronUp className="w-4 h-4 text-ink/50" /> : <ChevronDown className="w-4 h-4 text-ink/50" />
                        )}
                    </div>
                </div>

                <p className="text-sm text-ink/70 mt-2 italic">{floor.description}</p>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-ink/10 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-ink/80 leading-relaxed">{floor.details}</p>

                        {floor.accessLevel === 'classified' && (
                            <div className="mt-3 flex items-start gap-2 p-2 bg-crimson/10 border border-crimson/20 rounded-sm">
                                <AlertTriangle className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                                <p className="text-xs text-crimson">
                                    未经授权进入此区域将触发安保警报，并可能导致怀疑度大幅增加。
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const TowerMap: React.FC<TowerMapProps> = ({
    currentGrade = 1,
    currentLocation = '巴别塔 - 教室楼层',
    onFloorClick
}) => {
    const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

    const handleToggleFloor = (level: number) => {
        setExpandedFloor(prev => prev === level ? null : level);
    };

    const isFloorLocked = (floor: FloorData) => currentGrade < floor.requiredGrade;
    const isCurrentFloor = (floor: FloorData) => currentLocation.includes(floor.name);

    return (
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center border-b-2 border-gold pb-4">
                <h3 className="font-display text-2xl font-bold text-ink">巴别塔</h3>
                <p className="text-sm text-ink/60 italic mt-1">Royal Institute of Translation · Oxford</p>
            </div>

            {/* Player Grade Info */}
            <div className="flex items-center justify-between p-3 bg-ink/5 border border-ink/10 rounded-sm">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/50">当前权限等级</span>
                    <p className="font-display font-bold text-ink">{currentGrade} 年级</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/50">可访问楼层</span>
                    <p className="font-mono text-ink">
                        {FLOORS.filter(f => !isFloorLocked(f)).length} / {FLOORS.length}
                    </p>
                </div>
            </div>

            {/* Tower Visualization */}
            <div className="relative">
                {/* Decorative Tower Frame */}
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-ink/20 to-ink/40"></div>
                <div className="absolute -right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-ink/20 to-ink/40"></div>

                {/* Floor Stack */}
                <div className="space-y-2 relative z-10">
                    {FLOORS.map(floor => (
                        <FloorCard
                            key={floor.level}
                            floor={floor}
                            isExpanded={expandedFloor === floor.level}
                            isLocked={isFloorLocked(floor)}
                            isCurrent={isCurrentFloor(floor)}
                            onToggle={() => {
                                handleToggleFloor(floor.level);
                                if (onFloorClick && !isFloorLocked(floor)) {
                                    onFloorClick(floor);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-xs border-t border-ink/10 pt-4">
                {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${config.color}`}></div>
                        <span className="text-ink/60">{config.label}</span>
                    </div>
                ))}
            </div>

            {/* Navigation Tip */}
            <div className="text-center text-xs text-ink/50 italic">
                点击楼层查看详情。不同年级拥有不同的通行权限。
            </div>
        </div>
    );
};
