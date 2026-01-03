'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronRight, 
  Battery, 
  Zap, 
  Activity, 
  Home, 
  Terminal, 
  Cpu, 
  ScanLine 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolLabLayoutProps {
  children?: React.ReactNode // Main canvas area (Center)
  sidebarLeft?: React.ReactNode // Control panel (Left)
  sidebarRight?: React.ReactNode // Inspiration area (Right)
  toolName: string
  toolIcon?: React.ReactNode
  themeColor?: 'green' | 'purple' | 'blue' | 'amber' | 'cyan' | 'pink' | 'orange'
}

export function ToolLabLayout({ 
  children, 
  sidebarLeft, 
  sidebarRight,
  toolName,
  toolIcon,
  themeColor = 'green'
}: ToolLabLayoutProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(85) // Mock energy level
  const [systemText, setSystemText] = useState('系统初始化...')

  const themeColors = {
    green: {
      text: 'text-green-400',
      textDim: 'text-green-500/40',
      border: 'border-green-500',
      borderDim: 'border-green-500/20',
      bg: 'bg-green-500',
      bgDim: 'bg-green-500/10',
      shadow: 'shadow-green-500/20',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-400',
    },
    cyan: {
      text: 'text-cyan-400',
      textDim: 'text-cyan-500/40',
      border: 'border-cyan-500',
      borderDim: 'border-cyan-500/20',
      bg: 'bg-cyan-500',
      bgDim: 'bg-cyan-500/10',
      shadow: 'shadow-cyan-500/20',
      gradientFrom: 'from-cyan-600',
      gradientTo: 'to-cyan-400',
    },
    purple: {
      text: 'text-purple-400',
      textDim: 'text-purple-500/40',
      border: 'border-purple-500',
      borderDim: 'border-purple-500/20',
      bg: 'bg-purple-500',
      bgDim: 'bg-purple-500/10',
      shadow: 'shadow-purple-500/20',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-purple-400',
    },
    blue: {
      text: 'text-blue-400',
      textDim: 'text-blue-500/40',
      border: 'border-blue-500',
      borderDim: 'border-blue-500/20',
      bg: 'bg-blue-500',
      bgDim: 'bg-blue-500/10',
      shadow: 'shadow-blue-500/20',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-400',
    },
    amber: {
      text: 'text-amber-400',
      textDim: 'text-amber-500/40',
      border: 'border-amber-500',
      borderDim: 'border-amber-500/20',
      bg: 'bg-amber-500',
      bgDim: 'bg-amber-500/10',
      shadow: 'shadow-amber-500/20',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-amber-400',
    },
    pink: {
      text: 'text-pink-400',
      textDim: 'text-pink-500/40',
      border: 'border-pink-500',
      borderDim: 'border-pink-500/20',
      bg: 'bg-pink-500',
      bgDim: 'bg-pink-500/10',
      shadow: 'shadow-pink-500/20',
      gradientFrom: 'from-pink-600',
      gradientTo: 'to-pink-400',
    },
    orange: {
      text: 'text-orange-400',
      textDim: 'text-orange-500/40',
      border: 'border-orange-500',
      borderDim: 'border-orange-500/20',
      bg: 'bg-orange-500',
      bgDim: 'bg-orange-500/10',
      shadow: 'shadow-orange-500/20',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-orange-400',
    }
  }

  const theme = themeColors[themeColor] || themeColors.green

  // Simulate system check text
  useEffect(() => {
    const texts = [
      '系统初始化...', 
      '加载模块...', 
      '检查 GPU...', 
      '校准传感器...', 
      '就绪'
    ]
    let i = 0
    const interval = setInterval(() => {
      setSystemText(texts[i])
      i = (i + 1) % texts.length
    }, 2000)
    
    // Trigger "turn on" animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`fixed inset-0 bg-black ${theme.text} font-mono overflow-hidden select-none`}>
      {/* CRT Turn-on Animation Container */}
      <motion.div
        initial={{ scaleY: 0.005, scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleY: isLoaded ? 1 : 0.005, 
          scaleX: isLoaded ? 1 : 0, 
          opacity: 1 
        }}
        transition={{ 
          duration: 0.8, 
          ease: "circOut",
          when: "beforeChildren" 
        }}
        className="relative w-full h-full bg-[#0a0a0a] flex flex-col overflow-hidden"
      >
        {/* Scanlines Effect */}
        <div className="pointer-events-none absolute inset-0 z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        
        {/* Subtle Vignette */}
        <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

        {/* Dynamic Corner Texts */}
        <div className={`absolute top-2 left-2 text-[10px] ${theme.textDim} z-30 animate-pulse`}>
          {systemText}
        </div>
        <div className={`absolute top-2 right-2 text-[10px] ${theme.textDim} z-30`}>
          V.2.0.45 [稳定版]
        </div>
        <div className={`absolute bottom-2 left-2 text-[10px] ${theme.textDim} z-30`}>
          内存: 64GB 正常
        </div>
        <div className={`absolute bottom-2 right-2 text-[10px] ${theme.textDim} z-30 flex items-center gap-2`}>
          <Activity className="w-3 h-3" /> 网络: 已连接
        </div>

        {/* Top Navigation */}
        <header className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className={`${theme.text} flex items-center gap-2 ${theme.bgDim} px-3 py-1 rounded-full border ${theme.borderDim}`}>
              {toolIcon || <Cpu className="w-4 h-4" />}
              {toolName}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className={`flex items-center gap-2 text-xs ${theme.textDim} mb-1`}>
                <Zap className="w-3 h-3" />
                <span>剩余能量</span>
              </div>
              <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${energyLevel}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} relative`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>
            <div className={`text-xl font-bold ${theme.text} font-mono`}>
              {energyLevel}%
            </div>
          </div>
        </header>

        {/* Main Content Area (3 Columns) */}
        <main className="flex-1 flex overflow-hidden relative z-10 p-4 gap-4">
          
          {/* Left: Control Panel */}
          <motion.aside 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-[280px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse`} />
              <span className="text-xs font-bold tracking-wider text-gray-300">参数配置</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {sidebarLeft || (
                <div className="text-gray-500 text-sm text-center mt-10">
                  暂无配置
                </div>
              )}
            </div>
          </motion.aside>

          {/* Center: Canvas Area */}
          <motion.section 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex-1 flex flex-col relative group"
          >
            {/* Glowing Border Container */}
            <div className={`absolute inset-0 rounded-xl border ${theme.borderDim} ${theme.shadow} transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(var(--theme-color-rgb),0.2)] group-hover:${theme.border} pointer-events-none`} />
            
            {/* Corner Accents */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${theme.border} rounded-tl-lg`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${theme.border} rounded-tr-lg`} />
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${theme.border} rounded-bl-lg`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${theme.border} rounded-br-lg`} />

            <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden relative m-[1px]">
               {children || (
                 <div className="w-full h-full flex items-center justify-center text-gray-600">
                   <ScanLine className="w-12 h-12 mb-4 opacity-50" />
                   <p>画布离线</p>
                 </div>
               )}
            </div>
          </motion.section>

          {/* Right: Inspiration/Reference */}
          <motion.aside 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="w-[280px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col overflow-hidden shrink-0"
          >
             <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-300">参考资料</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {sidebarRight || (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-lg border border-white/5 animate-pulse" />
                  ))}
                </div>
              )}
            </div>
          </motion.aside>

        </main>
      </motion.div>
    </div>
  )
}
