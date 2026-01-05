
import React from 'react';
import { ICONS } from '../constants';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isAdmin, onLogout }) => {
  const tabs = [
    { id: 'feed', name: '动态', icon: ICONS.Home },
    { id: 'resources', name: '资源库', icon: ICONS.Music },
    { id: 'wishes', name: '许愿池', icon: ICONS.Sparkles },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', name: '管理', icon: ICONS.More });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto glass z-50 px-4 py-2 border-t md:border-t-0 md:border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-around items-center h-12">
        <div className="hidden md:block font-serif text-xl font-bold text-indigo-900 mr-auto">
          HBIbirr 空间
        </div>
        <div className="flex space-x-4 md:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-colors ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'
              }`}
            >
              <tab.icon />
              <span className="text-[10px] md:text-sm font-medium uppercase tracking-wider">{tab.name}</span>
            </button>
          ))}
          <button
            onClick={onLogout}
            className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-red-400 hover:text-red-600 transition-colors ml-4 md:border-l md:pl-8 md:border-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="text-[10px] md:text-sm font-medium uppercase tracking-wider">退出</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
