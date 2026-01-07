import React, { useRef } from 'react';
import { Save, FolderOpen } from 'lucide-react';
import { ModalType } from '../types';
import { NAV_ITEMS } from '../constants';

interface TopBarProps {
  onNavClick: (id: ModalType) => void;
  onSave?: () => void;
  onLoad?: (file: File) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavClick, onSave, onLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onLoad) {
      onLoad(file);
      // 重置input以允许重新选择相同文件
      e.target.value = '';
    }
  };

  return (
    <div className="bg-academy text-parchment border-b-4 border-gold shadow-md relative z-20">
      <div className="flex justify-between w-full overflow-x-auto pb-1 px-2 pt-2 scrollbar-hide">
        {/* 导航按钮 */}
        <div className="flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id as ModalType)}
              className="flex flex-col items-center justify-center p-3 min-w-[80px] text-parchment/70 hover:text-gold hover:bg-ink/40 transition-all duration-200 border-b-2 border-transparent hover:border-gold group"
            >
              <div className="mb-1 transform transition-transform group-hover:scale-110 group-active:scale-95">{item.icon}</div>
              <span className="text-[10px] font-display tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 存档/读档按钮 */}
        <div className="flex items-center gap-1 pl-2 border-l border-gold/30">
          <button
            onClick={onSave}
            className="flex flex-col items-center justify-center p-3 min-w-[70px] text-gold/80 hover:text-gold hover:bg-ink/40 transition-all duration-200 group"
            title="导出存档"
          >
            <Save className="w-5 h-5 mb-1 transform transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-display tracking-widest uppercase">存档</span>
          </button>
          <button
            onClick={handleLoadClick}
            className="flex flex-col items-center justify-center p-3 min-w-[70px] text-gold/80 hover:text-gold hover:bg-ink/40 transition-all duration-200 group"
            title="导入存档"
          >
            <FolderOpen className="w-5 h-5 mb-1 transform transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-display tracking-widest uppercase">读档</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};