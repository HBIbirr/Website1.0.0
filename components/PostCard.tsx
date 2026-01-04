
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment } from '../types';
import { ICONS } from '../constants';

interface PostCardProps {
  post: Post;
  onAddComment: (postId: string, comment: string) => void;
  onDeletePost: (postId: string) => void;
  onHidePost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onAddComment, onDeletePost, onHidePost }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
      {post.type === 'image' && (
        <img src={post.content} alt="Post content" className="w-full aspect-[4/3] object-cover" />
      )}
      {post.type === 'video' && (
        <video src={post.content} controls className="w-full aspect-video bg-black" />
      )}
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              我
            </div>
            <div className="text-xs text-gray-400">
              {new Date(post.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
            >
              <ICONS.More />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => {
                    onHidePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ICONS.EyeOff />
                  隐藏动态
                </button>
                <button 
                  onClick={() => {
                    if (confirm('确定要删除这条动态吗？')) {
                      onDeletePost(post.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <ICONS.Trash />
                  删除动态
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-800 leading-relaxed mb-4">{post.caption}</p>
        
        <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 text-sm transition-colors"
          >
            <ICONS.MessageCircle />
            <span>{post.comments.length} 条评论</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                  <span className="font-semibold text-indigo-900 mr-2">{comment.author === 'Guest' ? '访客' : comment.author}:</span>
                  <span className="text-gray-700">{comment.text}</span>
                </div>
              ))}
              {post.comments.length === 0 && (
                <p className="text-xs text-center text-gray-400 py-2">暂无评论，快来抢沙发吧！</p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="说点好听的..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <ICONS.Plus />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
