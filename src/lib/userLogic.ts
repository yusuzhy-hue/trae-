export interface CategoryStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  totalXP: number;
}

export interface UserStats {
  painting: CategoryStats;
  music: CategoryStats;
  speech: CategoryStats;
  video: CategoryStats;
  coding: CategoryStats;
}

export interface XPHistoryItem {
  date: string; // ISO string
  attribute: keyof UserStats;
  amount: number;
}

export interface UserProgress {
  level: number;
  currentXP: number; // XP within the current level
  totalXP: number;   // Cumulative XP since beginning
  title: string;
  categoryXP: Record<string, number>; // XP per category (legacy/simple)
  stats: UserStats; // Detailed 5-dimension stats
  xpHistory: XPHistoryItem[];
}

const LEVEL_TITLES = [
  { level: 1, title: "初级 AI 学徒" },
  { level: 4, title: "中级 AI 创造者" },
  { level: 7, title: "高级 AI 大师" },
  { level: 10, title: "传奇 AI 领主" },
];

const ATTRIBUTE_TITLES: Record<string, { min: number; max: number; title: string }[]> = {
  painting: [
    { min: 1, max: 5, title: "涂鸦学徒" },
    { min: 6, max: 10, title: "光影匠人" },
    { min: 11, max: 999, title: "赛博画圣" },
  ],
  // Default fallbacks for other categories if needed
  default: [
    { min: 1, max: 5, title: "入门新手" },
    { min: 6, max: 10, title: "熟练能手" },
    { min: 11, max: 999, title: "领域专家" },
  ]
};

const STORAGE_KEY = "ai_platform_user_progress";

/**
 * Calculates XP gained from a task.
 * Formula: 50 + AI_Score * 1.5. (Member * 1.2)
 */
export function calculateXPGain(aiScore: number, isMember: boolean = false): number {
  const baseXP = 50;
  let gained = baseXP + aiScore * 1.5;
  if (isMember) {
    gained *= 1.2;
  }
  return Math.round(gained);
}

/**
 * Calculates the total XP required to reach a specific level.
 * Formula derived from: Level L requires (L-1)*500 to reach L from L-1.
 * Total XP for Level N = 250 * N * (N - 1)
 */
export function getTotalXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return 250 * level * (level - 1);
}

/**
 * Calculates current level based on total XP.
 * Inverse of TotalXP formula: L = floor((1 + sqrt(1 + 4 * (TotalXP / 250))) / 2)
 */
export function calculateLevelFromTotalXP(totalXP: number): number {
  if (totalXP < 0) return 1;
  const level = Math.floor((1 + Math.sqrt(1 + 4 * (totalXP / 250))) / 2);
  return Math.max(1, level);
}

/**
 * Gets the title for a specific level.
 */
export function getTitleForLevel(level: number): string {
  let currentTitle = LEVEL_TITLES[0].title;
  for (const milestone of LEVEL_TITLES) {
    if (level >= milestone.level) {
      currentTitle = milestone.title;
    }
  }
  return currentTitle;
}

/**
 * Gets the title for a specific attribute level.
 */
export function getAttributeTitle(attribute: string, level: number): string {
  const titles = ATTRIBUTE_TITLES[attribute] || ATTRIBUTE_TITLES['default'];
  const match = titles.find(t => level >= t.min && level <= t.max);
  return match ? match.title : titles[titles.length - 1].title;
}

/**
 * Loads user progress from localStorage.
 */
export function loadUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return { 
      level: 1, 
      currentXP: 0, 
      totalXP: 0, 
      title: getTitleForLevel(1), 
      categoryXP: {},
      stats: JSON.parse(JSON.stringify(DEFAULT_STATS)),
      xpHistory: []
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Migration: ensure categoryXP exists
    if (!parsed.categoryXP) {
      parsed.categoryXP = {};
    }
    // Migration: ensure xpHistory exists
    if (!parsed.xpHistory) {
      parsed.xpHistory = [];
    }
    // Migration: ensure stats exists
    if (!parsed.stats) {
      parsed.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
      // Try to backfill from categoryXP if possible?
      // For now, just init defaults.
      // If we have existing categoryXP, we could recalculate levels.
      // Let's do a simple sync: if categoryXP['music'] exists, update stats.music
      for (const key of ['music', 'speech', 'video', 'coding', 'painting'] as const) {
        if (parsed.categoryXP[key]) {
           const total = parsed.categoryXP[key];
           const lvl = calculateLevelFromTotalXP(total);
           const xpForLvl = getTotalXPForLevel(lvl);
           parsed.stats[key] = {
             level: lvl,
             xp: total - xpForLvl,
             nextLevelXp: getXPToNextLevel(lvl),
             totalXP: total
           };
        }
      }
    }
    return parsed;
  }
  return { 
    level: 1, 
    currentXP: 0, 
    totalXP: 0, 
    title: getTitleForLevel(1), 
    categoryXP: {},
    stats: JSON.parse(JSON.stringify(DEFAULT_STATS)),
    xpHistory: []
  };
}

