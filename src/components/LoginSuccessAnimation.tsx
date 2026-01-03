'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoginSuccessAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Phase 1: Access Granted Text
    const t1 = setTimeout(() => setPhase(1), 100)
    // Phase 2: Warp Speed / Explosion
    const t2 = setTimeout(() => setPhase(2), 1200)
    // Phase 3: Complete
    const t3 = setTimeout(() => {
      onComplete()
    }, 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden">
      {/* Background Grid - Moving for warp effect */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0 : 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom" />
      </motion.div>

      {/* Phase 1: Access Granted Text */}
      {phase <= 2 && (
        <div className="z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 5, opacity: 0 }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tighter mb-4"
          >
            访问授权成功
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-cyan-400 font-mono text-sm tracking-widest"
          >
            系统正在初始化...
          </motion.p>
        </div>
      )}

      {/* Phase 2: Warp Tunnel / Stargate Effect */}
      {phase >= 1 && (
        <>
            {/* Central Energy Ring */}
            <motion.div
                className="absolute border-[4px] border-cyan-500 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.8)] z-20"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={phase === 2 ? { 
                    width: ["0vw", "200vw"], 
                    height: ["0vw", "200vw"],
                    opacity: [1, 0],
                    borderWidth: ["4px", "50px"]
                } : { width: "100px", height: "100px", opacity: 1 }}
                transition={phase === 2 ? { duration: 1.5, ease: "circIn" } : { duration: 0.5 }}
            />
            
            {/* Secondary Ring */}
            <motion.div
                className="absolute border-[2px] border-purple-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)] z-10"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={phase === 2 ? { 
                    width: ["0vw", "150vw"], 
                    height: ["0vw", "150vw"],
                    opacity: [1, 0],
                    rotate: 180
                } : { width: "150px", height: "150px", opacity: 0.5 }}
                transition={phase === 2 ? { duration: 1.2, ease: "circIn", delay: 0.1 } : { duration: 0.5 }}
            />
        </>
      )}

      {/* Flash Effect */}
      <motion.div
        className="absolute inset-0 bg-white z-[200] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={phase === 2 ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1.5, times: [0, 0.5, 1] }}
      />
    </div>
  )
}
