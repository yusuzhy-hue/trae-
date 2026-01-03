'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Palette, Music, Video, Mic, Code } from 'lucide-react'

interface XPGainBubbleProps {
  isVisible: boolean
  onClose: () => void
  attribute: string
  amount: number
}

const ATTRIBUTE_CONFIG: Record<string, { label: string, icon: React.ReactNode, color: string }> = {
  painting: { label: '绘画', icon: <Palette className="w-4 h-4" />, color: 'text-pink-400' },
  music: { label: '音乐', icon: <Music className="w-4 h-4" />, color: 'text-purple-400' },
  speech: { label: '演讲', icon: <Mic className="w-4 h-4" />, color: 'text-yellow-400' },
  video: { label: '视频', icon: <Video className="w-4 h-4" />, color: 'text-blue-400' },
  coding: { label: '编程', icon: <Code className="w-4 h-4" />, color: 'text-green-400' },
}

export function XPGainBubble({ isVisible, onClose, attribute, amount }: XPGainBubbleProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const config = ATTRIBUTE_CONFIG[attribute] || { 
    label: attribute, 
    icon: <Zap className="w-4 h-4" />, 
    color: 'text-cyan-400' 
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className={`p-1.5 rounded-full bg-white/10 ${config.color}`}>
              {config.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-mono">能力提升</span>
              <span className="text-sm font-bold text-white flex items-center gap-1">
                [{config.label}] 经验 <span className={config.color}>+{amount}</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