const DEFAULT_STATS: UserStats = {
  painting: { level: 1, xp: 0, nextLevelXp: 500, totalXP: 0 },
  music: { level: 1, xp: 0, nextLevelXp: 500, totalXP: 0 },
  speech: { level: 1, xp: 0, nextLevelXp: 500, totalXP: 0 },
  video: { level: 1, xp: 0, nextLevelXp: 500, totalXP: 0 },
  coding: { level: 1, xp: 0, nextLevelXp: 500, totalXP: 0 },
};

export interface AttributeUpdateResult {
  attribute: keyof UserStats;
  leveledUp: boolean;
  newLevel: number;
  xpAdded: number;
  currentXP: number;
  nextLevelXP: number;
}

/**
 * Adds XP to a specific attribute and handles leveling up.
 * Returns the update result for frontend effects.
 */
export function addAttributeXP(attribute: keyof UserStats, amount: number): AttributeUpdateResult {
  const currentProgress = loadUserProgress();
  const stats = currentProgress.stats;
  
  if (!(attribute in stats)) {
    // Should not happen given typing, but safety check
    throw new Error(`Invalid attribute: ${attribute}`);
  }

  const attrStat = stats[attribute];
  
  // Add XP
  let newXP = attrStat.xp + amount;
  let newLevel = attrStat.level;
  let nextLevelXp = attrStat.nextLevelXp;
  let leveledUp = false;

  // Level up logic: bucket style
  // While current XP >= required for next level
  while (newXP >= nextLevelXp) {
    newXP -= nextLevelXp;
    newLevel++;
    leveledUp = true;
    // Update requirement for NEXT level
    // Formula: Level * 500 (consistent with global)
    nextLevelXp = getXPToNextLevel(newLevel);
  }

  // Update stats object
  stats[attribute] = {
    level: newLevel,
    xp: newXP,
    nextLevelXp: nextLevelXp,
    totalXP: attrStat.totalXP + amount
  };

  // Update History
  const historyItem: XPHistoryItem = {
    date: new Date().toISOString(),
    attribute: attribute,
    amount: amount
  };
  
  // Keep last 100 items to avoid unlimited growth
  const newHistory = [...(currentProgress.xpHistory || []), historyItem].slice(-100);

  // Also update global progress (optional but recommended for consistency)
  // We can manually update global stats here to ensure sync
  // Or we can just save the updated stats.
  // However, updateUserProgress usually handles global XP. 
  // If this function is "Core", maybe it should ONLY update attribute?
  // But data integrity suggests we should save it.
  
  // Let's save the attribute change back to localStorage
  // preserving other fields
  const newProgress: UserProgress = {
    ...currentProgress,
    stats: stats,
    xpHistory: newHistory
    // Note: We are NOT updating global level/XP here unless we want to.
    // The user request was specific to "addAttributeXP".
    // If we want global XP to also increase, we should do it.
    // Usually "gaining painting XP" implies "gaining character XP".
    // Let's trigger a global update too? 
    // Actually, let's keep it focused on Attribute as requested.
    // The caller can call updateUserProgress if they want global XP.
    // BUT, for simplicity, I'll save the progress with updated stats.
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }

  return {
    attribute,
    leveledUp,
    newLevel,
    xpAdded: amount,
    currentXP: newXP,
    nextLevelXP: nextLevelXp
  };
}

/**
 * Updates user progress after gaining XP.
 * Returns details about the update, including if a level up occurred.
 */
