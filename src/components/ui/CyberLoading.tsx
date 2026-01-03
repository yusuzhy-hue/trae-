'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function CyberLoading({ text = "AI 正在生成中..." }: { text?: string }) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-24 h-24">
        {/* Rotating Rings */}
        <motion.div 
          className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-purple-500/30 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 border-4 border-t-transparent border-r-cyan-500 border-b-transparent border-l-cyan-500/30 rounded-full"
          animate={{ rotate: -180 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 bg-purple-500/20 rounded-full blur-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
      
      {/* Text with Typewriter effect */}
      <div className="font-mono text-purple-300 text-sm tracking-widest">
        {text}{dots}
      </div>

      {/* Code Scrolling Effect (Simulated) */}
      <div className="h-20 overflow-hidden w-64 mask-gradient-b opacity-50 text-[10px] text-green-400 font-mono text-center">
        <motion.div
          animate={{ y: [0, -100] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="truncate">
              0x{Math.random().toString(16).slice(2, 10).toUpperCase()} // 处理节点_{i}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
