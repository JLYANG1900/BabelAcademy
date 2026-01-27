import React, { useState } from 'react';
import {
    Scale, Globe, Feather, Hammer,
    AlertTriangle, Lock,
    ChevronRight, Send, Crown, Flame
} from 'lucide-react';

// 任务类型定义
interface InternshipTask {
    id: string;
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    factionTendency: 'empire' | 'revolution' | 'neutral';
}

interface Department {
    id: string;
    name: string;
    englishName: string;
    floor: number;
    icon: React.ReactNode;
    coreExperience: string;
    rewardType: string;
    rewardDescription: string;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    tasks: InternshipTask[];
    isLocked?: boolean;
    lockReason?: string;
}

// 风险等级配置
const RISK_CONFIG = {
    low: { label: 'LOW RISK', dots: '●' },
    medium: { label: 'MED RISK', dots: '●●' },
    high: { label: 'HIGH RISK', dots: '●●●' },
    extreme: { label: 'EXTREME', dots: '●●●●' }
};

// 阵营倾向配置
const FACTION_TENDENCY = {
    empire: { label: 'EMPIRE', icon: Crown },
    revolution: { label: 'REVOLT', icon: Flame },
    neutral: { label: 'NEUTRAL', icon: Scale }
};

// 部门数据
const DEPARTMENTS: Department[] = [
    {
        id: 'legal',
        name: '法务部',
        englishName: 'Legal Department',
        floor: 2,
        icon: <Scale className="w-5 h-5" />,
        coreExperience: '起草贸易条约，解决跨国纠纷。这里是帝国商业运作的核心枢纽。',
        rewardType: '💰 金钱与佣金',
        rewardDescription: '学生在学院获得额外资金的主要来源。',
        riskLevel: 'low',
        tasks: [
            {
                id: 'legal_1',
                title: '起草对华贸易条款',
                description: '为帝国东印度公司起草新的广州港口贸易条款。',
                riskLevel: 'low',
                factionTendency: 'empire'
            },
            {
                id: 'legal_2',
                title: '殖民地纠纷调解',
                description: '处理印度殖民地港口的银矿开采权纠纷。',
                riskLevel: 'medium',
                factionTendency: 'neutral'
            },
            {
                id: 'legal_3',
                title: '条约漏洞分析',
                description: '秘密分析帝国条约中的漏洞，为赫耳墨斯社提供情报。',
                riskLevel: 'high',
                factionTendency: 'revolution'
            }
        ]
    },
    {
        id: 'interpretation',
        name: '口译部',
        englishName: 'Interpretation Dept',
        floor: 3,
        icon: <Globe className="w-5 h-5" />,
        coreExperience: '随皇家海军出海，作为文明沟通的桥梁。',
        rewardType: '⚡ 经验与技能',
        rewardDescription: '在生死边缘磨练翻译能力。',
        riskLevel: 'extreme',
        isLocked: true,
        lockReason: '需要达到二年级或以上',
        tasks: [
            {
                id: 'interp_1',
                title: '随舰出航广州',
                description: '作为皇家海军翻译官随舰前往广州。',
                riskLevel: 'extreme',
                factionTendency: 'empire'
            }
        ]
    },
    {
        id: 'literature',
        name: '文学系',
        englishName: 'Literature Dept',
        floor: 4,
        icon: <Feather className="w-5 h-5" />,
        coreExperience: '享乐主义的温床。你的战场是舞厅和沙龙。',
        rewardType: '🕵️ 情报与人脉',
        rewardDescription: '获取八卦和机密情报。',
        riskLevel: 'medium',
        tasks: [
            {
                id: 'lit_1',
                title: '科莱特的私人沙龙',
                description: '参加科莱特教授周五晚的私人沙龙。',
                riskLevel: 'low',
                factionTendency: 'neutral'
            },
            {
                id: 'lit_2',
                title: '诺曼庄园晚宴',
                description: '受邀参加威廉教授的私人晚宴。',
                riskLevel: 'medium',
                factionTendency: 'empire'
            },
            {
                id: 'lit_3',
                title: '秘密情报交接',
                description: '在定制店以试衣为掩护传递加密情报。',
                riskLevel: 'high',
                factionTendency: 'revolution'
            }
        ]
    },
    {
        id: 'silver_working',
        name: '刻银部',
        englishName: 'Silver-Working',
        floor: 8,
        icon: <Hammer className="w-5 h-5" />,
        coreExperience: '游戏的终局——自己制作银条。',
        rewardType: '🔮 银条制作',
        rewardDescription: '在封闭实验室决定刻什么词。',
        riskLevel: 'high',
        isLocked: true,
        lockReason: '需要达到三年级或以上',
        tasks: [
            {
                id: 'silver_1',
                title: '帝国军工合同',
                description: '为帝国海军制作增强船体的银条。',
                riskLevel: 'medium',
                factionTendency: 'empire'
            }
        ]
    }
];

