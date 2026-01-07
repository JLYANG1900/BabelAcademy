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
      <div className="relative w-full max-w-4xl max-h-[80vh] bg-parchment border-4 border-double border-gold shadow-gothic overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gold bg-parchment-dark">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rotate-45 bg-crimson"></div>
            <h2 className="font-display text-2xl font-bold text-ink tracking-widest uppercase">{title}</h2>
            <div className="w-2 h-2 rotate-45 bg-crimson"></div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-crimson hover:text-parchment transition-colors duration-200 border border-transparent hover:border-ink rounded-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-paper-texture relative">
          {/* Ornamental Corners */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-ink opacity-20"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-ink opacity-20"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-ink opacity-20"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-ink opacity-20"></div>

          {children}
        </div>
      </div>
    </div>
  );
};