'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Lock, X, Medal, Award, Star, Zap, Music, Video, Mic, Code, Crown, Share2, Loader2 } from 'lucide-react';
import { BADGES, Badge, BADGE_RARITY_STYLES } from '@/lib/constants';
import { UserProgress } from '@/lib/userLogic';
import { cn } from '@/lib/utils';

// --- Icon Mapping ---
const ICON_MAP: Record<string, React.ElementType> = {
  painting: Medal, // Fallback/Default
  music: Music,
  video: Video,
  speech: Mic,
  coding: Code,
  general: Crown,
};

// --- 3D Tilt Card Component ---
function TiltCard({ children, className, onClick, background }: { children: React.ReactNode, className?: string, onClick?: () => void, background?: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = event.clientX - rect.left - width / 2;
    const mouseYFromCenter = event.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn("relative transition-all duration-200 ease-out cursor-pointer", className)}
    >
      {background}
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}

// --- Legendary Effects ---
const RARITY_GLOWS: Record<string, string> = {
  Common: "rgba(96, 165, 250, 0.6)", // Blue
  Rare: "rgba(192, 132, 252, 0.7)",  // Purple
  Epic: "rgba(250, 204, 21, 0.8)",   // Yellow
  Legendary: "rgba(34, 211, 238, 0.9)", // Cyan
};

const LegendaryParticles = () => {
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            x: Math.cos(p.angle * (Math.PI / 180)) * 60,
            y: Math.sin(p.angle * (Math.PI / 180)) * 60,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          style={{ marginLeft: '-3px', marginTop: '-3px' }}
        />
      ))}
    </div>
  );
};

const LegendaryBorder = () => (
  <motion.div
    className="absolute -inset-[2px] rounded-xl z-[-1]"
    style={{
      background: "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
      backgroundSize: "300% 300%",
    }}
    animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  />
);

// --- Rarity Translation ---
const RARITY_NAMES: Record<string, string> = {
  Common: "普通",
  Rare: "稀有",
  Epic: "史诗",
  Legendary: "传说",
};

