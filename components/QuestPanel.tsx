import React, { useState } from 'react';
import {
    Scale, Globe, Feather, Hammer,
    AlertTriangle, Coins, Zap, Users, Lock,
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
    color: string;
    bgColor: string;
    borderColor: string;
    tasks: InternshipTask[];
    isLocked?: boolean;
    lockReason?: string;
}

// 风险等级配置
const RISK_CONFIG = {
    low: { label: '低风险', color: 'text-green-600', icon: '●' },
    medium: { label: '中风险', color: 'text-yellow-600', icon: '●●' },
    high: { label: '高风险', color: 'text-orange-500', icon: '●●●' },
    extreme: { label: '极高风险', color: 'text-crimson', icon: '●●●●' }
};

// 阵营倾向配置
const FACTION_TENDENCY = {
    empire: { label: '帝国导向', icon: Crown, color: 'text-gold' },
    revolution: { label: '革命导向', icon: Flame, color: 'text-crimson' },
    neutral: { label: '中立', icon: Scale, color: 'text-academy' }
};

// 基于校园生活.xyaml的部门数据
const DEPARTMENTS: Department[] = [
    {
        id: 'legal',
        name: '法务部',
        englishName: 'Legal Department',
        floor: 2,
        icon: <Scale className="w-6 h-6" />,
        coreExperience: '起草贸易条约，解决跨国纠纷。这里是帝国商业运作的核心枢纽。',
        rewardType: '💰 金钱与佣金',
        rewardDescription: '学生在学院获得额外资金的主要来源。资金可用于购买奢侈品……或资助革命。',
        riskLevel: 'low',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        tasks: [
            {
                id: 'legal_1',
                title: '起草对华贸易条款',
                description: '为帝国东印度公司起草新的广州港口贸易条款，确保帝国利益最大化。',
                riskLevel: 'low',
                factionTendency: 'empire'
            },
            {
                id: 'legal_2',
                title: '殖民地纠纷调解',
                description: '处理印度殖民地港口的银矿开采权纠纷，双方都在暗中行贿。',
                riskLevel: 'medium',
                factionTendency: 'neutral'
            },
            {
                id: 'legal_3',
                title: '条约漏洞分析',
                description: '秘密分析帝国与清朝签订条约中的漏洞，为赫耳墨斯社提供情报。',
                riskLevel: 'high',
                factionTendency: 'revolution'
            }
        ]
    },
    {
        id: 'interpretation',
        name: '口译部',
        englishName: 'Interpretation Department',
        floor: 3,
        icon: <Globe className="w-6 h-6" />,
        coreExperience: '随皇家海军和商船出海，作为不同文明沟通的桥梁。你需要面对风暴、海盗、瘟疫以及当地人的敌意。',
        rewardType: '⚡ 经验与技能',
        rewardDescription: '在生死边缘磨练你的翻译能力和应变能力。每一次任务都是一次成长。',
        riskLevel: 'extreme',
        color: 'text-teal-700',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-300',
        isLocked: true,
        lockReason: '需要达到二年级或以上',
        tasks: [
            {
                id: 'interp_1',
                title: '随舰出航广州',
                description: '作为皇家海军翻译官随舰前往广州，在双方持枪对峙的谈判桌上进行同声传译。',
                riskLevel: 'extreme',
                factionTendency: 'empire'
            },
            {
                id: 'interp_2',
                title: '海盗船谈判',
                description: '被派往被海盗劫持的商船进行赎金谈判。你是唯一能与加勒比海盗沟通的人。',
                riskLevel: 'extreme',
                factionTendency: 'neutral'
            },
            {
                id: 'interp_3',
                title: '秘密接触殖民地起义军',
                description: '以官方翻译身份掩护，与南美殖民地的独立运动领袖秘密会面。',
                riskLevel: 'extreme',
                factionTendency: 'revolution'
            }
        ]
    },
    {
        id: 'literature',
        name: '文学系',
        englishName: 'Literature Department',
        floor: 4,
        icon: <Feather className="w-6 h-6" />,
        coreExperience: '这里是享乐主义的温床。你的战场是舞厅和沙龙，武器是魅力、诗歌和八卦。',
        rewardType: '🕵️ 情报与人脉',
        rewardDescription: '你知道谁和谁在偷情，谁面临破产，谁手里有黑市的银条。这些信息价值连城。',
        riskLevel: 'medium',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300',
        tasks: [
            {
                id: 'lit_1',
                title: '科莱特的私人沙龙',
                description: '参加科莱特教授周五晚的私人沙龙，从红酒与致幻烟雾中套取外国贵族的机密。',
                riskLevel: 'low',
                factionTendency: 'neutral'
            },
            {
                id: 'lit_2',
                title: '诺曼庄园晚宴',
                description: '受邀参加威廉教授的私人晚宴，在觥筹交错中探听政治内幕和家族丑闻。',
                riskLevel: 'medium',
                factionTendency: 'empire'
            },
            {
                id: 'lit_3',
                title: '秘密情报交接',
                description: '在德罗切尔夫人的高级定制店，以试衣为掩护将加密情报缝进衣物裙摆。',
                riskLevel: 'high',
                factionTendency: 'revolution'
            }
        ]
    },
    {
        id: 'silver_working',
        name: '刻银部',
        englishName: 'Silver-working Department',
        floor: 8,
        icon: <Hammer className="w-6 h-6" />,
        coreExperience: '这是游戏的终局。你终于获得了接触最高机密的资格——"自己制作银条"。',
        rewardType: '🔮 银条制作',
        rewardDescription: '在封闭的实验室里，你需要决定：将什么词刻上去？以及——为了谁而刻？',
        riskLevel: 'high',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-400',
        isLocked: true,
        lockReason: '需要达到三年级或以上',
        tasks: [
            {
                id: 'silver_1',
                title: '帝国军工合同',
                description: '为帝国海军制作增强船体结构的银条。你的作品将被用于征服更多殖民地。',
                riskLevel: 'medium',
                factionTendency: 'empire'
            },
            {
                id: 'silver_2',
                title: '秘密武器研发',
                description: '在无人监管的深夜，为赫耳墨斯社制作禁忌的战斗类银条。',
                riskLevel: 'extreme',
                factionTendency: 'revolution'
            }
        ]
    }
];

