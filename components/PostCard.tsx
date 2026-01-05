
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment } from '../types';
import { ICONS } from '../constants';
import { formatFullDateTime } from '../App';

interface PostCardProps {
  post: Post;
  authorName: string;
  authorAvatar: string;
  isAdmin: boolean;
  onAddComment: (postId: string, comment: string) => void;
  onDeletePost: (postId: string) => void;
  onHidePost: (postId: string) => void;
  onToggleLike: () => void;
  onToggleCommentLike: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  authorName,
  authorAvatar,
  isAdmin,
  onAddComment, 
  onDeletePost, 
  onHidePost, 
  onToggleLike,
  onToggleCommentLike,
  onDeleteComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [commentText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
    onToggleLike();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-xl group/card relative ${post.isHidden ? 'opacity-60 grayscale-[0.3]' : ''}`}>
      {post.isHidden && isAdmin && (
        <div className="absolute top-4 left-4 z-10 bg-gray-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
          <ICONS.EyeOff /> 仅管理员可见
        </div>
      )}

      {post.type === 'image' && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={post.content} alt="Content" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <img src={authorAvatar} className="w-10 h-10 rounded-full border-2 border-indigo-50" />
            <div>
              <div className="text-sm font-bold text-gray-900">{authorName}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{formatFullDateTime(post.timestamp)}</div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className="text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-50 transition-colors"><ICONS.More /></button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95">
                  <button onClick={() => { onHidePost(post.id); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"><ICONS.EyeOff /> {post.isHidden ? '取消隐藏' : '设为私密'}</button>
                  <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDeletePost(post.id); }} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"><ICONS.Trash /> 删除动态</button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 text-sm font-medium">{post.caption}</p>

        <div className="flex items-center space-x-6 pt-5 border-t border-gray-50">
          <button 
            onClick={handleLikeClick}
            className={`relative flex items-center gap-2 transition-all transform active:scale-95 duration-200 group/like outline-none`}
          >
            <div className={`transition-all duration-300 ${isAnimating ? 'animate-heart-pop' : ''} ${post.isLiked ? 'scale-110 text-red-500' : 'scale-100 text-gray-400'}`}>
              <ICONS.Heart filled={post.isLiked} />
            </div>
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="like-particle text-red-400 text-xs">❤️</span>
              </div>
            )}
            <span className={`text-xs font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}>
              {post.likes || 0}
            </span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors group/msg"
          >
            <ICONS.MessageCircle />
            <span className="text-xs font-bold transition-colors group-hover/msg:text-indigo-600">{post.comments?.length || 0}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {(post.comments || []).map((c) => (
                <div key={c.id} className="bg-gray-50/50 p-4 rounded-2xl group/comment relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-indigo-600">{c.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] text-gray-300">{formatFullDateTime(c.timestamp)}</span>
                      {isAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteComment(c.id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/comment:opacity-100 p-1"
                          title="删除评论"
                        >
                          <ICONS.Trash />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{c.text}</p>
                  <div className="flex justify-end">
                    <button onClick={() => onToggleCommentLike(c.id)} className={`flex items-center gap-1.5 transition-all active:scale-90 ${c.isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
                      <div className="scale-75 origin-right"><ICONS.Heart filled={c.isLiked} /></div>
                      <span className="text-[10px] font-bold">{c.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              {(!post.comments || post.comments.length === 0) && (
                <p className="text-center py-4 text-xs text-gray-300 italic">暂时没有评论...</p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-end gap-3 pt-4 border-t border-gray-50">
              <div className="flex-1 bg-gray-50/80 rounded-2xl px-4 py-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100/50">
                <textarea 
                  ref={textareaRef}
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="说点什么..." 
                  rows={1}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none resize-none py-0 block min-h-[20px] max-h-32"
                />
              </div>
              <button 
                type="submit" 
                disabled={!commentText.trim()}
                className={`p-3 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center justify-center shrink-0 ${
                  commentText.trim() ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ICONS.Send />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