export function updateUserProgress(xpGained: number, category?: string): {
  progress: UserProgress;
  leveledUp: boolean;
  levelUpMessage?: string;
} {
  const currentProgress = loadUserProgress();
  const newTotalXP = currentProgress.totalXP + xpGained;
  const newLevel = calculateLevelFromTotalXP(newTotalXP);
  
  // Update category XP
  const newCategoryXP = { ...currentProgress.categoryXP };
  const newStats = JSON.parse(JSON.stringify(currentProgress.stats)); // Deep copy to be safe

  if (category) {
    newCategoryXP[category] = (newCategoryXP[category] || 0) + xpGained;

    // Update detailed stats if category matches
    // Note: ensure category string matches UserStats keys
    if (category in newStats) {
      const key = category as keyof UserStats;
      const oldStat = newStats[key];
      const newTotal = oldStat.totalXP + xpGained;
      
      // Calculate new level for this category
      // Using global formula for consistency: Level L requires (L-1)*500
      const newLvl = calculateLevelFromTotalXP(newTotal);
      const xpForLvl = getTotalXPForLevel(newLvl);
      
      newStats[key] = {
        level: newLvl,
        xp: newTotal - xpForLvl,
        nextLevelXp: getXPToNextLevel(newLvl),
        totalXP: newTotal
      };
    }
  }
  
  // Calculate XP within current level
  // XP used for previous levels = TotalXPForLevel(newLevel)
  // CurrentXP = NewTotalXP - XP_Required_To_Reach_Current_Level
  const xpForCurrentLevelStart = getTotalXPForLevel(newLevel);
  const newCurrentXP = newTotalXP - xpForCurrentLevelStart;
  
  const leveledUp = newLevel > currentProgress.level;
  const newTitle = getTitleForLevel(newLevel);
  
  const newProgress: UserProgress = {
    level: newLevel,
    currentXP: newCurrentXP,
    totalXP: newTotalXP,
    title: newTitle,
    categoryXP: newCategoryXP,
    stats: newStats,
    xpHistory: currentProgress.xpHistory || []
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }

  let levelUpMessage = undefined;
  if (leveledUp) {
    levelUpMessage = `恭喜！你已晋升为 [${newTitle}] (Lv.${newLevel})`;
  }

  return {
    progress: newProgress,
    leveledUp,
    levelUpMessage,
  };
}

/**
 * Helper to get XP required for NEXT level up from current level.
 */
export function getXPToNextLevel(level: number): number {
  // Requirement for next level = Level * 500
  return level * 500;
}

/**
 * Analyzes XP history to generate a growth prediction.
 */
export function getGrowthPrediction(history: XPHistoryItem[], stats: UserStats): string {
  if (!history || history.length === 0) return "暂无足够数据进行预测";

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentHistory = history.filter(item => new Date(item.date) >= sevenDaysAgo);
  
  if (recentHistory.length === 0) return "最近 7 天暂无活跃记录";

  // Calculate XP gain per attribute
  const gains: Record<string, number> = {};
  recentHistory.forEach(item => {
    gains[item.attribute] = (gains[item.attribute] || 0) + item.amount;
  });

  // Find max gainer
  let maxAttr = "";
  let maxGain = -1;
  for (const [attr, gain] of Object.entries(gains)) {
    if (gain > maxGain) {
      maxGain = gain;
      maxAttr = attr;
    }
  }

  if (!maxAttr) return "暂无显著提升";

  // Calculate prediction
  // Simple linear projection: Gain / 7 days = Daily Rate
  // Days to target = Needed / Daily Rate
  const dailyRate = maxGain / 7;
  if (dailyRate <= 0) return "数据不足";

  const currentStat = stats[maxAttr as keyof UserStats];
  const currentLevel = currentStat.level;
  
  // Target: Next level multiple of 5 or 10, or just next level?
  // User example: "break Lv.10". 
  // If < 10, target 10. If >= 10, target next +1?
  let targetLevel = 10;
  if (currentLevel >= 10) {
    targetLevel = currentLevel + 1;
  }
  
  // Calculate total XP needed for target level
  const totalXPForTarget = getTotalXPForLevel(targetLevel);
  const currentTotalXP = currentStat.totalXP;
  const xpNeeded = totalXPForTarget - currentTotalXP;
  
  if (xpNeeded <= 0) return `你的 [${maxAttr}] 已经超越 Lv.${targetLevel}！`;

  const daysNeeded = Math.ceil(xpNeeded / dailyRate);
  
  // Translate attribute name
  const attrNameMap: Record<string, string> = {
    painting: '绘画力',
    music: '音乐感',
    speech: '演讲力',
    video: '导演力',
    coding: '逻辑力'
  };
  const attrName = attrNameMap[maxAttr] || maxAttr;

  return `根据你最近 7 天的表现，你的‘${attrName}’提升最快，有望在 ${daysNeeded} 天内突破 Lv.${targetLevel}。`;
}
