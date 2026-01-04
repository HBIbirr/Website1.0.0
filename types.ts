
export type PostType = 'text' | 'image' | 'video';
export type ResourceCategory = '钢琴谱' | '绘画' | '小说';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  type: PostType;
  content: string; // text or URL
  caption: string;
  timestamp: number;
  comments: Comment[];
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
}

export interface Wish {
  id: string;
  requester: string;
  type: 'Drawing' | 'Piano' | 'Other';
  description: string;
  timestamp: number;
  status: 'Pending' | 'Completed';
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
}
