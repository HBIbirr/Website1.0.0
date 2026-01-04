
import React from 'react';
import { ICONS } from '../constants';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'feed', name: '动态', icon: ICONS.Home },
    { id: 'resources', name: '资源库', icon: ICONS.Music },
    { id: 'wishes', name: '许愿池', icon: ICONS.Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto glass z-50 px-4 py-2 border-t md:border-t-0 md:border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-12">
        <div className="hidden md:block font-serif text-xl font-bold text-indigo-900 mr-auto">
          HBIbirr 空间
        </div>
        <div className="flex space-x-8">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
