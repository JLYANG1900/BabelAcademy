export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
}

export interface PlayerStats {
  empireContribution: number;
  clubContribution: number;
  suspicion: number;
}

export interface PlayerProfile {
  name: string;
  grade: string;
  coins: number;
  clothing: string;
  location: string;
  time: string;
  weather: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type ModalType = 'status' | 'map' | 'schedule' | 'magic' | 'social' | 'quests' | 'logs' | 'settings' | 'inventory' | null;

/**
 * 角色动态数据接口 - 由LLM每回合动态更新
 * Character Dynamic Data Interface - Updated by LLM each turn
 */
export interface CharacterDynamicData {
  location: string;      // 当前位置 / Current location
  clothing: string;      // 当前穿着 / Current clothing
  activity: string;      // 当前行动 / Current activity
  thought: string;       // 当前想法 / Current thought
  affection: number;     // 好感度 0-100 / Affection 0-100
}

/**
 * 角色基本信息接口 - 用于CharacterArchive显示
 * Character Base Info Interface - For CharacterArchive display
 */
export interface CharacterBaseInfo {
  id: string;
  name: string;
  englishName: string;
  identity: string;
  portrait: string;      // 头像URL / Avatar URL
  faction: 'empire' | 'revolution' | 'neutral';
}

/**
 * 牛津地图位置坐标接口
 * Oxford Map Location Coordinate Interface
 */
export interface MapLocation {
  key: string;           // 位置名称 / Location name
  aliases: string[];     // 别名数组 / Aliases array
  x: number;             // 横坐标百分比 / X coordinate percentage
  y: number;             // 纵坐标百分比 / Y coordinate percentage
}

export interface GameState {
  messages: Message[];
  stats: PlayerStats;
  profile: PlayerProfile;
  inventory: InventoryItem[];
  isLoading: boolean;
  activeModal: ModalType;
  suggestedActions: string[];

  /**
   * 8位主角的动态数据 - key为角色ID，由LLM每回合更新
   * Dynamic data for 8 main characters - keyed by character ID, updated by LLM each turn
   */
  characterDynamics: Record<string, CharacterDynamicData>;
}