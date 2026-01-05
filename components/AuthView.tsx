
import React, { useState } from 'react';
import { User, InvitationCode } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (user: User, code: string) => boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, users, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: 'user'
    };
    
    const success = onRegister(newUser, inviteCode);
    if (!success) {
      setError('邀请码无效或已被使用');
    } else {
      setIsLogin(true);
      setError('注册成功，请登录');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fdf2f8]">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300 rounded-full blur-[120px]"></div>
      </div>

      <div className="glass p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-500 border border-white/40">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? '欢迎回来' : '加入艺术社区'}
          </h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">HBIbirr's Creative Hub</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner" 
              placeholder="Your username" 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner" 
              placeholder="••••••••" 
              required 
            />
          </div>

          {!isLogin && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-1">邀请码 (REQUIRED)</label>
              <input 
                type="text" 
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-mono" 
                placeholder="XXXXXX" 
                required={!isLogin} 
              />
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all transform active:scale-95 shadow-xl shadow-indigo-100 mt-4">
            {isLogin ? '登录' : '立即注册'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest"
          >
            {isLogin ? '还没有账号？使用邀请码注册' : '已有账号？返回登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
