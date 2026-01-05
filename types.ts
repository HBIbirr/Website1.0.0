
export type PostType = 'text' | 'image' | 'video';
export type ResourceCategory = '钢琴谱' | '绘画' | '小说';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  lastSeen?: number; // 最近活动时间
}

export interface InvitationCode {
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  content: string; // text or URL
  caption: string;
  timestamp: number;
  comments: Comment[];
  likes: number;
  isLiked?: boolean;
  isHidden?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  difficulty?: '简单' | '中级' | '高级';
  fileUrl: string;
  coverImage: string;
  description: string;
  author?: string;
  status: 'available' | 'pending' | 'maintenance';
}

export interface Wish {
  id: string;
  requester: string;
  type: 'Drawing' | 'Piano' | 'Other';
  description: string;
  timestamp: number;
  status: 'Pending' | 'Completed';
}

export interface Feedback {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface SocialLink {
  platform: 'Bilibili' | 'Instagram' | 'Github' | 'X' | 'Youtube' | 'Other';
  url: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  socialLinks?: SocialLink[];
}
