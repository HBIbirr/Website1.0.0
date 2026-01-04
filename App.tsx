
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';
import { Post, Resource, Wish, PostType, ResourceCategory } from './types';
import { MOCK_POSTS, MOCK_RESOURCES, ICONS } from './constants';
import { generateCreativeIdea } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('artsy_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('artsy_resources');
    return saved ? JSON.parse(saved) : MOCK_RESOURCES;
  });
  const [wishes, setWishes] = useState<Wish[]>(() => {
    const saved = localStorage.getItem('artsy_wishes');
    return saved ? JSON.parse(saved) : [];
  });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<ResourceCategory | '全部'>('全部');

  useEffect(() => {
    localStorage.setItem('artsy_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('artsy_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('artsy_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const addPost = (type: PostType, caption: string, content: string = '') => {
    const newPost: Post = {
      id: Date.now().toString(),
      type,
      content,
      caption,
      timestamp: Date.now(),
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const hidePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, isHidden: true } : p));
  };

  const addComment = (postId: string, text: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now().toString(), author: 'Guest', text, timestamp: Date.now() }]
        };
      }
      return p;
    }));
  };

  const addWish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWish: Wish = {
      id: Date.now().toString(),
      requester: (formData.get('requester') as string) || '匿名访客',
      type: (formData.get('type') as any) === '钢琴' ? 'Piano' : (formData.get('type') as any) === '绘画' ? 'Drawing' : 'Other',
      description: formData.get('description') as string,
      timestamp: Date.now(),
      status: 'Pending'
    };
    setWishes([newWish, ...wishes]);
    (e.target as HTMLFormElement).reset();
  };

  const handleGenerateIdea = async () => {
    if (isGeneratingIdea) return;
    setIsGeneratingIdea(true);
    const idea = await generateCreativeIdea(wishes.map(w => w.description));
    setAiSuggestion(idea);
    setIsGeneratingIdea(false);
  };

  const filteredResources = selectedResourceCategory === '全部' 
    ? resources 
    : resources.filter(r => r.category === selectedResourceCategory);

  const visiblePosts = posts.filter(p => !p.isHidden);

  return (
    <div className="pb-24 md:pt-20 md:pb-8 max-w-4xl mx-auto px-4">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <header className="py-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 border-b border-gray-100/50 mb-10">
        <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-purple-500 p-1 shadow-xl">
          <img 
            src="https://picsum.photos/seed/profile/200" 
            alt="头像" 
            className="w-full h-full rounded-full border-4 border-white object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">HBIbirr 的工作室</h1>
          <p className="text-gray-500 italic text-lg">“在黑白琴键上跳舞，在素白纸张上挥毫。”</p>
        </div>
      </header>

      <main className="min-h-screen">
        {isFormOpen && <PostForm onAddPost={addPost} onClose={() => setIsFormOpen(false)} />}

        {activeTab === 'feed' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ICONS.Feather /> 艺术足迹
              </h2>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <ICONS.Plus />
                <span className="text-sm font-bold">新篇章</span>
              </button>
            </div>
            <div className="space-y-6">
              {visiblePosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onAddComment={addComment} 
                  onDeletePost={deletePost}
                  onHidePost={hidePost}
                />
              ))}
            </div>
            {visiblePosts.length === 0 && (
              <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">目前还没有动态，快去分享你的第一份灵感吧。</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <ICONS.Book /> 资源宝库
                </h2>
                <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2 no-scrollbar">
                  {['全部', '钢琴谱', '绘画', '小说'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedResourceCategory(cat as any)}
                      className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        selectedResourceCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-500 border border-gray-100 hover:bg-indigo-50 hover:text-indigo-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
             </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={resource.coverImage} 
                        alt={resource.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs font-medium">点击查看详情</span>
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] text-indigo-600 font-bold uppercase shadow-sm">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{resource.title}</h3>
                      {resource.author && <p className="text-xs text-indigo-500 mb-3 font-medium">By {resource.author}</p>}
                      <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">{resource.description}</p>
                      <button className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all group/btn">
                        <ICONS.Download />
                        <span>获取文件</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-1">
                 <div className="glass p-8 rounded-3xl shadow-xl border border-indigo-100 sticky top-24">
                   <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-3 mb-4">
                     <ICONS.Sparkles /> 许愿池
                   </h2>
                   <p className="text-sm text-indigo-700/70 mb-8 leading-relaxed">
                     在这里留下你想看到的艺术创作。无论是古典名曲，还是幻想绘卷。
                   </p>
                   <form onSubmit={addWish} className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">你的昵称</label>
                        <input name="requester" type="text" className="w-full bg-white/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="访客名..." required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">心愿类别</label>
                        <select name="type" className="w-full bg-white/50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer">
                          <option>钢琴</option>
                          <option>绘画</option>
                          <option>其他</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">描述心愿</label>
                        <textarea name="description" className="w-full bg-white/50 border border-gray-100 rounded-xl px-4 py-3 text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="我想看到/听到..." required></textarea>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all transform active:scale-95 shadow-xl shadow-indigo-200">
                        投递愿望
                      </button>
                   </form>
                 </div>
               </div>

               <div className="lg:col-span-2 space-y-8">
                 {/* AI Suggestion Box */}
                 <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                      <ICONS.Sparkles />
                    </div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <ICONS.Sparkles /> AI 创作建议
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                      {aiSuggestion || "让 Gemini AI 分析好友们的愿望，为你提供一个绝妙的创作灵感！"}
                    </p>
                    <button 
                      onClick={handleGenerateIdea}
                      disabled={wishes.length === 0 || isGeneratingIdea}
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingIdea ? "正在构思..." : (aiSuggestion ? "重新构思" : "一键生成灵感")}
                    </button>
                 </div>

                 <div className="space-y-4">
                    <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] px-2 mb-6">访客愿望清单 ({wishes.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishes.map(wish => (
                        <div key={wish.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            wish.type === 'Piano' ? 'bg-blue-50 text-blue-600' : wish.type === 'Drawing' ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {wish.type === 'Piano' ? <ICONS.Music /> : wish.type === 'Drawing' ? <ICONS.Feather /> : <ICONS.Plus />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-800">{wish.requester}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{wish.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{wish.type === 'Piano' ? '钢琴' : wish.type === 'Drawing' ? '绘画' : '其他'}</span>
                              <span className="text-[9px] text-gray-300 uppercase font-medium">{new Date(wish.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {wishes.length === 0 && (
                      <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">这里静悄悄的，期待你的第一个愿望。</p>
                      </div>
                    )}
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      <footer className="mt-32 py-10 border-t border-gray-100 text-center text-xs text-gray-300 tracking-widest font-medium">
        &copy; {new Date().getFullYear()} HBIBIRR CREATIVE HUB. BEYOND THE NOTES.
      </footer>
    </div>
  );
};

export default App;
