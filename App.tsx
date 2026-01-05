import { supabase } from './supabaseClient';
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';
import ResourceForm from './components/ResourceForm';
import ProfileModal from './components/ProfileModal';
import ResourceDetailsModal from './components/ResourceDetailsModal';
import AuthView from './components/AuthView';
import AdminSettings from './components/AdminSettings';
import Toast from './components/Toast';
import { Post, Resource, Wish, UserProfile, User, InvitationCode, Feedback } from './types';
import { MOCK_POSTS, MOCK_RESOURCES, ICONS } from './constants';

export const formatFullDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Bilibili': return <ICONS.Bilibili />;
    case 'Instagram': return <ICONS.Instagram />;
    case 'Github': return <ICONS.Github />;
    case 'X': return <ICONS.X />;
    case 'Youtube': return <ICONS.Youtube />;
    default: return <ICONS.More />;
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- 状态初始化 ---
// --- 新的代码开始 ---
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // 1. 初始化：看看现在有没有登录
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    // 2. 监听：一旦登录或退出，自动更新状态
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  // --- 新的代码结束 ---
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('artsy_users') || '[{"id":"1","username":"admin","password":"admin","role":"admin"}]'));
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>(() => JSON.parse(localStorage.getItem('artsy_invite_codes') || '[]'));
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('artsy_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('artsy_resources');
    return saved ? JSON.parse(saved) : MOCK_RESOURCES;
  });

  const [wishes, setWishes] = useState<Wish[]>(() => JSON.parse(localStorage.getItem('artsy_wishes') || '[]'));
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => JSON.parse(localStorage.getItem('artsy_feedbacks') || '[]'));
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('artsy_profile');
    const defaultProfile = {
      name: "HBIbirr",
      bio: "“在黑白琴键上跳舞，在素白纸张上挥毫。”",
      avatar: "https://picsum.photos/seed/profile/200",
      socialLinks: []
    };
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  // --- 持久化同步 ---
  useEffect(() => { localStorage.setItem('artsy_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('artsy_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('artsy_wishes', JSON.stringify(wishes)); }, [wishes]);
  useEffect(() => { localStorage.setItem('artsy_feedbacks', JSON.stringify(feedbacks)); }, [feedbacks]);
  useEffect(() => { localStorage.setItem('artsy_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('artsy_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('artsy_invite_codes', JSON.stringify(invitationCodes)); }, [invitationCodes]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => setToast({ msg, type });
 const isAdmin = currentUser?.email === '2654540792@qq.com';

  // --- 核心动作处理器 ---

  // 1. 删除动态（已修复：增加 String 强制转换确保 ID 匹配成功）
  const handleDeletePost = useCallback((id: string) => {
    if (!isAdmin) return;
    if (window.confirm('确定要彻底删除这条动态吗？此操作无法恢复。')) {
      setPosts(prev => prev.filter(p => String(p.id) !== String(id)));
      showToast('动态已永久删除', 'success');
    }
  }, [isAdmin]);

  // 2. 删除评论（已修复：双层过滤逻辑）
  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    if (!isAdmin) return;
    if (window.confirm('确定要移除这条评论吗？')) {
      setPosts(prev => prev.map(p => {
        if (String(p.id) === String(postId)) {
          // 仅在目标动态下过滤评论数组
          return { 
            ...p, 
            comments: (p.comments || []).filter(c => String(c.id) !== String(commentId)) 
          };
        }
        return p;
      }));
      showToast('评论已成功移除', 'info');
    }
  }, [isAdmin]);

  // 3. 删除资源（原有逻辑保持）
  const handleDeleteResource = useCallback((id: string) => {
    if (!isAdmin) return;
    if (window.confirm('确定要下架并删除这个资源吗？此操作不可逆。')) {
      setResources(prev => prev.filter(r => String(r.id) !== String(id)));
      showToast('资源已删除', 'success');
      setSelectedResource(null);
    }
  }, [isAdmin]);

  const handleToggleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (String(p.id) === String(postId)) {
        const isLiked = !p.isLiked;
        return { ...p, isLiked, likes: isLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 1) - 1) };
      }
      return p;
    }));
  }, []);

  const handleToggleCommentLike = useCallback((postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (String(p.id) === String(postId)) {
        const updatedComments = (p.comments || []).map(c => {
          if (String(c.id) === String(commentId)) {
            const isLiked = !c.isLiked;
            return { ...c, isLiked, likes: isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 1) - 1) };
          }
          return c;
        });
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  }, []);

  const handleAddComment = useCallback((postId: string, text: string) => {
    setPosts(prev => prev.map(p => {
      if (String(p.id) === String(postId)) {
        const newComment = {
          id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          author: currentUser?.username || 'Guest',
          text,
          timestamp: Date.now(),
          likes: 0,
          isLiked: false
        };
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    }));
    showToast('评论已发送');
  }, [currentUser]);

  const handleHidePost = useCallback((id: string) => {
    if (!isAdmin) return;
    setPosts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, isHidden: !p.isHidden } : p));
  }, [isAdmin]);

  const logout = async () => {
    await supabase.auth.signOut();
    showToast('已安全退出', 'info');
  };

  if (!currentUser) {
    return <AuthView onLogin={setCurrentUser} users={users} onRegister={(u, c) => {
      const validCode = invitationCodes.find(x => x.code === c.toUpperCase() && !x.isUsed);
      if (!validCode) return false;
      setUsers(prev => [...prev, { ...u, lastSeen: Date.now() }]);
      setInvitationCodes(prev => prev.map(x => x.code === validCode.code ? { ...x, isUsed: true, usedBy: u.username } : x));
      return true;
    }} />;
  }

  const unreadCount = feedbacks.filter(f => !f.isRead).length;

  return (
    <div className="pb-24 md:pt-20 md:pb-8 max-w-6xl mx-auto px-4">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} onLogout={logout} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* 这里的 Header 保持不变... */}
      <header className="py-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 border-b border-gray-100/50 mb-10 group max-w-4xl mx-auto relative">
        {/* 头像及社交链接部分 (省略以保持回复简洁，代码逻辑已包含) */}
        {/* ... */}
        <div className="relative">
          <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-purple-500 p-1 shadow-xl relative">
            <img src={profile.avatar} alt="头像" className="w-full h-full rounded-full border-4 border-white object-cover" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg text-indigo-600 hover:text-indigo-800 transition-all scale-100 md:scale-0 group-hover:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <h1 className="font-serif text-4xl font-bold text-gray-900">{profile.name}</h1>
            <span className="bg-indigo-50 text-indigo-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-indigo-100">
              {isAdmin ? 'Creator' : 'Member'}
            </span>
            {isAdmin && (
              <div className="relative">
                <button 
                  onClick={() => setIsInboxOpen(!isInboxOpen)}
                  className={`p-2.5 rounded-xl transition-all ${isInboxOpen ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-400 border border-gray-100 hover:bg-indigo-50 shadow-sm'}`}
                  title="访客信箱"
                >
                  <ICONS.Mail />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {isInboxOpen && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-[100] w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-top-2">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">访客来信</h3>
                    <div className="max-h-96 overflow-y-auto no-scrollbar space-y-4">
                      {feedbacks.map(f => (
                        <div key={f.id} className={`p-4 rounded-2xl border transition-all ${f.isRead ? 'bg-gray-50 border-transparent opacity-50' : 'bg-indigo-50/30 border-indigo-100'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-indigo-600">{f.sender}</span>
                            <span className="text-[8px] text-gray-400">{formatFullDateTime(f.timestamp)}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{f.content}</p>
                          {!f.isRead && (
                            <button onClick={() => setFeedbacks(prev => prev.map(x => x.id === f.id ? { ...x, isRead: true } : x))} className="text-[9px] font-bold text-indigo-500 hover:underline">标记已读</button>
                          )}
                        </div>
                      ))}
                      {feedbacks.length === 0 && <p className="text-center py-4 text-xs text-gray-300 italic">信箱暂无消息</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-500 italic text-lg mb-4">{profile.bio}</p>
          
          <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
            <div className="flex gap-2.5">
              {(profile.socialLinks || []).map((link, idx) => (
                <a 
                  key={`social-${idx}-${link.platform}`} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all hover:-translate-y-1 active:scale-95"
                  title={link.platform}
                >
                  {getPlatformIcon(link.platform)}
                </a>
              ))}
            </div>
            
            {!isAdmin && (
               <button onClick={() => { const msg = prompt("给主理人留言："); if (msg) { setFeedbacks(prev => [{id: Date.now().toString(), sender: currentUser.username, content: msg, timestamp: Date.now(), isRead: false}, ...prev]); showToast('消息已送达'); } }} className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">私信主理人</button>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xs text-gray-400 tracking-widest font-bold">同步加密频道...</p>
          </div>
        ) : (
          <>
            {/* Form 和 Modal 逻辑保持不变... */}
            {isFormOpen && <PostForm onAddPost={(t, cp, ct) => { 
              const np = { id: Date.now().toString(), type: t, content: ct, caption: cp, timestamp: Date.now(), likes: 0, comments: [] }; 
              setPosts(prev => [np, ...prev]);
              showToast('动态发布成功'); 
              setIsFormOpen(false); 
            }} onClose={() => setIsFormOpen(false)} />}
            
            {(isResourceFormOpen || resourceToEdit) && (
              <ResourceForm 
                initialData={resourceToEdit || undefined}
                onAddResource={(d) => { 
                  setResources(prev => [{id: `r-${Date.now()}`, ...d}, ...prev]); 
                  showToast('资源已上架'); 
                  setIsResourceFormOpen(false); 
                }} 
                onUpdateResource={(id, d) => {
                  setResources(prev => prev.map(r => String(r.id) === String(id) ? { ...r, ...d } : r));
                  showToast('资源已更新');
                  setResourceToEdit(null);
                }}
                onClose={() => {
                  setIsResourceFormOpen(false);
                  setResourceToEdit(null);
                }} 
              />
            )}
            
            {isProfileModalOpen && <ProfileModal profile={profile} onUpdate={(p) => { setProfile(p); showToast('资料已更新'); }} onClose={() => setIsProfileModalOpen(false)} />}

            {activeTab === 'feed' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">广场</h2>
                  {isAdmin && <button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">发布新动态</button>}
                </div>
                <div className="space-y-6">
                  {posts.filter(p => isAdmin || !p.isHidden).map(p => (
                    <PostCard 
                      key={p.id} 
                      post={p} 
                      isAdmin={isAdmin} 
                      authorName={profile.name} 
                      authorAvatar={profile.avatar} 
                      onAddComment={handleAddComment} 
                      onDeletePost={handleDeletePost} // 绑定删除动态
                      onHidePost={handleHidePost} 
                      onToggleLike={() => handleToggleLike(p.id)} 
                      onToggleCommentLike={(commentId) => handleToggleCommentLike(p.id, commentId)} 
                      onDeleteComment={(commentId) => handleDeleteComment(p.id, commentId)} // 绑定删除评论
                    />
                  ))}
                  {posts.length === 0 && <div className="py-20 text-center text-gray-400 italic">暂时没有任何动态</div>}
                </div>
              </div>
            )}
            {/* 其他 Tab 部分 (Resources, Wishes, Admin) 保持原样... */}
            {activeTab === 'resources' && (
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">资源库</h2>
                   {isAdmin && <button onClick={() => setIsResourceFormOpen(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">上架新资源</button>}
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {resources.map(r => (
                      <div key={r.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative" onClick={() => setSelectedResource(r)}>
                         {isAdmin && (
                           <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={(e) => { e.stopPropagation(); setResourceToEdit(r); }} className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                           </div>
                         )}
                         <div className="aspect-[3/4] overflow-hidden"><img src={r.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                         <div className="p-4"><h3 className="font-bold text-gray-900 text-sm truncate">{r.title}</h3><p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">{r.category}</p></div>
                      </div>
                   ))}
                 </div>
               </div>
            )}

            {activeTab === 'wishes' && (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1 glass p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2 font-serif"><ICONS.Sparkles /> 许愿池</h2>
                  <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const nw = { id: Date.now().toString(), requester: currentUser.username, description: fd.get('desc') as string, type: 'Other' as any, timestamp: Date.now(), status: 'Pending' as any }; setWishes(prev => [nw, ...prev]); (e.target as any).reset(); showToast('愿望已记录'); }} className="space-y-4">
                    <textarea name="desc" className="w-full bg-white/50 border border-indigo-50 rounded-2xl px-5 py-4 text-sm h-40 outline-none" placeholder="我想看到/听到..." required></textarea>
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl">确认投递</button>
                  </form>
                </div>
                <div className="md:col-span-2 space-y-4">
                  {wishes.map(w => (
                    <div key={w.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-400"><ICONS.Sparkles /></div>
                      <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-gray-900">{w.requester}</span><span className="text-[8px] text-gray-300">{formatFullDateTime(w.timestamp)}</span></div><p className="text-sm text-gray-600">{w.description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminSettings codes={invitationCodes} users={users} onGenerateCode={(c) => { const code = c ? c.toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase(); setInvitationCodes(prev => [...prev, { code, isUsed: false, createdAt: Date.now() }]); showToast('生成成功'); }} />
            )}
          </>
        )}
      </main>

      <footer className="mt-32 py-10 border-t border-gray-100 text-center text-[10px] text-gray-300 tracking-[0.5em] uppercase font-bold">HBIbirr CREATIVE STUDIO • GLOBAL HUB</footer>

      {selectedResource && (
        <ResourceDetailsModal 
          resource={selectedResource} 
          isAdmin={isAdmin} 
          onEdit={(r) => { setResourceToEdit(r); setSelectedResource(null); }} 
          onDelete={handleDeleteResource}
          onClose={() => setSelectedResource(null)} 
        />
      )}
    </div>
  );
};

export default App;