export interface UserProfile {
  id: string;
  name: string;
  level: string;
  avatarUrl: string;
  likes: number;
}

export interface AIWork {
  id: string;
  authorName: string;
  authorLevel: string;
  authorAvatarUrl: string;
  likes: number;
  title: string;
  coverUrl: string;
}

export const starTeachers: UserProfile[] = [
  {
    id: 't1',
    name: '张教授',
    level: 'AI 专家',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    likes: 1250
  },
  {
    id: 't2',
    name: '李老师',
    level: '资深讲师',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    likes: 980
  },
  {
    id: 't3',
    name: '王博士',
    level: '技术顾问',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    likes: 1500
  }
];

export const starStudents: UserProfile[] = [
  {
    id: 's1',
    name: '小明',
    level: 'L3 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Preston',
    likes: 340
  },
  {
    id: 's2',
    name: '小红',
    level: 'L4 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn',
    likes: 420
  },
  {
    id: 's3',
    name: '小强',
    level: 'L2 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher',
    likes: 210
  },
  {
    id: 's4',
    name: '小丽',
    level: 'L5 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    likes: 560
  }
];

export const studentWorks: AIWork[] = [
  {
    id: 'w1',
    authorName: '小明',
    authorLevel: 'L3',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Preston',
    likes: 120,
    title: '未来城市',
    coverUrl: 'https://picsum.photos/seed/city/400/300'
  },
  {
    id: 'w2',
    authorName: '小红',
    authorLevel: 'L4',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn',
    likes: 230,
    title: '智能助手界面',
    coverUrl: 'https://picsum.photos/seed/tech/400/300'
  },
  {
    id: 'w3',
    authorName: '小强',
    authorLevel: 'L2',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher',
    likes: 85,
    title: '太空探险',
    coverUrl: 'https://picsum.photos/seed/space/400/300'
  },
  {
    id: 'w4',
    authorName: '小丽',
    authorLevel: 'L5',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    likes: 310,
    title: '环保机器人',
    coverUrl: 'https://picsum.photos/seed/robot/400/300'
  },
  {
    id: 'w5',
    authorName: '小华',
    authorLevel: 'L3',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christian',
    likes: 150,
    title: '深海奇缘',
    coverUrl: 'https://picsum.photos/seed/ocean/400/300'
  },
  {
    id: 'w6',
    authorName: '小美',
    authorLevel: 'L4',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    likes: 275,
    title: 'AI 艺术画廊',
    coverUrl: 'https://picsum.photos/seed/art/400/300'
  }
];
