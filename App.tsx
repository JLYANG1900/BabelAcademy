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
import { SplashScreen } from './components/SplashScreen';
import { GameState, Message, ModalType, CharacterDynamicData } from './types';
import { INITIAL_STATS, INITIAL_PROFILE, INITIAL_INVENTORY, INITIAL_EVENTS } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { parseStatusBlock, formatTimeDisplay, getDefaultCharacterDynamics } from './utils/statusParser';
import { WorldInfoManager } from './utils/WorldInfoManager';
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
    suggestedActions: ["观察周围的环境", "检查背包里的物品", "询问关于禁书区的传闻"],
    characterDynamics: getDefaultCharacterDynamics(),
    events: INITIAL_EVENTS
  });

  // 开场页面状态
  const [showSplash, setShowSplash] = useState(() => {
    // 检查localStorage是否已访问过
    const hasVisited = localStorage.getItem('babelAcademy_hasVisited');
    return !hasVisited;
  });

  // 小红点提醒状态 - 初始化时显示红点
  const [hasUpdates, setHasUpdates] = useState({ map: true, logs: true, social: true });

  // 处理开始游戏
  const handleStartGame = (profileData?: { name: string; age: string; gender: 'female' | 'male' | 'other'; personality: string; appearance: string }) => {
    localStorage.setItem('babelAcademy_hasVisited', 'true');

    // Update profile with form data if provided
    if (profileData) {
      setGameState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: profileData.name || prev.profile.name,
          age: profileData.age || prev.profile.age,
          gender: profileData.gender || prev.profile.gender,
          personality: profileData.personality || prev.profile.personality,
          appearance: profileData.appearance || prev.profile.appearance,
        }
      }));
    }

    setShowSplash(false);
  };

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
      // Get dynamic context based on user input
      const worldInfoContext = WorldInfoManager.getCombinedContext(text);

      // 序列化当前游戏状态，让LLM知道当前的好感度等数值
      const currentStateContext = `
=== 当前游戏状态 / CURRENT GAME STATE ===
时间: ${gameState.profile.date} ${gameState.profile.time}
地点: ${gameState.profile.location}
天气: ${gameState.profile.weather}
玩家银币: ${gameState.profile.coins}
帝国贡献: ${gameState.stats.empireContribution}
社团声望: ${gameState.stats.clubContribution}
怀疑度: ${gameState.stats.suspicion}

主要角色当前状态:
${Object.entries(gameState.characterDynamics).map(([name, data]: [string, CharacterDynamicData]) =>
        `- ${name}: 好感度=${data.affection}, 位置=${data.location}, 行动=${data.activity}`
      ).join('\n')}

【重要】LLM必须在上述数值基础上进行增减，好感度单次变化限制为±1！
`;

      const dynamicContext = worldInfoContext + '\n\n' + currentStateContext;
      console.log('Dynamic Context Length:', dynamicContext.length);

      const responseText = await sendMessageToGemini(
        gameState.messages.concat(userMessage).map(m => ({ role: m.role, content: m.content })),
        text,
        dynamicContext
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

        // 如果有角色动态更新
        const updatedCharacterDynamics = status?.characterDynamics
          ? { ...prev.characterDynamics, ...status.characterDynamics }
          : prev.characterDynamics;

        // 如果有事件更新 - 追加到现有事件列表并将旧事件标记为已读
        const updatedEvents = status?.eventUpdates && status.eventUpdates.length > 0
          ? [
            ...status.eventUpdates, // 新事件在前面
            ...prev.events.map(e => ({ ...e, isNew: false })) // 旧事件标记为已读
          ]
          : prev.events;

        return {
          ...prev,
          messages: [...prev.messages, botMessage],
          profile: updatedProfile,
          stats: updatedStats,
          suggestedActions: updatedActions,
          characterDynamics: updatedCharacterDynamics,
          events: updatedEvents,
          isLoading: false
        };
      });

      // 每次LLM回复后，设置红点提醒（角色动态/事件/地图都会刷新）
      setHasUpdates({ map: true, logs: true, social: true });

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
    // 清除对应按钮的小红点
    if (modalType === 'map' || modalType === 'logs' || modalType === 'social') {
      setHasUpdates(prev => ({ ...prev, [modalType]: false }));
    }
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

  // Handle avatar change
  const handleAvatarChange = (newAvatar: string) => {
    setGameState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: newAvatar
      }
    }));
    // Persist to local storage is handled by Sidebar for now, but good to have in state
  };

  // 如果显示开场页面，渲染SplashScreen
  if (showSplash) {
    return <SplashScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="fixed inset-0 flex flex-row bg-ink overflow-hidden font-sans">

      {/* 1. Sidebar - Left Column (Full Height) */}
      <div className="hidden lg:block h-full z-30 shrink-0">
        <Sidebar profile={gameState.profile} onAvatarChange={handleAvatarChange} />
      </div>

      {/* 2. Main Area - Right Column */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">

        {/* Top Navigation */}
        <TopBar onNavClick={handleNavClick} onSave={handleSaveGame} onLoad={handleLoadGame} onReturnToSplash={() => setShowSplash(true)} hasUpdates={hasUpdates} />

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
            <div className="lg:hidden w-full border-b-4 border-double border-ink pb-6 mb-6">
              <Sidebar profile={gameState.profile} isMobileEmbedded={true} onAvatarChange={handleAvatarChange} />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModalStatusMeter
                icon={<Crown className="w-5 h-5 text-gold" />}
                label="帝国贡献度"
                value={gameState.stats.empireContribution}
                color="bg-gold"
                description="你对帝国的忠诚度。越高越能获得官方授权的任务和稀有奖励。"
              />
              <ModalStatusMeter
                icon={<Users className="w-5 h-5 text-blue-600" />}
                label="社团声望"
                value={gameState.stats.clubContribution}
                color="bg-blue-600"
                description="你在赫耳墨斯社的声望。越高越能接触激进的任务和反抗工具。"
              />
              <ModalStatusMeter
                icon={<Eye className="w-5 h-5 text-crimson" />}
                label="怀疑度"
                value={gameState.stats.suspicion}
                color="bg-crimson"
                description="帝国审判庭对你的怀疑。超过90%将被通缉。"
              />
            </div>

            {/* Inventory Section */}
            <div>
              <h3 className="font-display font-bold text-lg mb-3 border-b border-ink/20 pb-2">
                银条背包 ({gameState.inventory.length} 件)
              </h3>
              {gameState.inventory.length === 0 ? (
                <p className="text-ink/50 italic text-sm">你的背包空空如也...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gameState.inventory.map(item => (
                    <div key={item.id} className="p-3 border border-ink/10 bg-paper-contrast rounded-sm">
                      <div className="font-bold text-sm mb-1">{item.name}</div>
                      <p className="text-xs text-ink/60 italic">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {gameState.activeModal === 'map' && (
          <TowerMap
            currentLocation={gameState.profile.location}
            characterDynamics={gameState.characterDynamics}
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
          <CharacterArchive characterDynamics={gameState.characterDynamics} />
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
          <EventLog events={gameState.events} />
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
