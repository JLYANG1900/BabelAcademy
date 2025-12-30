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

export interface GameState {
  messages: Message[];
  stats: PlayerStats;
  profile: PlayerProfile;
  inventory: InventoryItem[];
  isLoading: boolean;
  activeModal: ModalType;
  suggestedActions: string[];
}