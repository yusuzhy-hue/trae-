
import { UserProgress } from './userLogic';

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'painting' | 'music' | 'speech' | 'video' | 'coding' | 'general';
  rarity: BadgeRarity;
  condition: (progress: UserProgress) => boolean;
}

export const BADGE_RARITY_STYLES: Record<BadgeRarity, string> = {
  Common: "shadow-[0_0_10px_rgba(56,189,248,0.3)] border-blue-400/30 bg-blue-950/30 text-blue-100", // Bronze-Blue (interpreted as Tech Blue)
  Rare: "shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-400/40 bg-purple-900/40 text-purple-100", // Silver-Purple
  Epic: "shadow-[0_0_20px_rgba(255,215,0,0.5)] border-yellow-400/50 bg-yellow-900/40 text-yellow-100", // Gold-Gold
  Legendary: "shadow-[0_0_30px_rgba(6,182,212,0.6)] border-cyan-400/60 bg-gradient-to-br from-cyan-900/50 via-purple-900/50 to-pink-900/50 animate-pulse text-cyan-50", // Prismatic-Flowing
};

export const BADGES: Badge[] = [
  // Painting
  {
    id: 'painting_1',
    name: '涂鸦学徒',
    description: '绘画等级达到 Lv.1',
    icon: 'painting',
    rarity: 'Common',
    condition: (p) => p.stats.painting.level >= 1
  },
  {
    id: 'painting_10',
    name: '光影匠人',
    description: '绘画等级达到 Lv.10',
    icon: 'painting',
    rarity: 'Epic',
    condition: (p) => p.stats.painting.level >= 10
  },
  
  // Music
  {
    id: 'music_1',
    name: '音律初识',
    description: '音乐等级达到 Lv.1',
    icon: 'music',
    rarity: 'Common',
    condition: (p) => p.stats.music.level >= 1
  },

  // Coding
  {
    id: 'coding_10',
    name: '逻辑宗师',
    description: '编程等级达到 Lv.10',
    icon: 'coding',
    rarity: 'Epic',
    condition: (p) => p.stats.coding.level >= 10
  },

  // General
  {
    id: 'all_rounder',
    name: '全能专家',
    description: '所有能力均达到 Lv.5',
    icon: 'general',
    rarity: 'Rare',
    condition: (p) => {
      const stats = p.stats;
      return stats.painting.level >= 5 && 
             stats.music.level >= 5 && 
             stats.speech.level >= 5 && 
             stats.video.level >= 5 && 
             stats.coding.level >= 5;
    }
  },
  {
    id: 'legendary_master',
    name: '赛博传奇',
    description: '总等级达到 Lv.20',
    icon: 'general',
    rarity: 'Legendary',
    condition: (p) => p.level >= 20
  }
];
