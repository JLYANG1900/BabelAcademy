import React, { useState } from 'react';
import { Send, Feather } from 'lucide-react';

interface ActionPanelProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  suggestedActions?: string[];
}

const DEFAULT_ACTIONS = [
  "观察周围的环境",
  "检查背包里的物品",
  "询问关于禁书区的传闻"
];

export const ActionPanel: React.FC<ActionPanelProps> = ({ onSendMessage, isLoading, suggestedActions }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  // 使用传入的建议或默认值
  const actions = suggestedActions?.length === 3 ? suggestedActions : DEFAULT_ACTIONS;

  return (
    <footer className="bg-parchment border-t-4 border-double border-ink p-6 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-paper-texture opacity-50 pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-6xl mx-auto flex flex-col gap-4 relative z-10">

        {/* Preset Choices */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => !isLoading && onSendMessage(action)}
              disabled={isLoading}
              className="px-4 py-2 bg-transparent border border-ink/40 text-ink/80 font-display text-sm tracking-wider hover:bg-ink hover:text-parchment hover:border-ink transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10">{action}</span>
              <div className="absolute inset-0 bg-ink transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gold via-crimson to-gold opacity-30 blur group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-stretch shadow-md">
            <div className="bg-white flex items-center px-4 border-y border-l border-ink text-ink">
              <Feather className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="书写你的命运..."
              disabled={isLoading}
              className="flex-1 bg-white text-ink font-serif text-lg p-4 border-y border-ink focus:outline-none placeholder:text-ink/40 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-ink text-parchment px-8 font-display font-bold tracking-widest hover:bg-crimson hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-y border-r border-ink"
            >
              <span>铭刻</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </footer>
  );
};