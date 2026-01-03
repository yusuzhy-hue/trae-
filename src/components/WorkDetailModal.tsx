'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Eye, Calendar, Tag, Share2, User } from 'lucide-react'
import { AIWork } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/authContext'

interface WorkDetailModalProps {
  work: AIWork | null
  onClose: () => void
}

export function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareQRCode, setShowShareQRCode] = useState(false);

  useEffect(() => {
    if (work) {
      setLikeCount(work.likes);
      
      // Check if current user has liked this work (simulated with localStorage)
      if (user) {
        const likedWorks = JSON.parse(localStorage.getItem(`liked_works_${user.phone}`) || '[]');
        setIsLiked(likedWorks.includes(work.id));
      } else {
        setIsLiked(false);
      }
    }
  }, [work, user]);

  const handleLike = () => {
    if (!work) return;
    
    // If not logged in, could redirect to login or show toast. 
    // For now we'll allow "guest" likes but maybe not persist them per user correctly without ID.
    // Using user.phone as unique ID since user object has it.
    
    if (!user) {
        alert("请先登录");
        return;
    }

    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    // Update localStorage
    const likedWorks = JSON.parse(localStorage.getItem(`liked_works_${user.phone}`) || '[]');
    let newLikedWorks;
    if (newIsLiked) {
      newLikedWorks = [...likedWorks, work.id];
    } else {
      newLikedWorks = likedWorks.filter((id: string) => id !== work.id);
    }
    localStorage.setItem(`liked_works_${user.phone}`, JSON.stringify(newLikedWorks));
  };

  if (!work) return null;

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
          className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors z-20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image */}
          <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10" />
             <img 
              src={work.coverUrl} 
              alt={work.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            {/* Quick Actions Overlay */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-4">
              <button 
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-white transition-all border border-white/10",
                  isLiked ? "bg-red-500/80 hover:bg-red-500" : "bg-white/10 hover:bg-white/20"
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked ? "text-white fill-white" : "text-red-500 fill-red-500")} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowShareQRCode(!showShareQRCode)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-white transition-all border border-white/10",
                    showShareQRCode ? "bg-green-600 hover:bg-green-700" : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">分享</span>
                </button>
                
                <AnimatePresence>
                  {showShareQRCode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 p-4 bg-white rounded-xl shadow-xl z-50 w-48"
                    >
                      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                         {/* Placeholder for QR Code */}
                         <img 
                           src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                           alt="分享二维码"
                           className="w-full h-full object-contain"
                         />
                      </div>
                      <p className="text-center text-xs text-gray-500 font-medium">
                        扫一扫分享给微信好友
                      </p>
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white rotate-45 transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-2/5 p-8 flex flex-col bg-[#1e293b]/50 overflow-y-auto">
             <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{work.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {work.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{work.createdAt}</span>
                    </div>
                  )}
                  {work.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{work.views}</span>
                    </div>
                  )}
                </div>
             </div>

             {/* Author Info */}
             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <img 
                  src={work.authorAvatarUrl} 
                  alt={work.authorName} 
                  className="w-10 h-10 rounded-full border border-purple-500/30"
                />
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{work.authorName}</div>
                  <div className="text-xs text-purple-400">{work.authorLevel}</div>
                </div>
             </div>

             <div className="space-y-6 flex-1">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">作品简介</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {work.description || "暂无描述"}
                  </p>
                </div>

                {/* Tags */}
                {work.tags && work.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>

             {/* Footer Actions (Optional) */}
             <div className="mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={handleLike}
                  className={cn(
                    "w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                    isLiked 
                      ? "bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/25" 
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/25"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-white")} />
                  {isLiked ? "已点赞" : "点赞作品"}
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
