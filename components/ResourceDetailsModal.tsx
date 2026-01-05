
import React from 'react';
import { Resource } from '../types';
import { ICONS } from '../constants';

interface ResourceDetailsModalProps {
  resource: Resource;
  isAdmin?: boolean;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const ResourceDetailsModal: React.FC<ResourceDetailsModalProps> = ({ resource, isAdmin, onEdit, onDelete, onClose }) => {
  const getStatusBadge = (status: string = 'available') => {
    switch (status) {
      case 'available':
        return (
          <span className="font-bold text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            可获取
          </span>
        );
      case 'maintenance':
        return (
          <span className="font-bold text-amber-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            维护中
          </span>
        );
      default:
        return (
          <span className="font-bold text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            未上传
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white md:text-gray-400 md:hover:text-gray-600 p-2 rounded-full transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* 左侧/顶部：预览图 */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
          <img 
            src={resource.coverImage} 
            alt={resource.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>
          <div className="absolute bottom-4 left-6 md:hidden">
             <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              {resource.category}
            </span>
          </div>
        </div>

        {/* 右侧：详细内容 */}
        <div className="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  {resource.category}
                </span>
                {resource.difficulty && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                    {resource.difficulty}
                  </span>
                )}
              </div>
              
              {isAdmin && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit?.(resource)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                    title="编辑"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button 
                    onClick={() => onDelete?.(resource.id)}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    title="删除"
                  >
                    <ICONS.Trash />
                  </button>
                </div>
              )}
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-2">
              {resource.title}
            </h2>
            {resource.author && (
              <p className="text-indigo-500 font-medium flex items-center gap-2">
                <span className="w-4 h-px bg-indigo-200"></span>
                By {resource.author}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">作品描述</h4>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-gray-400">资源格式</span>
                <span className="font-bold text-gray-700 uppercase">{resource.category === '钢琴谱' ? 'PDF / 音频' : resource.category === '绘画' ? 'PNG / PSD' : 'EPUB / TXT'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">状态</span>
                {getStatusBadge(resource.status)}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex gap-4">
            {resource.status === 'available' ? (
              <a 
                href={resource.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download={resource.fileUrl.startsWith('data:') ? resource.title : undefined}
                className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
              >
                <ICONS.Download />
                <span>立即获取资源</span>
              </a>
            ) : (
              <button 
                disabled
                className="flex-1 bg-gray-200 text-gray-400 font-bold py-4 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="text-lg">🚫</span>
                <span>{resource.status === 'maintenance' ? '资源维护中' : '暂未上传'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsModal;
