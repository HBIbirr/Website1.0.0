import React, { useState } from 'react';
// 注意这里用了 .. 返回上一级找到 supabaseClient
import { supabase } from '../supabaseClient';
import { ICONS } from '../constants';

interface AuthViewProps {
  onLogin: (user: any) => void;
  users?: any[];
  onRegister?: any;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      if (isLogin) {
        // --- 真正的登录 ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // 登录成功不需要手动处理，App.tsx 会监听到的
      } else {
        // --- 真正的注册 ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMsg('注册成功！请检查邮箱进行验证，或者直接尝试登录。');
      }
    } catch (error: any) {
      setMsg(error.message || '操作失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4">
            <ICONS.Sparkles />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isLogin ? '欢迎回来' : '创建账号'}</h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">邮箱 Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">密码 Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {msg && <div className="text-xs text-center text-red-500 bg-red-50 p-2 rounded-lg">{msg}</div>}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? '处理中...' : (isLogin ? '提交' : '提交')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMsg(''); }}
            className="text-xs text-gray-400 hover:text-indigo-600 font-bold transition-colors"
          >
            {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;