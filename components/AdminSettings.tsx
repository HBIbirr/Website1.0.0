import React, { useState } from 'react';
// 确保你的 types.ts 里定义了 InvitationCode 和 User
import { InvitationCode, User } from '../types'; 
import { ICONS } from '../constants';
import { formatFullDateTime } from '../App';

interface AdminSettingsProps {
  codes: InvitationCode[];
  users: User[];
  onGenerateCode: (customCode?: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ codes, users, onGenerateCode }) => {
  const [customCode, setCustomCode] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateCode(customCode.trim() || undefined);
    setCustomCode('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-12">
      {/* 顶部标题与快速生成 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">系统仪表盘</h2>
          <p className="text-sm text-gray-400 mt-1">生成用于新用户注册的专属通行证 (云端同步)</p>
        </div>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
            placeholder="自定义邀请码 (可选)..."
            className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm min-w-[200px] uppercase font-bold text-indigo-900 placeholder:font-normal"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            {/* 如果 ICONS 里没有 Plus，可以用文字 + 代替 */}
            <ICONS.Sparkles /> {customCode.trim() ? '创建专属码' : '随机生成'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧：用户状态 (替换为 Supabase 提示，因为 users 现在为空) */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center opacity-80">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
             {/* 使用一个图标，如果没有 User 图标就用其他的 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">用户管理已移交云端</h3>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            由于启用了 Supabase 身份验证系统，用户列表、在线状态及登录日志现在由 Supabase Authentication 面板统一管理。
          </p>
          <a 
            href="https://supabase.com/dashboard/project/_/auth/users" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest"
          >
            前往 Supabase 查看用户数据 &rarr;
          </a>
        </div>

        {/* 右侧：邀请码管理 */}
        <div className="space-y-8">
           
           {/* 待分发列表 */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 opacity-10 blur-2xl rounded-full translate-x-10 -translate-y-10"></div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex justify-between items-center">
              <span>待分发邀请码</span>
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{codes.filter(c => !c.isUsed).length}</span>
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-2">
              {codes.filter(c => !c.isUsed).map(c => (
                <div key={c.code} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all cursor-default">
                  <span className="font-mono font-bold text-indigo-600 tracking-wider text-lg">{c.code}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(c.code)}
                    className="text-[10px] font-bold text-gray-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    复制
                  </button>
                </div>
              ))}
              {codes.filter(c => !c.isUsed).length === 0 && (
                <div className="py-8 text-center">
                   <p className="text-[10px] text-gray-300 italic uppercase">暂无可用邀请码</p>
                   <p className="text-[9px] text-gray-300 mt-1">请点击上方按钮生成</p>
                </div>
              )}
            </div>
          </div>

          {/* 最近使用记录 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">最近入会记录</h3>
            <div className="space-y-4">
              {codes.filter(c => c.isUsed).slice(0, 5).map(c => (
                <div key={c.code} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 line-through font-mono">{c.code}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600">{c.usedBy || '未知用户'}</span>
                    <span className="text-gray-300 text-[10px]">已使用</span>
                  </div>
                </div>
              ))}
              {codes.filter(c => c.isUsed).length === 0 && <p className="text-[10px] text-gray-300 italic text-center py-2">暂无入会记录</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;