// 任务卡片
const TaskCard: React.FC<{ task: InternshipTask; onSelect: () => void }> = ({ task, onSelect }) => {
    const risk = RISK_CONFIG[task.riskLevel];
    const tendency = FACTION_TENDENCY[task.factionTendency];
    const TendencyIcon = tendency.icon;

    return (
        <div
            className="p-3 bg-paper border-2 border-ink/20 hover:border-ink transition-all cursor-pointer group"
            onClick={onSelect}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <h4 className="font-headline font-bold text-sm uppercase group-hover:text-crimson transition-colors">
                        {task.title}
                    </h4>
                    <p className="text-xs text-ink/60 font-serif mt-1 line-clamp-2">{task.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink/30 group-hover:text-crimson shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] font-mono uppercase">
                <span className={task.riskLevel === 'high' || task.riskLevel === 'extreme' ? 'text-crimson' : 'text-ink/60'}>
                    {risk.dots} {risk.label}
                </span>
                <span className="flex items-center gap-1 text-ink/60">
                    <TendencyIcon className="w-3 h-3" />
                    {tendency.label}
                </span>
            </div>
        </div>
    );
};

// 部门卡片
const DepartmentCard: React.FC<{
    department: Department;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ department, isSelected, onSelect }) => {
    const risk = RISK_CONFIG[department.riskLevel];

    return (
        <div
            className={`relative p-4 border-2 transition-all cursor-pointer
                ${isSelected ? 'border-ink bg-paper-contrast shadow-newspaper' : 'border-ink/30 bg-paper hover:border-ink'}
                ${department.isLocked ? 'opacity-60' : ''}`}
            onClick={onSelect}
        >
            {/* Lock Badge */}
            {department.isLocked && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono uppercase text-ink/60 bg-ink/10 px-2 py-1">
                    <Lock className="w-3 h-3" /> LOCKED
                </div>
            )}

            <div className="flex items-start gap-3">
                <div className="p-2 bg-ink text-paper">
                    {department.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold uppercase">{department.name}</h3>
                        <span className="text-[10px] font-mono text-ink/50">F{department.floor}</span>
                    </div>
                    <p className="text-xs text-ink/60 font-mono uppercase">{department.englishName}</p>
                </div>
            </div>

            <p className="text-sm text-ink/80 font-serif mt-3">{department.coreExperience}</p>

            <div className="mt-3 pt-3 border-t border-ink/20 flex items-center justify-between text-sm">
                <span className="font-bold">{department.rewardType}</span>
                <span className={`text-[10px] font-mono uppercase ${department.riskLevel === 'extreme' ? 'text-crimson' : 'text-ink/60'}`}>
                    {risk.dots} {risk.label}
                </span>
            </div>

            {department.isLocked && (
                <p className="text-[10px] text-crimson font-mono mt-2 flex items-center gap-1 uppercase">
                    <AlertTriangle className="w-3 h-3" />
                    {department.lockReason}
                </p>
            )}
        </div>
    );
};

// 主组件
interface QuestPanelProps {
    onSelectQuest?: (department: string, task: string) => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ onSelectQuest }) => {
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<InternshipTask | null>(null);

    const currentDept = DEPARTMENTS.find(d => d.id === selectedDept);

    const handleConfirmTask = () => {
        if (selectedDept && selectedTask && onSelectQuest) {
            onSelectQuest(selectedDept, selectedTask.id);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-ink pb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Employment Board</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-ink uppercase tracking-wider">
                    Internship Notices
                </h1>
                <p className="text-sm font-serif italic text-ink/60 mt-2">实习任务委托</p>
            </div>

            {/* Department Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPARTMENTS.map(dept => (
                    <DepartmentCard
                        key={dept.id}
                        department={dept}
                        isSelected={selectedDept === dept.id}
                        onSelect={() => {
                            if (!dept.isLocked) {
                                setSelectedDept(selectedDept === dept.id ? null : dept.id);
                                setSelectedTask(null);
                            }
                        }}
                    />
                ))}
            </div>

            {/* Task List */}
            {currentDept && !currentDept.isLocked && (
                <div className="border-3 border-ink bg-paper-contrast p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/20">
                        <h3 className="font-headline font-bold uppercase">
                            {currentDept.name} — Available Tasks
                        </h3>
                        <span className="text-xs font-serif text-ink/60 italic">{currentDept.rewardDescription}</span>
                    </div>

                    <div className="space-y-2">
                        {currentDept.tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onSelect={() => setSelectedTask(task)}
                            />
                        ))}
                    </div>

                    {/* Confirm Button */}
                    {selectedTask && (
                        <div className="mt-4 pt-4 border-t-2 border-ink flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-headline font-bold uppercase">{selectedTask.title}</p>
                                <p className="text-xs text-ink/60 font-serif">{selectedTask.description}</p>
                            </div>
                            <button
                                onClick={handleConfirmTask}
                                className="flex items-center gap-2 px-6 py-3 bg-ink text-paper font-headline font-bold text-sm uppercase tracking-wider hover:bg-crimson transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Accept
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-ink/30 text-[10px] font-mono uppercase tracking-widest pt-4 border-t border-ink/20">
                ❖ Babel Quest Board ❖
            </div>
        </div>
    );
};
