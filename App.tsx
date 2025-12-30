import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MainPanel } from './components/MainPanel';
import { ActionPanel } from './components/ActionPanel';
import { Modal } from './components/Modal';
import { SilverWorkshop } from './components/SilverWorkshop';
import { TowerMap } from './components/TowerMap';
import { SchedulePanel } from './components/SchedulePanel';
import { CharacterArchive } from './components/CharacterArchive';
import { QuestPanel } from './components/QuestPanel';
import { EventLog } from './components/EventLog';
import { SuspicionWarning } from './components/SuspicionWarning';
import { SettingsPanel } from './components/SettingsPanel';
import { GameState, Message, ModalType } from './types';
import { INITIAL_STATS, INITIAL_PROFILE, INITIAL_INVENTORY } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { parseStatusBlock, formatTimeDisplay } from './utils/statusParser';
import { Crown, Users, Eye } from 'lucide-react';

// Helper component for the Status Modal
const ModalStatusMeter = ({ icon, label, value, color, description }: { icon: React.ReactNode, label: string, value: number, color: string, description: string }) => (
  <div className="flex flex-col p-4 bg-ink/5 border border-ink/10 rounded-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2 text-ink font-display font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono text-lg font-bold">{value}%</span>
    </div>
    <div className="h-3 w-full bg-ink/20 border border-ink/10 relative overflow-hidden rounded-full mb-2">
      <div
        className={`h-full ${color} transition-all duration-1000 ease-out relative`}
        style={{ width: `${value}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
    <p className="text-xs text-ink/60 italic font-serif">{description}</p>
  </div>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    messages: [
      {
        role: 'model',
        content: "晨光透过巨大的哥特式窗户洒入教室，尘埃在光柱中翻滚起舞。你坐在巨大的木质课桌前，桌面上散落着几本厚重的语法词典和一条铅银合金银条。\n\n威廉·诺曼教授正在讲台上讲解刷银术的基本原理——如何在两种语言的语义差异中捕捉魔法的力量。\n\n\"当你用中文写下'安'，再用英文写下'Peace'，这两个词看似对等，但它们承载的文化意象却有微妙差异……\"教授的声音在教室中回荡。\n\n你接下来打算做什么？",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    stats: INITIAL_STATS,
    profile: INITIAL_PROFILE,
    inventory: INITIAL_INVENTORY,
    isLoading: false,
    activeModal: null,
    suggestedActions: ["观察周围的环境", "检查背包里的物品", "询问关于禁书区的传闻"]
  });

  // 怀疑度警告状态
  const [showSuspicionWarning, setShowSuspicionWarning] = useState(false);
  const [lastSuspicionLevel, setLastSuspicionLevel] = useState<'none' | 'caution' | 'warning' | 'wanted'>('none');

  // 监控怀疑度变化，触发警告
  useEffect(() => {
    const suspicion = gameState.stats.suspicion;
    let currentLevel: 'none' | 'caution' | 'warning' | 'wanted' = 'none';
    if (suspicion >= 90) currentLevel = 'wanted';
    else if (suspicion >= 70) currentLevel = 'warning';
    else if (suspicion >= 50) currentLevel = 'caution';

    // 当警告级别提升时触发弹窗
    if (currentLevel !== 'none' && currentLevel !== lastSuspicionLevel) {
      setShowSuspicionWarning(true);
    }
    setLastSuspicionLevel(currentLevel);
  }, [gameState.stats.suspicion, lastSuspicionLevel]);

  const handleSendMessage = async (text: string) => {
    // Optimistic update
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      const responseText = await sendMessageToGemini(
        gameState.messages.concat(userMessage).map(m => ({ role: m.role, content: m.content })),
        text
      );

      // 解析状态数据块
      const { content: cleanContent, status } = parseStatusBlock(responseText);

      const botMessage: Message = {
        role: 'model',
        content: cleanContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGameState(prev => {
        // 如果有状态更新，应用到profile
        const updatedProfile = status ? {
          ...prev.profile,
          ...(status.time && { time: formatTimeDisplay(status.time, status.period) }),
          ...(status.location && { location: status.location }),
          ...(status.weather && { weather: status.weather }),
          ...(status.clothing && { clothing: status.clothing }),
          ...(status.coins !== undefined && { coins: status.coins }),
        } : prev.profile;

        // 如果有属性更新，应用到stats
        const updatedStats = status ? {
          ...prev.stats,
          ...(status.empireContribution !== undefined && { empireContribution: status.empireContribution }),
          ...(status.clubContribution !== undefined && { clubContribution: status.clubContribution }),
          ...(status.suspicion !== undefined && { suspicion: status.suspicion }),
        } : prev.stats;

        // 如果有行动建议更新
        const updatedActions = status?.actions?.length === 3
          ? status.actions
          : prev.suggestedActions;

        return {
          ...prev,
          messages: [...prev.messages, botMessage],
          profile: updatedProfile,
          stats: updatedStats,
          suggestedActions: updatedActions,
          isLoading: false
        };
      });

    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, {
          role: 'system',
          content: "系统错误：以太连接中断。",
          timestamp: new Date().toLocaleTimeString()
        }]
      }));
    }
  };

  const handleNavClick = (modalType: ModalType) => {
    setGameState(prev => ({ ...prev, activeModal: modalType }));
  };

  const closeModal = () => {
    setGameState(prev => ({ ...prev, activeModal: null }));
  };

  const getModalTitle = (type: ModalType) => {
    switch (type) {
      case 'status': return '当前状态与行囊';
      case 'map': return '巴别塔地图';
      case 'schedule': return '日程规划';
      case 'magic': return '刻银术工坊';
      case 'social': return '人物档案';
      case 'quests': return '任务委托';
      case 'logs': return '事件日志';
      case 'settings': return '系统设置';
      default: return '未知模块';
    }
  };

  // 存档功能：导出游戏状态为JSON文件
  const handleSaveGame = async () => {
    const saveData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      gameState: {
        messages: gameState.messages,
        stats: gameState.stats,
        profile: gameState.profile,
        inventory: gameState.inventory,
        suggestedActions: gameState.suggestedActions
      }
    };

    const jsonString = JSON.stringify(saveData, null, 2);

    // 生成文件名
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `BabelAcademy_Save_${dateStr}_${timeStr}.json`;

    // 尝试使用 File System Access API（会弹出系统保存对话框）
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        return;
      } catch (err: any) {
        // 用户取消或其他错误，继续使用备用方法
        if (err.name === 'AbortError') return;
      }
    }

    // 备用方法：使用 Blob 下载
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 读档功能：从 JSON 文件加载游戏状态
  const handleLoadGame = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saveData = JSON.parse(content);

        if (saveData.gameState) {
          setGameState(prev => ({
            ...prev,
            messages: saveData.gameState.messages || prev.messages,
            stats: saveData.gameState.stats || prev.stats,
            profile: saveData.gameState.profile || prev.profile,
            inventory: saveData.gameState.inventory || prev.inventory,
            suggestedActions: saveData.gameState.suggestedActions || prev.suggestedActions
          }));
          alert('存档加载成功！');
        } else {
          alert('无效的存档文件格式');
        }
      } catch (error) {
        alert('存档文件解析失败');
        console.error('Load save error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen w-screen flex flex-row bg-ink overflow-hidden font-sans">

      {/* 1. Sidebar - Left Column (Full Height) */}
      <div className="hidden lg:block h-full z-30 shrink-0">
        <Sidebar profile={gameState.profile} />
      </div>

      {/* 2. Main Area - Right Column */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">

        {/* Top Navigation */}
        <TopBar onNavClick={handleNavClick} onSave={handleSaveGame} onLoad={handleLoadGame} />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <MainPanel messages={gameState.messages} isLoading={gameState.isLoading} />

          {/* Action Panel at bottom of right column */}
          <ActionPanel
            onSendMessage={handleSendMessage}
            isLoading={gameState.isLoading}
            suggestedActions={gameState.suggestedActions}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={!!gameState.activeModal}
        onClose={closeModal}
        title={getModalTitle(gameState.activeModal)}
      >
        {gameState.activeModal === 'status' && (
          <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* 移动端档案显示 (仅在移动端显示) */}
            <div className="lg:hidden w-full h-[600px] border-b-4 border-double border-ink pb-6 mb-6">
              <Sidebar profile={gameState.profile} />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModalStatusMeter
                icon={<Crown className="w-5 h-5 text-gold" />}
                label="帝国贡献度"
                value={gameState.stats.empireContribution}
                color="bg-gold"
                description="你对维多利亚帝国的忠诚与贡献，决定了官方资源的获取权限。"
              />
              <ModalStatusMeter
                icon={<Users className="w-5 h-5 text-blue-600" />}
                label="社团声望"
                value={gameState.stats.clubContribution}
                color="bg-blue-600"
                description="你在秘密结社中的地位。过低可能导致被除名，过高可能引来注视。"
              />
              <ModalStatusMeter
                icon={<Eye className="w-5 h-5 text-crimson" />}
                label="受关注/怀疑度"
                value={gameState.stats.suspicion}
                color="bg-crimson"
                description="审判庭对你的关注程度。达到100%将触发‘清洗’事件。"
              />
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-parchment px-4 text-sm text-ink/50 font-display tracking-widest uppercase">Inventory</span>
              </div>
            </div>

            {/* Inventory Section */}
            <div>
              <h3 className="font-display text-xl text-center mb-6 text-ink font-bold">随身行囊</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {gameState.inventory.map(item => (
                  <div key={item.id} className="group p-4 border border-ink/20 bg-white/50 flex flex-col items-center text-center hover:border-gold hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative z-10 w-12 h-12 bg-ink text-gold rounded-full flex items-center justify-center mb-3 font-serif text-2xl shadow-md group-hover:scale-110 transition-transform">
                      {item.icon === 'clock' ? '⌚' : '⚗️'}
                    </div>
                    <h4 className="relative z-10 font-display font-bold text-ink">{item.name}</h4>
                    <p className="relative z-10 text-xs text-ink/70 font-mono mt-1">{item.description}</p>
                  </div>
                ))}
                {/* Empty slots for aesthetic */}
                {[...Array(2)].map((_, i) => (
                  <div key={`empty-${i}`} className="p-4 border border-dashed border-ink/10 flex flex-col items-center justify-center text-ink/20 min-h-[140px]">
                    <span className="text-2xl opacity-20">＋</span>
                    <span className="text-xs mt-2 font-mono uppercase">Empty Slot</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState.activeModal === 'map' && (
          <TowerMap
            currentGrade={1}
            currentLocation={gameState.profile.location}
          />
        )}

        {gameState.activeModal === 'magic' && (
          <SilverWorkshop />
        )}

        {gameState.activeModal === 'schedule' && (
          <SchedulePanel
            currentTime={gameState.profile.time}
            onScheduleAction={(timeSlot, action, subAction) => {
              const actionText = `【日程安排】${timeSlot}：${action}${subAction ? ` - ${subAction}` : ''}`;
              handleSendMessage(actionText);
              closeModal();
            }}
          />
        )}

        {gameState.activeModal === 'social' && (
          <CharacterArchive />
        )}

        {gameState.activeModal === 'quests' && (
          <QuestPanel
            onSelectQuest={(department, taskId) => {
              const actionText = `【接受任务】部门：${department}，任务ID：${taskId}`;
              handleSendMessage(actionText);
              closeModal();
            }}
          />
        )}

        {gameState.activeModal === 'logs' && (
          <EventLog />
        )}

        {gameState.activeModal === 'settings' && (
          <SettingsPanel />
        )}
      </Modal>

      {/* 怀疑度警告弹窗 */}
      {showSuspicionWarning && (
        <SuspicionWarning
          suspicion={gameState.stats.suspicion}
          onClose={() => setShowSuspicionWarning(false)}
          onDismiss={() => setShowSuspicionWarning(false)}
        />
      )}

    </div>
  );
};

export default App;
