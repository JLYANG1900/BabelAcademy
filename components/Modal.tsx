import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-paper border-3 border-ink shadow-newspaper overflow-hidden flex flex-col vintage-noise">
        {/* Newspaper Masthead Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-ink bg-paper-contrast">
          <div className="flex-1">
            {/* Decorative top rule */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-px bg-ink"></div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Est. 1842</span>
              <div className="flex-1 h-px bg-ink"></div>
            </div>
            {/* Title */}
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink tracking-wide uppercase text-center">
              {title}
            </h2>
            {/* Decorative bottom rule */}
            <div className="h-px bg-ink mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-ink hover:text-paper transition-colors duration-200 border border-ink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-paper relative">
          {/* Corner decorations - newspaper style */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-ink/30"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-ink/30"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-ink/30"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-ink/30"></div>

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};