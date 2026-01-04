
import React, { useState } from 'react';
import { PostType } from '../types';
import { ICONS } from '../constants';
import { polishCaption } from '../services/geminiService';

interface PostFormProps {
  onAddPost: (type: PostType, caption: string, content: string) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [type, setType] = useState<PostType>('text');
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    if (!caption || isPolishing) return;
    setIsPolishing(true);
    const polished = await polishCaption(caption);
    setCaption(polished || caption);
    setIsPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    onAddPost(type, caption, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
          <h3 className="text-xl font-bold text-gray-900">发布新动态</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            {(['text', 'image', 'video'] as PostType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  type === t ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'text' && <ICONS.Feather />}
                {t === 'image' && <ICONS.Image />}
                {t === 'video' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>}
                {t === 'text' ? '文字' : t === 'image' ? '图片' : '视频'}
              </button>
            ))}
          </div>

          {type !== 'text' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">资源 URL</label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴图片或视频链接..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                required
              />
            </div>
          )}

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">此刻的想法</label>
              <button 
                type="button"
                onClick={handlePolish}
                disabled={!caption || isPolishing}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                  isPolishing ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
                }`}
              >
                <ICONS.Sparkles />
                {isPolishing ? '润色中...' : 'AI 艺术润色'}
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="记录你的艺术灵感..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100"
          >
            立即发布
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
