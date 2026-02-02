
import React from 'react';
import { NAV_ITEMS } from '../../constants';
import { AppTab } from '../../types';

interface MobileNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 pb-safe z-40 md:hidden">
      <div className="flex justify-between items-center h-16">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as AppTab)}
            className={`flex flex-col items-center justify-center space-y-1 w-full ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
