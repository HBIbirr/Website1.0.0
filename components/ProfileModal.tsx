
import React, { useState } from 'react';
import { UserProfile, SocialLink } from '../types';
import { ICONS } from '../constants';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ 
    ...profile,
    socialLinks: profile.socialLinks || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 自动补全社交链接协议
    const processedLinks = formData.socialLinks?.map(link => {
      let url = link.url.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return { ...link, url };
    });
    onUpdate({ ...formData, socialLinks: processedLinks });
    onClose();
  };

  const addSocialLink = () => {
    const newLinks: SocialLink[] = [...(formData.socialLinks || []), { platform: 'Other', url: '' }];
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...(formData.socialLinks || [])];
    newLinks.splice(index, 1);
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(formData.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 bg-indigo-50/30 flex justify-between items-center text-gray-900 shrink-0">
          <h3 className="text-xl font-bold">编辑作者资料</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-gray-900 overflow-y-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full border-2 border-indigo-100 p-1 bg-gray-50 overflow-hidden">
              <img 
                src={formData.avatar} 
                alt="预览" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/200';
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-2 uppercase tracking-widest">昵称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-2 uppercase tracking-widest">头像 URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-gray-400"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-2 uppercase tracking-widest">简介</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 h-24 resize-none focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-gray-400"
                placeholder="写点什么介绍自己..."
              ></textarea>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">社交账号</label>
                <button 
                  type="button"
                  onClick={addSocialLink}
                  className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
                >
                  <ICONS.Plus /> 添加平台
                </button>
              </div>
              <div className="space-y-3">
                {formData.socialLinks?.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                    <div className="relative shrink-0 w-32">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value as any)}
                        className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-indigo-200 pr-8 cursor-pointer"
                      >
                        <option value="Bilibili">Bilibili</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Github">Github</option>
                        <option value="X">X (Twitter)</option>
                        <option value="Youtube">Youtube</option>
                        <option value="Other">其他</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      placeholder="用户名或主页地址..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-indigo-100"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSocialLink(index)}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <ICONS.Trash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all transform active:scale-95 shadow-lg shadow-indigo-100"
          >
            保存修改
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
