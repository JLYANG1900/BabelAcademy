import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MainPanelProps {
  messages: Message[];
  isLoading: boolean;
}

export const MainPanel: React.FC<MainPanelProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="flex-1 bg-parchment relative overflow-hidden flex flex-col">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-paper-texture opacity-50 pointer-events-none mix-blend-multiply z-0"></div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none z-10"></div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 z-20 relative space-y-8 scroll-smooth">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-500 fade-in`}
          >
            <div
              className={`
                max-w-3xl p-6 relative shadow-sm
                ${msg.role === 'user'
                  ? 'bg-white/60 border border-ink/20 text-ink/80 font-serif italic text-lg rounded-tl-xl rounded-bl-xl rounded-br-xl ml-12'
                  : 'bg-transparent text-ink font-body text-xl md:text-2xl leading-loose tracking-wide border-l-4 border-crimson pl-6'}
              `}
            >
              {msg.role === 'model' && (
                <span className="absolute -left-[30px] top-0 text-3xl text-crimson font-display">
                  Let
                </span>
              )}
              {/* Render formatting carefully */}
              <div className="whitespace-pre-wrap">
                {msg.content}
              </div>

              {msg.role === 'model' && (
                <div className="mt-4 flex items-center space-x-2 opacity-40">
                  <div className="h-[1px] bg-ink flex-1"></div>
                  <div className="text-[10px] font-mono uppercase">Babel Archive</div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-ink/40 mt-2 px-2">
              {msg.timestamp}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start pl-6 border-l-4 border-gold/50 animate-pulse">
            <div className="font-body text-xl text-ink/60 italic">
              羽毛笔正在纸上沙沙作响...
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4"></div>
      </div>
    </main>
  );
};