"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResourceStore } from "@/lib/resourceStore"
import { Battery, Zap } from "lucide-react"

export const ResourceMonitor = () => {
  const { currentPoints, totalPoints } = useResourceStore()
  const [isShaking, setIsShaking] = useState(false)
  const prevPoints = useRef(currentPoints)

  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (currentPoints / totalPoints) * 100))

  // Detect point decrease for shaking animation
  useEffect(() => {
    if (currentPoints < prevPoints.current) {
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    }
    prevPoints.current = currentPoints
  }, [currentPoints])

  return (
    <motion.div 
      animate={isShaking ? { x: [-2, 2, -2, 2, 0], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}}
      transition={{ duration: 0.4 }}
      className="relative flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-cyan-500/30 group hover:border-cyan-400/50 transition-colors"
    >
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full animate-pulse" />
        <Zap className={`w-4 h-4 ${isShaking ? 'text-red-400' : 'text-cyan-400'} transition-colors`} />
      </div>

      {/* Text Info */}
      <div className="flex flex-col items-end min-w-[140px]">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
          <span>Energy Remaining</span>
        </div>
        <div className="flex items-end gap-1 font-mono leading-none">
          <span className={`text-sm font-bold ${currentPoints < totalPoints * 0.2 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {currentPoints}
          </span>
          <span className="text-[10px] text-gray-500 mb-[1px]">/ {totalPoints}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-32 h-2 bg-gray-900/50 rounded-full overflow-hidden border border-white/10">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4px_100%]" />
        
        {/* Liquid Energy Bar */}
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
          className="relative h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full"
        >
          {/* Flowing Effect Overlay */}
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12"
          />
          
          {/* Glow at the tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_10px_white]" />
        </motion.div>
      </div>
      
      {/* Warning Flash (Low Energy) */}
      {percentage < 20 && (
        <div className="absolute inset-0 border border-red-500/50 rounded-full animate-pulse pointer-events-none" />
      )}
    </motion.div>
  )
}
