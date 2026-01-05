import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ICONS } from '../constants';

interface AuthViewProps {
  onLogin: (user: any) => void;
  // 保留旧props防止报错，但不再使用
  users?: any[];
  onRegister?: any;
}

const AuthView: React.FC<AuthViewProps> = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // 🪄 核心魔术：自动给用户名加上后缀，伪装成邮箱
  const getVirtualEmail = (name: string) => `${name}@hbibirr.com`;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const virtualEmail = getVirtualEmail(username);

      if (isLogin) {
        // --- 登录逻辑 (不需要邀请码) ---
        const { error } = await supabase.auth.signInWithPassword({
          email: virtualEmail,
          password: password,
        });
        if (error) throw error;
        // 登录成功会自动跳转
      } else {
        // --- 注册逻辑 (必须校验邀请码) ---
        
        // 1. 先去数据库查邀请码对不对
        const { data: codeData, error: codeError } = await supabase
          .from('invitation_codes')
          .select('*')
          .eq('code', inviteCode.toUpperCase()) // 自动转大写
          .eq('is_used', false) // 必须是没用过的
          .single();

        if (codeError || !codeData) {
          throw new Error('邀请码无效或已被使用！');
        }

        // 2. 邀请码有效，开始注册 Supabase 账号
        const { error: signUpError } = await supabase.auth.signUp({
          email: virtualEmail,
          password: password,
          options: {
            data: { username: username } // 把纯用户名存到 metadata 里
          }
        });

        if (signUpError) throw signUpError;

        // 3. 注册成功后，把邀请码标记为“已使用”
        await supabase
          .from('invitation_codes')
          .update({ is_used: true, used_by: username })
          .eq('id', codeData.id);

        setMsg('注册成功！正在自动登录...');
        
        // 4. 注册后尝试自动登录一下
        await supabase.auth.signInWithPassword({
            email: virtualEmail,
            password: password,
        });
      }
    } catch (error: any) {
      console.error(error);
      // 翻译一些常见的 Supabase 错误
      if (error.message.includes('User already registered')) {
        setMsg('该用户名已被注册，请换一个');
      } else if (error.message.includes('Invalid login credentials')) {
        setMsg('用户名或密码错误');
      } else {
        setMsg(error.message || '操作失败');
      }
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
          <h2 className="text-2xl font-bold text-gray-900">{isLogin ? '欢迎回来' : '使用邀请码加入'}</h2>
          <p className="text-xs text-gray-400 mt-2">HBIbirr Creative Hub</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {/* 用户名输入框 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">用户名 Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold text-gray-800"
              placeholder="请输入你的昵称"
            />
          </div>

          {/* 密码输入框 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">密码 Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
              placeholder="设置登录密码"
            />
          </div>

          {/* 邀请码输入框 (只在注册时显示) */}
          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 fade-in">
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">邀请码 Invitation Code</label>
              <input 
                type="text" 
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-mono tracking-widest text-indigo-800"
                placeholder="请输入6位邀请码"
              />
            </div>
          )}

          {msg && <div className={`text-xs text-center p-2 rounded-lg ${msg.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{msg}</div>}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '验证并注册')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMsg(''); }}
            className="text-xs text-gray-400 hover:text-indigo-600 font-bold transition-colors"
          >
            {isLogin ? '没有账号？使用邀请码注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;