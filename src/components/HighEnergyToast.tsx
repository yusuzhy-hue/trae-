"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Zap } from 'lucide-react'
import { useEffect } from 'react'

interface HighEnergyToastProps {
  isVisible: boolean
  onClose: () => void
}

export const HighEnergyToast = ({ isVisible, onClose }: HighEnergyToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-xl border border-purple-500/50 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-lg animate-pulse" />
              <Gift className="w-8 h-8 text-purple-300 relative z-10" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-purple-300 font-bold text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                高能信号捕获！
              </h3>
              <p className="text-purple-100/80 text-sm">
                检测到物资掉落，快去主页查看！
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