// 任务卡片组件
const TaskCard: React.FC<{
    task: InternshipTask;
    onSelect: () => void;
}> = ({ task, onSelect }) => {
    const risk = RISK_CONFIG[task.riskLevel];
    const tendency = FACTION_TENDENCY[task.factionTendency];
    const TendencyIcon = tendency.icon;

    return (
        <div
            className="p-3 bg-white/50 border border-ink/10 hover:border-ink/30 transition-all cursor-pointer group"
            onClick={onSelect}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <h4 className="font-display font-bold text-sm text-ink group-hover:text-crimson transition-colors">
                        {task.title}
                    </h4>
                    <p className="text-xs text-ink/60 mt-1 line-clamp-2">{task.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink/30 group-hover:text-crimson shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-3 mt-2">
                <span className={`text-[10px] font-bold ${risk.color}`}>
                    {risk.icon} {risk.label}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${tendency.color}`}>
                    <TendencyIcon className="w-3 h-3" />
                    {tendency.label}
                </span>
            </div>
        </div>
    );
};

// 部门卡片组件
const DepartmentCard: React.FC<{
    department: Department;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ department, isSelected, onSelect }) => {
    const risk = RISK_CONFIG[department.riskLevel];

    return (
        <div
            className={`relative p-4 border-2 transition-all cursor-pointer ${isSelected
                ? `${department.borderColor} ${department.bgColor} shadow-gothic`
                : 'border-ink/20 bg-parchment hover:border-ink/40'
                } ${department.isLocked ? 'opacity-60' : ''}`}
            onClick={onSelect}
        >
            {/* 锁定标识 */}
            {department.isLocked && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-ink/50 bg-ink/10 px-2 py-1 rounded-sm">
                    <Lock className="w-3 h-3" />
                    已锁定
                </div>
            )}

            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-sm ${department.bgColor} ${department.color}`}>
                    {department.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-ink">{department.name}</h3>
                        <span className="text-[10px] font-mono text-ink/50">F{department.floor}</span>
                    </div>
                    <p className="text-xs text-ink/60 font-mono">{department.englishName}</p>
                </div>
            </div>

            <p className="text-sm text-ink/80 mt-3 leading-relaxed">{department.coreExperience}</p>

            <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between">
                <span className="text-sm font-bold">{department.rewardType}</span>
                <span className={`text-[10px] font-bold ${risk.color}`}>
                    {risk.icon} {risk.label}
                </span>
            </div>

            {department.isLocked && (
                <p className="text-[10px] text-crimson mt-2 flex items-center gap-1">
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
        <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* 标题 */}
            <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-ink tracking-wider uppercase">
                    实习任务委托
                </h2>
                <p className="text-sm text-ink/60 font-serif italic mt-1">Internship Quests</p>
            </div>

            {/* 部门选择 */}
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

            {/* 任务列表 */}
            {currentDept && !currentDept.isLocked && (
                <div className="border-2 border-ink/20 bg-white/30 p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-ink">
                            {currentDept.name} - 可选任务
                        </h3>
                        <span className="text-sm text-ink/60">{currentDept.rewardDescription}</span>
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

                    {/* 确认按钮 */}
                    {selectedTask && (
                        <div className="mt-4 pt-4 border-t border-ink/20 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-ink">已选择：{selectedTask.title}</p>
                                <p className="text-xs text-ink/60">{selectedTask.description}</p>
                            </div>
                            <button
                                onClick={handleConfirmTask}
                                className="flex items-center gap-2 px-4 py-2 bg-ink text-parchment font-display font-bold text-sm hover:bg-crimson transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                接受任务
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 底部装饰 */}
            <div className="text-center text-ink/30 text-sm font-mono pt-4 border-t border-ink/10">
                ❖ BABEL QUEST BOARD ❖
            </div>
        </div>
    );
};
