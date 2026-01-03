"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResourceStore } from "@/lib/resourceStore"
import { Box, Gift, Sparkles, X } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const EQUIPMENT_POOL = [
  "赛博武士刀", 
  "全息壁纸", 
  "量子护盾", 
  "霓虹滑板", 
  "AI 伴侣芯片", 
  "等离子光剑",
  "重力反转靴",
  "神经网络头盔"
]

export const SurprisePackage = () => {
  const { hasPendingPackage, claimPackage } = useResourceStore()
  const [isOpen, setIsOpen] = useState(false)
  const [reward, setReward] = useState<string | null>(null)
  
  // Reset state when package appears
  useEffect(() => {
    if (hasPendingPackage) {
      setIsOpen(false)
      setReward(null)
    }
  }, [hasPendingPackage])

  const handleOpen = () => {
    // Random reward
    const randomReward = EQUIPMENT_POOL[Math.floor(Math.random() * EQUIPMENT_POOL.length)]
    setReward(randomReward)
    setIsOpen(true)
  }

  const handleClaim = () => {
    if (reward) {
      // Save to inventory
      const existingInventory = localStorage.getItem("my_inventory")
      const inventory = existingInventory ? JSON.parse(existingInventory) : []
      
      // Add new item with timestamp
      inventory.push({
        id: Date.now(),
        name: reward,
        acquiredAt: new Date().toISOString()
      })
      
      localStorage.setItem("my_inventory", JSON.stringify(inventory))
      
      // Reset store state
      claimPackage()
      
      // Reset local state
      setIsOpen(false)
      setReward(null)
    }
  }

  return (
    <AnimatePresence>
      {hasPendingPackage && !isOpen && (
        <motion.div
          initial={{ y: -500, opacity: 0, rotate: -180 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              damping: 12, 
              stiffness: 100,
              delay: 0.5 
            }
          }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-24 right-8 z-50 cursor-pointer"
          onClick={handleOpen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Floating Animation Wrapper */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-purple-500/40 blur-xl rounded-full animate-pulse" />
            
            {/* Cube Body */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl border border-purple-400/50 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center overflow-hidden">
              {/* Neon Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:8px_8px]" />
              
              <Gift className="w-8 h-8 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              
              {/* Tag */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded rotate-12 border border-white/20 shadow-sm">
                家园物资
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Explosion / Reward Modal */}
      {isOpen && reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative"
          >
            {/* Burst Particles (Simulated with scaling rings) */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl"
            />
            
            <GlassCard className="w-80 p-6 flex flex-col items-center gap-4 border-purple-500/30 bg-black/80">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-xl opacity-50 rounded-full" 
                />
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl border border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Box className="w-12 h-12 text-purple-300" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-xs text-purple-400 font-mono tracking-widest uppercase">Rare Equipment Found</div>
                <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  {reward}
                </h3>
              </div>

              <button
                onClick={handleClaim}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>存入家园</span>
                <Box className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
