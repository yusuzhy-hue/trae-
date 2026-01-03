export interface UserProfile {
  id: string;
  name: string;
  level: string;
  avatarUrl: string;
  likes: number;
  school?: string;
  grade?: string;
  medals?: string[];
  certificatesCount?: number;
  topWorks?: AIWork[];
  isFollowed?: boolean;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  user: string;
  avatarUrl: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface AIWork {
  id: string;
  authorName: string;
  authorLevel: string;
  authorAvatarUrl: string;
  likes: number;
  title: string;
  coverUrl: string;
  description?: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  comments?: Comment[];
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'text';
  fileUrl?: string;
  fileName?: string;
}

const SAMPLE_WORKS: AIWork[] = [
    {
    id: 'w1',
    authorName: '小明',
    authorLevel: 'L3',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Preston',
    likes: 120,
    title: '未来城市',
    coverUrl: 'https://placehold.co/400x300/1e1b4b/60a5fa?text=未来城市',
    description: '使用 Midjourney V6 生成的赛博朋克风格未来城市概念图，展示了高科技与人类生活的融合。',
    tags: ['赛博朋克', '建筑', '科幻'],
    views: 1205,
    createdAt: '2024-03-15',
    comments: [
      { id: 'c1', user: 'UserA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A', content: '太酷了！', likes: 5, createdAt: '2024-03-15' },
      { id: 'c2', user: 'UserB', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B', content: '赛博朋克风满满', likes: 12, createdAt: '2024-03-16' }
    ]
  },
  {
    id: 'w2',
    authorName: '小红',
    authorLevel: 'L4',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn',
    likes: 230,
    title: '智能助手界面',
    coverUrl: 'https://placehold.co/400x300/064e3b/34d399?text=AI+界面',
    description: '为下一代 AI 助手设计的全息投影界面，强调简洁与交互性。',
    tags: ['UI设计', '全息', '界面'],
    views: 2300,
    createdAt: '2024-03-10'
  },
    {
    id: 'w3',
    authorName: '小强',
    authorLevel: 'L2',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher',
    likes: 85,
    title: '太空探险',
    coverUrl: 'https://placehold.co/400x300/312e81/818cf8?text=太空探险',
    description: '描绘人类首次登陆火星的壮丽场景，使用 Stable Diffusion 生成。',
    tags: ['太空', '火星', '探险'],
    views: 850,
    createdAt: '2024-03-20'
  },
  {
    id: 'w4',
    authorName: '小丽',
    authorLevel: 'L5',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    likes: 310,
    title: '环保机器人',
    coverUrl: 'https://placehold.co/400x300/831843/f472b6?text=环保机器人',
    description: '一个负责城市垃圾分类和回收的可爱机器人设计。',
    tags: ['机器人', '环保', '设计'],
    views: 3100,
    createdAt: '2024-03-05'
  },
    {
    id: 'w5',
    authorName: '小华',
    authorLevel: 'L3',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christian',
    likes: 150,
    title: '深海奇缘',
    coverUrl: 'https://placehold.co/400x300/164e63/22d3ee?text=Deep+Sea',
    description: '探索深海未知生物的奇幻插画。',
    tags: ['海洋', '生物', '奇幻'],
    views: 1500,
    createdAt: '2024-03-18'
  },
  {
    id: 'w6',
    authorName: '小美',
    authorLevel: 'L4',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    likes: 275,
    title: 'AI 艺术画廊',
    coverUrl: 'https://placehold.co/400x300/451a03/fbbf24?text=AI+Art',
    description: '一个完全由 AI 生成的虚拟艺术展厅概念。',
    tags: ['艺术', '虚拟现实', '展厅'],
    views: 2750,
    createdAt: '2024-03-12'
  }
];

export const starTeachers: UserProfile[] = [
  {
    id: 't1',
    name: '张教授',
    level: 'AI 专家',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    likes: 1250,
    school: '清华大学',
    grade: '教授',
    medals: ['painting_10', 'coding_10', 'legendary_master'],
    topWorks: [SAMPLE_WORKS[0], SAMPLE_WORKS[1]]
  },
  {
    id: 't2',
    name: '李老师',
    level: '资深讲师',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    likes: 980,
    school: '北京大学',
    grade: '副教授',
    medals: ['music_1', 'painting_1'],
    topWorks: [SAMPLE_WORKS[2], SAMPLE_WORKS[3]]
  },
  {
    id: 't3',
    name: '王博士',
    level: '技术顾问',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    likes: 1500,
    school: '麻省理工学院',
    grade: '博士后',
    medals: ['all_rounder', 'coding_10'],
    topWorks: [SAMPLE_WORKS[4], SAMPLE_WORKS[5]]
  }
];

export const starStudents: UserProfile[] = [
  {
    id: 's1',
    name: '小明',
    level: 'L3 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Preston',
    likes: 340,
    school: '实验小学',
    grade: '三年级',
    medals: ['painting_1'],
    certificatesCount: 2,
    topWorks: [SAMPLE_WORKS[0], SAMPLE_WORKS[2]]
  },
  {
    id: 's2',
    name: '小红',
    level: 'L4 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn',
    likes: 420,
    school: '第一中学',
    grade: '七年级',
    medals: ['music_1', 'painting_10'],
    certificatesCount: 5,
    topWorks: [SAMPLE_WORKS[1], SAMPLE_WORKS[3]]
  },
  {
    id: 's3',
    name: '小强',
    level: 'L2 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher',
    likes: 210,
    school: '科技小学',
    grade: '二年级',
    medals: [],
    certificatesCount: 0,
    topWorks: [SAMPLE_WORKS[2], SAMPLE_WORKS[4]]
  },
  {
    id: 's4',
    name: '小丽',
    level: 'L5 学员',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    likes: 560,
    school: '艺术中学',
    grade: '高一',
    medals: ['all_rounder'],
    certificatesCount: 8,
    topWorks: [SAMPLE_WORKS[3], SAMPLE_WORKS[5]]
  }
];

export const studentWorks: AIWork[] = [
  {
    id: 'w1',
    authorName: 'Alex',
    authorLevel: 'L3',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    likes: 124,
    title: '未来城市概念图',
    coverUrl: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&auto=format&fit=crop&q=60',
    description: '使用 Midjourney 生成的赛博朋克风格城市，尝试了不同的光照效果。',
    tags: ['赛博朋克', '建筑', '科幻'],
    views: 1205,
    createdAt: '2024-03-15',
    comments: [
      { id: 'c1', user: 'UserA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A', content: '太酷了！', likes: 5, createdAt: '2024-03-15' },
      { id: 'c2', user: 'UserB', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B', content: '赛博朋克风满满', likes: 12, createdAt: '2024-03-16' }
    ]
  },
  {
    id: 'w2',
    authorName: 'Sarah',
    authorLevel: 'L4',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    likes: 89,
    title: '印象派风景',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?w=800&auto=format&fit=crop&q=60',
    description: '模仿莫奈风格的风景画。',
    tags: ['艺术', '风景', '印象派'],
    views: 856,
    createdAt: '2024-03-14',
    comments: []
  },
  {
    id: 'w3',
    authorName: 'Mike',
    authorLevel: 'L2',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    likes: 45,
    title: '机械龙设计',
    coverUrl: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=800&auto=format&fit=crop&q=60',
    description: '为游戏设计的 Boss 概念草图。',
    tags: ['游戏', '角色设计', '机甲'],
    views: 432,
    createdAt: '2024-03-10',
    comments: []
  }
];

export const myLibraryWorks: AIWork[] = [
  {
    id: 'lib_1',
    authorName: 'Me',
    authorLevel: 'L1',
    authorAvatarUrl: '',
    likes: 0,
    title: '梦境森林',
    coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop&q=60',
    description: '一次关于潜意识的探索，生成的森林图像。',
    tags: ['自然', '超现实'],
    createdAt: '2024-03-18'
  },
  {
    id: 'lib_2',
    authorName: 'Me',
    authorLevel: 'L1',
    authorAvatarUrl: '',
    likes: 0,
    title: '霓虹街头',
    coverUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=60',
    description: '雨夜的霓虹灯光。',
    tags: ['摄影', '城市'],
    createdAt: '2024-03-17'
  },
  {
    id: 'lib_3',
    authorName: 'Me',
    authorLevel: 'L1',
    authorAvatarUrl: '',
    likes: 0,
    title: '抽象几何',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60',
    description: '简单的几何图形组合。',
    tags: ['抽象', '极简'],
    createdAt: '2024-03-16'
  },
  {
    id: 'lib_4',
    authorName: 'Me',
    authorLevel: 'L1',
    authorAvatarUrl: '',
    likes: 0,
    title: '复古海报',
    coverUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop&q=60',
    description: '80年代风格的海报设计。',
    tags: ['复古', '设计'],
    createdAt: '2024-03-15'
  }
];
