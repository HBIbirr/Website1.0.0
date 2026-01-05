
import React, { useState } from 'react';
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

  // 判定用户是否在线（最后活动时间在 30 秒内）
  const isOnline = (lastSeen?: number) => {
    if (!lastSeen) return false;
    return Date.now() - lastSeen < 30000;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-12">
      {/* 顶部标题与快速生成 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">系统仪表盘</h2>
          <p className="text-sm text-gray-400 mt-1">管理访客权限与实时用户洞察</p>
        </div>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="自定义邀请码 (可选)..."
            className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm min-w-[200px]"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <ICONS.Plus /> {customCode.trim() ? '创建' : '随机'}邀请码
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 用户状态列表 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            社区成员活跃度 ({users.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-300 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 font-bold">用户名</th>
                  <th className="pb-4 font-bold">状态</th>
                  <th className="pb-4 font-bold">最后在线时间 (精确到秒)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100 uppercase">
                          {user.username[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{user.username}</span>
                        {user.role === 'admin' && <span className="text-[8px] bg-amber-50 text-amber-500 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">Root</span>}
                      </div>
                    </td>
                    <td className="py-4">
                      {isOnline(user.lastSeen) ? (
                        <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 在线
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span> 离线
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className="text-xs text-gray-400 font-mono">
                        {user.lastSeen ? formatFullDateTime(user.lastSeen) : '从未加入'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 邀请码管理 */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">待分发邀请码</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
              {codes.filter(c => !c.isUsed).map(c => (
                <div key={c.code} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl group border border-transparent hover:border-indigo-100 transition-all">
                  <span className="font-mono font-bold text-indigo-600 tracking-wider">{c.code}</span>
                </div>
              ))}
              {codes.filter(c => !c.isUsed).length === 0 && <p className="text-center py-6 text-[10px] text-gray-300 italic uppercase">暂无邀请码</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">最近入会</h3>
            <div className="space-y-3">
              {codes.filter(c => c.isUsed).slice(0, 5).map(c => (
                <div key={c.code} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 line-through font-mono">{c.code}</span>
                  <span className="font-bold text-indigo-500">{c.usedBy} 加入了社区</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
