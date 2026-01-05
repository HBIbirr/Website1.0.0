
import React, { useState } from 'react';
import { PostType } from '../types';
import { ICONS } from '../constants';
import { polishContent } from '../services/geminiService';

interface PostFormProps {
  onAddPost: (type: PostType, caption: string, content: string) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [type, setType] = useState<PostType>('text');
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    onAddPost(type, caption, content);
    onClose();
  };

  const handleAIPolish = async () => {
    if (!caption.trim()) return;
    setIsPolishing(true);
    const polished = await polishContent(caption, 'post');
    setCaption(polished);
    setIsPolishing(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
          <h3 className="text-xl font-bold text-gray-900">发布新动态</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><ICONS.More /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            {(['text', 'image', 'video'] as PostType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${type === t ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'text' ? '文字' : t === 'image' ? '图片' : '视频'}
              </button>
            ))}
          </div>

          {type !== 'text' && (
            <input type="url" value={content} onChange={(e) => setContent(e.target.value)} placeholder="粘贴 URL..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none" required />
          )}

          <div className="relative">
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">此刻的想法</label>
              <button 
                type="button" 
                onClick={handleAIPolish} 
                disabled={isPolishing}
                className={`text-[10px] font-bold flex items-center gap-1 transition-all ${isPolishing ? 'text-gray-300 animate-pulse' : 'text-indigo-600 hover:text-indigo-800'}`}
              >
                <ICONS.Sparkles /> {isPolishing ? '灵感闪烁中...' : 'AI 润色文案'}
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="记录你的艺术灵感..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all">立即发布</button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
