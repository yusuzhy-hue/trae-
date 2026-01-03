'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, GraduationCap, Trophy, Heart, Plus, Check } from 'lucide-react'
import { UserProfile } from '@/lib/mockData'
import { BADGES, BADGE_RARITY_STYLES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Medal, Music, Video, Mic, Code, Crown } from 'lucide-react'

// Icon Mapping (Duplicated from MedalWall to avoid circular deps or move to a shared util)
const ICON_MAP: Record<string, React.ElementType> = {
  painting: Medal,
  music: Music,
  video: Video,
  speech: Mic,
  coding: Code,
  general: Crown,
};

interface UserDetailModalProps {
  user: UserProfile | null
  onClose: () => void
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [isFollowed, setIsFollowed] = useState(user?.isFollowed || false);

  if (!user) return null;

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    // In a real app, this would update the backend/context
  };

  const userBadges = user.medals?.map(medalId => BADGES.find(b => b.id === medalId)).filter(Boolean) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Profile Info */}
          <div className="w-full md:w-1/3 bg-black/30 p-8 flex flex-col items-center border-r border-white/5 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />

             <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 overflow-hidden shadow-lg">
                   <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-xs font-bold px-2 py-1 rounded-full border border-purple-400">
                  {user.level}
                </div>
             </div>

             <h2 className="text-2xl font-bold text-white mb-2 text-center">{user.name}</h2>
             
             <div className="space-y-2 w-full mb-8">
               {user.school && (
                 <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                   <MapPin className="w-4 h-4 text-purple-400" />
                   <span>{user.school}</span>
                 </div>
               )}
               {user.grade && (
                 <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                   <GraduationCap className="w-4 h-4 text-purple-400" />
                   <span>{user.grade}</span>
                 </div>
               )}
             </div>

             <button
               onClick={handleFollow}
               className={cn(
                 "w-full py-2 px-4 rounded-full flex items-center justify-center gap-2 font-medium transition-all",
                 isFollowed 
                   ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" 
                   : "bg-purple-600 text-white hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
               )}
             >
               {isFollowed ? (
                 <>
                   <Check className="w-4 h-4" /> 已关注
                 </>
               ) : (
                 <>
                   <Plus className="w-4 h-4" /> 关注
                 </>
               )}
             </button>
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-2/3 p-8 bg-[#0f172a] overflow-y-auto max-h-[80vh] custom-scrollbar">
             
             {/* Medals Section */}
             {userBadges.length > 0 && (
               <div className="mb-8">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Trophy className="w-4 h-4 text-yellow-500" /> 获得勋章
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {userBadges.map((badge, idx) => {
                     const Icon = ICON_MAP[badge!.icon] || Medal;
                     return (
                       <div 
                         key={idx} 
                         className={cn(
                           "p-2 rounded-lg border flex items-center gap-2 bg-black/40", 
                           BADGE_RARITY_STYLES[badge!.rarity]
                         )}
                         title={badge!.name}
                       >
                         <Icon className="w-4 h-4" />
                         <span className="text-xs font-medium">{badge!.name}</span>
                       </div>
                     )
                   })}
                 </div>
               </div>
             )}

             {/* Top Works Section */}
             {user.topWorks && user.topWorks.length > 0 && (
               <div>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Heart className="w-4 h-4 text-red-500" /> 热门作品
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {user.topWorks.map((work, idx) => (
                     <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/50 hover:border-white/20 transition-all">
                       <div className="aspect-video relative overflow-hidden">
                         <img src={work.coverUrl} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-xs font-medium text-white">{work.title}</span>
                         </div>
                       </div>
                       <div className="p-3 flex items-center justify-between">
                         <span className="text-xs text-gray-300 truncate max-w-[100px]">{work.title}</span>
                         <div className="flex items-center gap-1 text-xs text-gray-500">
                           <Heart className="w-3 h-3 text-red-500" /> {work.likes}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Stats */}
             <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
               <div>
                 <div className="text-xl font-bold text-white">{user.likes}</div>
                 <div className="text-xs text-gray-500 uppercase">获赞</div>
               </div>
               <div>
                 <div className="text-xl font-bold text-white">{userBadges.length}</div>
                 <div className="text-xs text-gray-500 uppercase">勋章</div>
               </div>
               <div>
                 <div className="text-xl font-bold text-white">{user.topWorks?.length || 0}</div>
                 <div className="text-xs text-gray-500 uppercase">作品</div>
               </div>
             </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