// --- Medal Card ---
function MedalCard({ badge, unlocked, onClick }: { badge: Badge; unlocked: boolean; onClick: () => void }) {
  const Icon = ICON_MAP[badge.icon] || Medal;
  const rarityStyle = BADGE_RARITY_STYLES[badge.rarity];
  const isLegendary = badge.rarity === 'Legendary';
  const glowColor = RARITY_GLOWS[badge.rarity];
  const rarityName = RARITY_NAMES[badge.rarity] || badge.rarity;

  if (!unlocked) {
    return (
      <div className="relative group p-6 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center gap-4 opacity-30 hover:opacity-50 transition-opacity h-full">
        <div className="relative">
          <Icon className="w-12 h-12 text-gray-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-300 drop-shadow-md" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-bold text-gray-400">{badge.name}</h3>
          <p className="text-xs text-gray-600 mt-1">未解锁</p>
        </div>
        
        {/* Tooltip */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm rounded-xl z-10 p-4 text-center">
          <p className="text-xs text-gray-300">
            <span className="font-bold block mb-1">解锁条件：</span>
            {badge.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="perspective-1000 h-full">
       <motion.div
         animate={{ y: [-5, 5, -5] }}
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
         className="h-full"
       >
         <TiltCard 
           onClick={onClick} 
           className={cn(
             "h-full p-6 rounded-xl border backdrop-blur-md flex flex-col items-center justify-center gap-4 group", 
             isLegendary ? "" : "overflow-hidden", // Allow particles to bleed for Legendary
             rarityStyle,
             isLegendary && "border-transparent bg-transparent" // Transparent bg to let custom layers show
           )}
           background={
             isLegendary ? (
               <>
                 <LegendaryBorder />
                 <div className="absolute inset-0 bg-black/80 rounded-xl z-[-1]" />
               </>
             ) : undefined
           }
         >
            {/* Rotating Halo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden rounded-xl">
               <div className="w-[150%] h-[150%] bg-gradient-radial from-white/30 to-transparent animate-spin-slow" />
            </div>

            {isLegendary && <LegendaryParticles />}

            {/* Icon */}
            <motion.div 
              className={cn(
                "relative z-10 p-4 rounded-full bg-white/10 shadow-inner ring-1 ring-white/20 transition-transform duration-300",
                isLegendary && "ring-cyan-400/50"
              )}
              animate={{
                rotateY: [0, 360],
                boxShadow: [
                  `inset 0 2px 4px 0 rgba(0,0,0,0.05), 0 0 0px ${glowColor.replace(/[\d.]+\)$/, '0)')}`,
                  `inset 0 2px 4px 0 rgba(0,0,0,0.05), 0 0 20px ${glowColor}`,
                  `inset 0 2px 4px 0 rgba(0,0,0,0.05), 0 0 0px ${glowColor.replace(/[\d.]+\)$/, '0)')}`
                ]
              }}
              transition={{
                rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
               <Icon className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </motion.div>

            {/* Text */}
            <div className="relative z-10 text-center">
               <h3 className={cn(
                 "font-bold tracking-wide text-lg drop-shadow-sm",
                 isLegendary && "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-cyan-300 animate-text-shimmer drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
               )}>
                 {badge.name}
               </h3>
               <p className="text-xs opacity-80 mt-1 uppercase tracking-widest">{badge.rarity}</p>
            </div>
         </TiltCard>
       </motion.div>
    </div>
  );
}

// --- Certificate Modal ---
function CertificateModal({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  if (!badge) return null;
  const Icon = ICON_MAP[badge.icon] || Medal;
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    // Simulate image generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Placeholder logic: Alert user
    // In a real app, this would use html2canvas to capture the modal and download/share it
    alert(`[分享海报已生成]\n用户 ID: USER-8842\n徽章: ${badge.name}\n稀有度: ${RARITY_NAMES[badge.rarity] || badge.rarity}\n\n(图片已保存到相册)`);
    
    setIsSharing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#fffcf0] text-black p-12 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.2)] font-serif overflow-hidden border-8 border-double border-yellow-600/30"
      >
         {/* Decorative Corner Patterns */}
         <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-yellow-600/40 rounded-tl-3xl m-4" />
         <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-yellow-600/40 rounded-tr-3xl m-4" />
         <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-yellow-600/40 rounded-bl-3xl m-4" />
         <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-yellow-600/40 rounded-br-3xl m-4" />

         {/* Content */}
         <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="text-yellow-600/20 absolute inset-0 flex items-center justify-center pointer-events-none select-none">
               <Icon className="w-96 h-96 opacity-10" />
            </div>

            <motion.div
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
            >
               <h2 className="text-4xl font-black tracking-widest text-yellow-800 uppercase mb-2">荣誉证书</h2>
               <p className="text-yellow-700/60 text-sm tracking-[0.5em] uppercase">成就认证</p>
            </motion.div>

            <div className="w-32 h-px bg-yellow-800/20 my-4" />

            <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="space-y-4"
            >
               <p className="text-lg text-gray-600 italic">特此证明该用户已成功解锁</p>
               <h1 className="text-5xl font-bold text-gray-900 font-sans">{badge.name}</h1>
               <p className="text-gray-500 max-w-md mx-auto">{badge.description}</p>
            </motion.div>

            <div className="w-full flex justify-between items-end mt-12 px-12 pt-12">
               <div className="text-center">
                  <div className="w-32 h-px bg-gray-400 mb-2" />
                  <p className="text-xs text-gray-400 uppercase tracking-widest">日期</p>
                  <p className="text-sm font-mono text-gray-600">{new Date().toLocaleDateString()}</p>
               </div>

               {/* Stamp Animation */}
               <motion.div
                  initial={{ scale: 2, opacity: 0, rotate: 45 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 12 }}
                  className="border-4 border-red-700/50 text-red-800 rounded-full w-32 h-32 flex items-center justify-center p-2 transform -rotate-12 mix-blend-multiply"
               >
                  <div className="border border-red-700/30 rounded-full w-full h-full flex items-center justify-center">
                     <span className="text-xs font-black uppercase tracking-widest text-center leading-tight">
                        官方<br/>Trae AI<br/>认证
                     </span>
                  </div>
               </motion.div>

               <div className="text-center">
                  <div className="w-32 h-px bg-gray-400 mb-2" />
                  <p className="text-xs text-gray-400 uppercase tracking-widest">签名</p>
                  <p className="font-script text-xl text-gray-600">AI 平台</p>
               </div>
            </div>
            
            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isSharing}
              className="mt-8 flex items-center gap-2 px-6 py-2 bg-yellow-600 text-white rounded-full font-bold uppercase tracking-wider text-sm shadow-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Poster
                </>
              )}
            </motion.button>
         </div>

         <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
         >
            <X className="w-6 h-6" />
         </button>
      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---
export default function MedalWall({ progress }: { progress: UserProgress }) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPos = (clientX - left) / width - 0.5;
    const yPos = (clientY - top) / height - 0.5;
    mouseX.set(xPos);
    mouseY.set(yPos);
  }

  const bgX = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);

  // Sound Effect
  React.useEffect(() => {
    const audio = new Audio('/sounds/activate.mp3'); // Placeholder path
    audio.volume = 0.1;
    audio.play().catch(e => {
       // Autoplay policies might block this without user interaction
       console.log("Audio play failed (user interaction needed):", e);
    });
  }, []);

  // Stats Calculation
  const { collectedCount, totalCount, currentPoints, maxPoints } = React.useMemo(() => {
    let collected = 0;
    let points = 0;
    let maxP = 0;
    
    // Points mapping
    const RARITY_POINTS: Record<string, number> = {
      Common: 10,
      Rare: 30,
      Epic: 50,
      Legendary: 100,
    };

    BADGES.forEach(badge => {
      const p = RARITY_POINTS[badge.rarity] || 10;
      maxP += p;
      if (badge.condition(progress)) {
        collected++;
        points += p;
      }
    });

    return { 
      collectedCount: collected, 
      totalCount: BADGES.length, 
      currentPoints: points, 
      maxPoints: maxP 
    };
  }, [progress]);

  // Filtering
  const filteredBadges = React.useMemo(() => {
    return BADGES.filter(badge => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'painting') return badge.icon === 'painting';
      if (activeFilter === 'coding') return badge.icon === 'coding';
      if (activeFilter === 'rare') return badge.rarity !== 'Common'; // Show Rare, Epic, Legendary
      return true;
    });
  }, [activeFilter]);

  const TABS = [
    { id: 'all', label: '全部' },
    { id: 'painting', label: '绘画' },
    { id: 'coding', label: '编程' },
    { id: 'rare', label: '稀有' },
  ];

  return (
    <>
      <section 
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl"
        onMouseMove={handleMouseMove}
      >
        {/* Scanline Overlay */}
        <motion.div 
           className="absolute inset-[-20px] pointer-events-none z-0 opacity-10"
           style={{
             background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
             backgroundSize: '100% 4px',
             x: bgX,
             y: bgY
           }}
        />
        <motion.div 
           className="absolute inset-[-20px] pointer-events-none z-0 bg-gradient-to-b from-transparent to-cyan-900/10 animate-scan" 
           style={{ x: bgX, y: bgY }}
        />

        <div className="relative z-10 p-8">
           {/* Header & Stats */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg text-yellow-400 border border-yellow-500/30">
                 <Award className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-white tracking-wide">荣誉墙</h2>
                 <p className="text-xs text-gray-400 uppercase tracking-widest">收藏 & 成就</p>
               </div>
             </div>

             <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest mb-1">
                  <span>进度</span>
                  <span className="text-white">{collectedCount} / {totalCount}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(collectedCount / totalCount) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-xs text-gray-500">积分</span>
                   <span className="text-sm font-bold text-yellow-400 drop-shadow-sm">{currentPoints} <span className="text-[10px] text-gray-600">/ {maxPoints}</span></span>
                </div>
             </div>
           </div>

           {/* Filter Tabs */}
           <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all border",
                    activeFilter === tab.id
                      ? "bg-white/10 border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  )}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[300px]">
             <AnimatePresence mode='popLayout'>
               {filteredBadges.map((badge) => (
                 <motion.div
                   key={badge.id}
                   layout
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   transition={{ duration: 0.3 }}
                 >
                   <MedalCard 
                     badge={badge} 
                     unlocked={badge.condition(progress)} 
                     onClick={() => badge.condition(progress) && setSelectedBadge(badge)}
                   />
                 </motion.div>
               ))}
             </AnimatePresence>
             {filteredBadges.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
                   <div className="p-4 rounded-full bg-white/5 mb-4">
                      <Lock className="w-8 h-8 opacity-50" />
                   </div>
                   <p className="text-sm uppercase tracking-widest">No medals found in this category</p>
                </div>
             )}
           </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedBadge && (
          <CertificateModal 
            badge={selectedBadge} 
            onClose={() => setSelectedBadge(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
