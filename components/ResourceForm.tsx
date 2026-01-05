
import React, { useState, useEffect, useRef } from 'react';
import { Resource, ResourceCategory } from '../types';
import { ICONS } from '../constants';

interface ResourceFormProps {
  initialData?: Resource;
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource?: (id: string, resource: Partial<Resource>) => void;
  onClose: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialData, onAddResource, onUpdateResource, onClose }) => {
  const [formData, setFormData] = useState({
    title: '', 
    category: '钢琴谱' as ResourceCategory, 
    difficulty: '简单' as any, 
    fileUrl: '', 
    coverImage: '', 
    description: '', 
    author: '',
    status: 'pending' as 'available' | 'pending' | 'maintenance'
  });
  
  const [uploadType, setUploadType] = useState<'link' | 'file'>('link');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        difficulty: initialData.difficulty || '简单',
        fileUrl: initialData.fileUrl,
        coverImage: initialData.coverImage,
        description: initialData.description,
        author: initialData.author || '',
        status: initialData.status || 'available'
      });
      // 简单判断是否为 Base64 自动切换到文件模式
      if (initialData.fileUrl.startsWith('data:')) {
        setUploadType('file');
      }
    }
  }, [initialData]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          fileUrl: reader.result as string,
          status: 'available' // 上传文件后自动标记为可获取
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData && onUpdateResource) {
      onUpdateResource(initialData.id, formData);
    } else {
      onAddResource(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-gray-100 bg-indigo-50/30 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ICONS.Book />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{initialData ? '编辑资源详情' : '上架新资源'}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2"><ICONS.More /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto no-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧：封面上传/预览 */}
            <div className="w-full md:w-48 shrink-0">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2 block">资源封面</label>
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="aspect-[3/4] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden relative group"
              >
                {formData.coverImage ? (
                  <>
                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold">更换图片</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ICONS.Plus />
                    <span className="text-[10px] text-gray-400 font-bold mt-2">上传图片</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={coverInputRef} 
                  onChange={handleCoverChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="mt-3">
                <input 
                  type="url" 
                  value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] outline-none" 
                  placeholder="或粘贴图片 URL" 
                />
              </div>
            </div>

            {/* 右侧：详细信息 */}
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">作品名称</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="例如：月光奏鸣曲" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">所属分类</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-100" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ResourceCategory})}>
                      <option value="钢琴谱">钢琴谱</option><option value="绘画">绘画资源</option><option value="小说">文学作品</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">创作者</label>
                  <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" placeholder="原作者或你的署名" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">上手难度</label>
                  <select className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-100" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})}>
                      <option value="简单">简单 - 适合入门</option><option value="中级">中级 - 需要基础</option><option value="高级">高级 - 专业挑战</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">资源简介</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm h-28 resize-none outline-none focus:ring-2 focus:ring-indigo-100" placeholder="用几句话描述这个资源的独特之处..."></textarea>
              </div>

              {/* 资源文件上传区域 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">资源文件</label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button type="button" onClick={() => setUploadType('link')} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${uploadType === 'link' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>网络链接</button>
                    <button type="button" onClick={() => setUploadType('file')} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${uploadType === 'file' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>本地上传</button>
                  </div>
                </div>
                
                {uploadType === 'link' ? (
                  <div className="relative">
                    <input type="url" required={!formData.fileUrl} value={formData.fileUrl.startsWith('data:') ? '' : formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" placeholder="https://..." />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"><ICONS.Download /></div>
                  </div>
                ) : (
                  <div className="relative">
                     <div 
                      onClick={() => resourceInputRef.current?.click()}
                      className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/20 transition-all text-gray-500"
                    >
                      <ICONS.Book />
                      <span>{formData.fileUrl.startsWith('data:') ? '文件已选择 (点击更换)' : '点击选择本地文件'}</span>
                    </div>
                    <input type="file" ref={resourceInputRef} onChange={handleResourceFileChange} className="hidden" />
                  </div>
                )}
                {formData.fileUrl && <p className="text-[10px] text-green-500 font-bold px-1 truncate">当前文件: {formData.fileUrl.startsWith('data:') ? '本地上传文件 (Data URL)' : formData.fileUrl}</p>}
              </div>

              {/* 状态编辑 */}
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">当前状态</label>
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-100" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                      <option value="available">✅ 可获取</option>
                      <option value="pending">⏳ 未上传 / 待定</option>
                      <option value="maintenance">🔧 维护中</option>
                  </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
            >
              取消
            </button>
            <button 
              type="submit" 
              disabled={!formData.coverImage || !formData.fileUrl}
              className={`flex-[2] text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 ${(!formData.coverImage || !formData.fileUrl) ? 'bg-indigo-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'}`}
            >
              {initialData ? '保存资源更改' : '正式上架资源'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
