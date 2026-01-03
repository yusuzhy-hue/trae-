"use client"

import React, { useEffect, useState, useRef, MouseEvent } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  User, Shield, Home, Activity, Zap, Cpu, 
  Palette, Music, Mic, Video, Code, Terminal, 
  Settings, Bell, Search, Menu, Battery, Wifi,
  LogOut, Trophy, Users, Clock, Star, Medal, Bot, X,
  Target, Flame, Crown, Camera, Scan, Loader2
} from "lucide-react"
import { useAuth } from "@/lib/authContext"
import { useResourceStore } from "@/lib/resourceStore"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SurprisePackage } from "@/components/SurprisePackage"
import { ResourceMonitor } from "@/components/ResourceMonitor"

// --- Background Component ---
const DeepSpaceGridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
      {/* Deep Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b] opacity-90" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          transform: 'perspective(1000px) rotateX(10deg) scale(1.5)',
          transformOrigin: 'top center'
        }}
      />

      {/* Floating Glowing Spheres */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen"
      />

      {/* Optional: Subtle Noise Overlay for Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      
      {/* Holographic Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.03) 3px)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  )
}

// --- HUD Components ---
const HudPanel = ({ title, children, className, delay = 0 }: { title?: string, children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className={`relative group ${className}`}
  >
    {/* HUD Corner Accents */}
    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />
    
    <GlassCard className="h-full !bg-black/40 !border-white/10 hover:!border-cyan-500/30 transition-colors p-4 flex flex-col">
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
          <div className="w-1 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <h3 className="text-xs font-mono font-bold text-cyan-100 tracking-widest uppercase">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </GlassCard>
  </motion.div>
)

// --- AI Assistant Component ---
const AIAssistant = ({ user }: { user: any }) => {
  const [showBubble, setShowBubble] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Delay appearance slightly
    const timer = setTimeout(() => {
      const userName = user?.name || '学员'
      // Mock logic for "improvement"
      const improvements = ['编程能力', '逻辑思维', '创造力', '算法效率']
      const randomImp = improvements[Math.floor(Math.random() * improvements.length)]
      const randomPercent = Math.floor(Math.random() * 10) + 1
      
      setMessage(`欢迎回来，${userName}！今天你的${randomImp}提升了 ${randomPercent}%，要继续挑战吗？`)
      setShowBubble(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user])

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="relative bg-black/80 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-2xl rounded-br-none shadow-[0_0_30px_rgba(6,182,212,0.3)] max-w-[250px] pointer-events-auto"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -left-2 p-1 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="text-sm text-cyan-100 leading-relaxed font-mono">
              <span className="text-cyan-400 font-bold">AI ASSISTANT:</span><br/>
              {message}
            </div>
            {/* Typing cursor effect decoration */}
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-cyan-400/50 ml-1 align-middle"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowBubble(!showBubble)}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/20 hover:border-cyan-400 transition-all cursor-pointer pointer-events-auto"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-20" />
        <Bot className="w-7 h-7 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
        
        {/* Status Dot */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
      </motion.button>
    </div>
  )
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const { currentPoints, consumePoints } = useResourceStore()
  const [activeTheme, setActiveTheme] = useState<'cyan' | 'purple' | 'green'>('cyan')
  const [isCurtainOpen, setIsCurtainOpen] = useState(false)
  const [selectedMedal, setSelectedMedal] = useState<string | null>(null)
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([])
  const [showRadarDetails, setShowRadarDetails] = useState(false)
  
  // 3D Avatar Generation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState<'idle' | 'uploading' | 'scanning' | 'modeling' | 'rendering'>('idle')
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 3D Tilt State
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [-15, 15])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediately create URL
    const objectUrl = URL.createObjectURL(file)

    // Start the simulation sequence
    setIsGenerating(true)
    setGenerationStep('uploading')

    // 1. Uploading (1s)
    setTimeout(() => {
      setGenerationStep('scanning')
      
      // 2. Scanning (2s)
      setTimeout(() => {
        setGenerationStep('modeling')
        
        // 3. Modeling (2s)
        setTimeout(() => {
          setGenerationStep('rendering')
          
          // 4. Rendering (1.5s) -> Complete
          setTimeout(() => {
            setCustomAvatar(objectUrl)
            setIsGenerating(false)
            setGenerationStep('idle')
          }, 1500)
        }, 2000)
      }, 2000)
    }, 1000)
  }

  // Handle global click for ripples
  const handleGlobalClick = (e: React.MouseEvent) => {
    const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() }
    setRipples(prev => [...prev, newRipple])
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 1000)
  }

  const [medals, setMedals] = useState([
    { id: 'speed', name: 'SPEEDSTER', icon: Zap, color: 'text-yellow-400', glow: 'shadow-yellow-400/50', border: 'border-yellow-400' },
    { id: 'creative', name: 'CREATOR', icon: Palette, color: 'text-pink-400', glow: 'shadow-pink-400/50', border: 'border-pink-400' },
    { id: 'guard', name: 'GUARDIAN', icon: Shield, color: 'text-blue-400', glow: 'shadow-blue-400/50', border: 'border-blue-400' },
  ])

  // Sync medals with inventory
  useEffect(() => {
    const inventory = localStorage.getItem("my_inventory")
    if (inventory) {
      try {
        const items = JSON.parse(inventory)
        const newMedals = items.map((item: any) => ({
          id: `item-${item.id}`,
          name: item.name,
          icon: Medal,
          color: 'text-purple-400',
          glow: 'shadow-purple-400/50',
          border: 'border-purple-400'
        }))
        
        // Merge with defaults, avoiding duplicates (simple check by name)
        setMedals(prev => {
          const existingNames = new Set(prev.map(m => m.name))
          const uniqueNew = newMedals.filter((m: any) => !existingNames.has(m.name))
          return [...prev, ...uniqueNew]
        })
      } catch (e) {
        console.error("Failed to parse inventory", e)
      }
    }
  }, [isCurtainOpen]) // Refresh when curtain opens
  
  // Mock Data
  const radarData = [
    { subject: '逻辑', A: 80, fullMark: 100 },
    { subject: '创造', A: 65, fullMark: 100 },
    { subject: '感知', A: 90, fullMark: 100 },
    { subject: '协作', A: 75, fullMark: 100 },
    { subject: '执行', A: 85, fullMark: 100 },
  ]

  // Detect "Recent Activity" to change theme (Mock logic)
  useEffect(() => {
    // In real app, check user.lastActivity or similar
    // For demo, we default to cyan
  }, [])

  const tools = [
    { name: '绘画', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/10', href: '/tools/painting' },
    { name: '音乐', icon: Music, color: 'text-violet-400', bg: 'bg-violet-500/10', href: '/tools/music' },
    { name: '编程', icon: Code, color: 'text-green-400', bg: 'bg-green-500/10', href: '/tools/coding' },
    { name: '视频', icon: Video, color: 'text-orange-400', bg: 'bg-orange-500/10', href: '/tools/video' },
  ]

  return (
    <div 
      onClick={handleGlobalClick}
      className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-cyan-500/30 overflow-hidden cursor-crosshair"
    >
      <DeepSpaceGridBackground />
      
      {/* Click Ripple Effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ left: ripple.x, top: ripple.y }}
            className="fixed w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-400/20 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
          />
        ))}
      </AnimatePresence>

      {/* Main Grid Container */}
      <div className="relative z-10 grid h-screen w-full grid-cols-1 md:grid-cols-12 grid-rows-[auto_1fr_auto] gap-4 p-4 md:p-6 max-w-[1920px] mx-auto">
        
        {/* --- Top Bar --- */}
        <header className="col-span-1 md:col-span-12 flex items-center justify-between bg-black/20 backdrop-blur-md rounded-full px-6 py-2 border border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                AI <span className="text-cyan-400">NEXUS</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <ResourceMonitor />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
              </button>
              <Link href="/profile">
                <Avatar className="w-8 h-8 border border-white/20 cursor-pointer hover:border-cyan-400 transition-colors">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-cyan-900 text-cyan-200">{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        {/* --- Left HUD (Status Area) --- */}
        <aside className="hidden md:flex col-span-3 md:row-start-2 flex-col gap-6 justify-center">
          {/* Card 1: AI Total Points */}
          <HudPanel delay={0.1} className="flex-1 max-h-[160px] cursor-pointer group/points">
            <div 
              onClick={() => consumePoints(100)}
              className="flex flex-col items-center justify-center h-full gap-2 relative overflow-hidden active:scale-95 transition-transform"
            >
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl" />
               <Star className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
               <div className="text-3xl font-bold text-white font-mono tracking-wider">{currentPoints}</div>
               <div className="text-xs text-cyan-400/60 uppercase tracking-widest">Energy Points</div>
               
               {/* Click Hint */}
               <div className="absolute bottom-2 opacity-0 group-hover/points:opacity-100 transition-opacity text-[10px] text-yellow-400/80 bg-black/60 px-2 py-0.5 rounded border border-yellow-400/30">
                 CLICK TO CONSUME -100
               </div>
            </div>
          </HudPanel>

          {/* Card 2: Current Level */}
          <HudPanel delay={0.2} className="flex-1 max-h-[160px]">
            <div className="flex flex-col items-center justify-center h-full gap-2 relative overflow-hidden">
               <div className="absolute -left-4 -top-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl" />
               <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
               <div className="text-lg font-bold text-cyan-200 font-mono tracking-wider">{user?.name || 'TRAINEE'}</div>
               <div className="text-2xl font-bold text-white font-mono tracking-wider">Lv. {user?.grade || '1'}</div>
               <div className="text-xs text-cyan-400/60 uppercase tracking-widest">Current Level</div>
            </div>
          </HudPanel>

          {/* Card 3: Ability Radar Chart */}
          <HudPanel delay={0.3} className="flex-1 max-h-[160px] overflow-visible z-20">
             <div 
               className="relative w-full h-full flex flex-col items-center justify-center group"
               onMouseEnter={() => setShowRadarDetails(true)}
               onMouseLeave={() => setShowRadarDetails(false)}
             >
                <div className="text-xs text-cyan-400/60 uppercase tracking-widest absolute top-2 left-4">ABILITY ANALYSIS</div>
                <div className="w-full h-full p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Radar name="Ability" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Side Popup Details */}
                <AnimatePresence>
                  {showRadarDetails && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      className="absolute left-full top-0 ml-4 w-64 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.2)] z-50 pointer-events-none"
                    >
                      <h4 className="text-cyan-400 font-mono text-sm mb-3 border-b border-white/10 pb-2">DETAILED SCAN</h4>
                      <div className="space-y-2">
                        {radarData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">{item.subject}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.A}%` }}
                                  className="h-full bg-cyan-400"
                                />
                              </div>
                              <span className="text-white font-mono">{item.A}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </HudPanel>

          {/* Card 4: Equipment / Medals - Interactive Trigger */}
          <HudPanel delay={0.4} className="flex-1 max-h-[160px] cursor-pointer">
            <div 
              onClick={() => setIsCurtainOpen(!isCurtainOpen)}
              className={`flex flex-col items-center justify-center h-full gap-2 relative overflow-hidden transition-all duration-500 ${isCurtainOpen ? 'bg-cyan-500/10' : ''}`}
            >
               <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/10 transition-opacity duration-500 ${isCurtainOpen ? 'opacity-100' : 'opacity-0'}`} />
               <Medal className={`w-8 h-8 transition-all duration-500 ${isCurtainOpen ? 'text-white scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]'}`} />
               <div className="text-xl font-bold text-white font-mono tracking-wider">ASSETS</div>
               <div className="text-xs text-cyan-400/60 uppercase tracking-widest">
                 {isCurtainOpen ? 'CLOSE' : 'OPEN'}
               </div>
            </div>
          </HudPanel>
        </aside>

        {/* --- Center Stage (Avatar) --- */}
        <main className="col-span-1 md:col-span-6 md:row-start-2 flex flex-col items-center justify-center relative min-h-[400px] z-10">
          
          {/* Holographic Base with Reflection */}
          <div className="absolute bottom-[15%] w-[300px] h-[80px] pointer-events-none z-0">
             {/* The Base Plate */}
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full blur-md" />
             {/* The Reflection/Glow */}
             <div className="absolute -bottom-4 inset-x-0 h-[40px] bg-cyan-400/20 blur-xl rounded-[100%]" />
             {/* Rotating Base Rings */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-10 border border-dashed border-cyan-500/30 rounded-full opacity-50"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4 border border-dotted border-cyan-400/40 rounded-full"
             />
          </div>

          {/* Holographic Curtain (Behind Avatar) */}
          <AnimatePresence>
            {isCurtainOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scaleY: 0 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 50, scaleY: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ transformOrigin: 'bottom' }}
                className="absolute inset-x-8 bottom-[20%] top-[10%] z-10 bg-gradient-to-t from-cyan-900/40 via-black/20 to-transparent backdrop-blur-[2px] border-x border-cyan-500/20 rounded-t-3xl overflow-hidden flex flex-col items-center p-6"
              >
                 {/* Curtain Grid Lines */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
                 
                 <h3 className="relative text-cyan-400 font-mono tracking-[0.5em] mb-8 text-lg border-b border-cyan-500/30 pb-2">DIGITAL ASSETS</h3>
                 
                 {medals.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                     <div className="relative">
                       <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                       <Bot className="w-16 h-16 text-cyan-500/50 relative z-10" />
                     </div>
                     <p className="text-cyan-200/80 font-mono text-sm tracking-widest max-w-[200px]">
                       暂无资产，快去实验室创作获取吧！
                     </p>
                     <Link href="/tools/painting">
                       <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-200">
                         前往实验室
                       </Button>
                     </Link>
                   </div>
                 ) : (
                   <div className="relative grid grid-cols-3 gap-6 w-full max-w-sm">
                      {medals.map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setSelectedMedal(m.id === selectedMedal ? null : m.id)}
                          className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-500 ${selectedMedal === m.id ? `bg-white/10 ${m.border} shadow-[0_0_20px_rgba(255,255,255,0.1)]` : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/20'}`}
                        >
                           <div className={`relative p-3 rounded-full bg-black/40 border border-white/10 transition-all duration-500 ${selectedMedal === m.id ? m.glow : ''}`}>
                              <m.icon className={`w-6 h-6 transition-all duration-500 ${selectedMedal === m.id ? m.color : 'text-gray-500 group-hover:text-gray-300'}`} />
                           </div>
                           <div className={`text-[10px] font-mono tracking-wider transition-colors duration-500 ${selectedMedal === m.id ? 'text-white' : 'text-gray-500'}`}>
                             {m.name}
                           </div>
                           
                           {/* Selection Indicator */}
                           {selectedMedal === m.id && (
                             <motion.div 
                               layoutId="medal-indicator"
                               className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" 
                             />
                           )}
                        </button>
                      ))}
                   </div>
                 )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Avatar Character */}
          <motion.div
            animate={{ y: [-15, 5, -15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 flex flex-col items-center"
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* The Avatar Image/Model Container - Transparent */}
            <motion.div 
              style={{ rotateX: customAvatar ? rotateX : 0, rotateY: customAvatar ? rotateY : 0, perspective: 1000 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative w-56 h-72 md:w-72 md:h-96 flex items-center justify-center group cursor-pointer transition-all duration-500 ${
              selectedMedal 
                ? medals.find(m => m.id === selectedMedal)?.glow + ' drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                : ''
            }`}>
               
               {/* Upload Trigger Button */}
               <div className="absolute -right-12 top-0 z-50">
                 <button
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] group/btn"
                   title="Upload Photo for 3D Generation"
                 >
                   <Camera className="w-5 h-5" />
                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                     GENERATE 3D AVATAR
                   </span>
                 </button>
               </div>

               {/* Effect Overlay based on selection */}
               {selectedMedal === 'speed' && (
                 <div className="absolute inset-0 z-0 animate-pulse">
                   <div className="absolute -inset-4 border-2 border-yellow-400/30 rounded-3xl blur-md" />
                   <Zap className="absolute -top-6 -right-6 w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_yellow] animate-bounce" />
                 </div>
               )}
               {selectedMedal === 'creative' && (
                 <div className="absolute inset-0 z-0">
                   <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-3xl mix-blend-overlay" />
                   <Palette className="absolute -bottom-4 -left-4 w-10 h-10 text-pink-400 drop-shadow-[0_0_10px_pink] animate-pulse" />
                 </div>
               )}
               {selectedMedal === 'guard' && (
                 <div className="absolute inset-0 z-0">
                   <div className="absolute -inset-2 border border-blue-500/50 rounded-3xl shadow-[0_0_20px_blue] opacity-50" />
                   <Shield className="absolute -top-4 -left-4 w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_blue]" />
                 </div>
               )}

               {/* Generation Overlays */}
               <AnimatePresence>
                 {isGenerating && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-cyan-500/50 overflow-hidden"
                   >
                     {/* Scanning Grid */}
                     {generationStep === 'scanning' && (
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:20px_20px]">
                         <motion.div 
                           animate={{ top: ['0%', '100%', '0%'] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]" 
                         />
                       </div>
                     )}
                     
                     {/* Modeling Wireframe */}
                     {generationStep === 'modeling' && (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full h-full border-4 border-cyan-500/30 rounded-3xl relative">
                           <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-cyan-400 animate-[spin_4s_linear_infinite] opacity-50" />
                           <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-30">
                             {Array.from({ length: 16 }).map((_, i) => (
                               <motion.div 
                                 key={i}
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: [0, 1, 0] }}
                                 transition={{ delay: i * 0.05, duration: 1, repeat: Infinity }}
                                 className="bg-cyan-400"
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Status Text */}
                     <div className="relative z-50 flex flex-col items-center gap-4">
                       <div className="relative">
                         <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                         <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                       </div>
                       <div className="font-mono text-cyan-400 text-sm tracking-widest uppercase">
                         {generationStep === 'uploading' && 'UPLOADING DATA...'}
                         {generationStep === 'scanning' && 'ANALYZING FEATURES...'}
                         {generationStep === 'modeling' && 'CONSTRUCTING 3D MESH...'}
                         {generationStep === 'rendering' && 'RENDERING TEXTURES...'}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Avatar Icon / Image */}
                {customAvatar ? (
                  <motion.div className="relative z-10 w-full h-full">
                    {/* Holographic Wireframe Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30 pointer-events-none z-20" />
                    
                    {/* 3D Model Placeholder Glow */}
                    <div className="absolute inset-0 bg-cyan-500/10 blur-xl z-0" />

                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={customAvatar} 
                      alt="Custom Avatar" 
                      className="relative z-10 w-full h-full object-cover rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" 
                      style={{
                        filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 0 10px rgba(34,211,238,0.5))'
                      }}
                    />
                  </motion.div>
                ) : user?.avatar ? (
                 <img src={user.avatar} alt="Avatar" className="relative z-10 w-full h-full object-cover rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
               ) : (
                 <User className="relative z-10 w-32 h-32 text-cyan-200/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
               )}

               {/* Scanning Line Effect (Vertical) */}
               {!isGenerating && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,1)] z-30 pointer-events-none"
                  />
                )}
            </motion.div>

            {/* Floating Label */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-6 py-1.5 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-300 text-sm font-mono tracking-[0.3em] backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              {isGenerating ? 'PROCESSING...' : (selectedMedal ? medals.find(m => m.id === selectedMedal)?.name + ' EQUIPPED' : 'READY FOR COMMAND')}
            </motion.div>
          </motion.div>
        </main>

        {/* --- Right HUD (Task Center) --- */}
        <aside className="hidden md:flex col-span-3 md:row-start-2 flex-col gap-4">
          <HudPanel title="TODAY'S TASKS" className="h-full" delay={0.4}>
            <div className="space-y-4 overflow-y-auto h-full pr-2 custom-scrollbar">
              {[
                { title: "每日签到", progress: 100, color: "text-green-400" },
                { title: "创建AI作品", progress: 60, color: "text-cyan-400" },
                { title: "社区互动", progress: 30, color: "text-purple-400" },
                { title: "浏览优秀作品", progress: 0, color: "text-gray-400" },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{task.title}</span>
                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyan-400/70 transition-colors">PROGRESS: {task.progress}%</span>
                  </div>
                  
                  {/* Glowing Progress Circle */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                      <circle 
                        cx="24" cy="24" r="18" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="transparent" 
                        strokeDasharray={113} 
                        strokeDashoffset={113 - (113 * task.progress / 100)}
                        strokeLinecap="round"
                        className={`${task.color} drop-shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-out`} 
                      />
                    </svg>
                    {task.progress === 100 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,1)]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </HudPanel>
        </aside>

        {/* --- Bottom Dock (Quick Access) --- */}
        <footer className="col-span-1 md:col-span-12 md:row-start-3 flex items-end justify-center pb-2 md:pb-6">
           <GlassCard className="flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-full border-white/10 bg-black/60 backdrop-blur-xl">
             {[
               { icon: Palette, label: '绘画实验室', href: '/tools/painting', color: 'text-pink-400' },
               { icon: Code, label: '编程中心', href: '/tools/coding', color: 'text-green-400' },
               { icon: Trophy, label: '赛事大厅', href: '/competitions', color: 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' },
               { icon: Users, label: '社区', href: '/community', color: 'text-blue-400' },
               { icon: User, label: '个人中心', href: '/profile', color: 'text-cyan-400' },
             ].map((item, i) => (
               <Link key={i} href={item.href}>
                 <button 
                   className={`relative p-3 md:p-4 rounded-full transition-all group hover:bg-white/10 ${item.color}`}
                 >
                   <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                   {/* Tooltip */}
                   <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                     {item.label}
                   </span>
                   {/* Active Dot (Optional, can be logic based) */}
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               </Link>
             ))}
             
             <div className="w-[1px] h-8 bg-white/20 mx-2" />
             
             <button onClick={logout} className="relative p-3 md:p-4 rounded-full text-red-400 hover:bg-red-500/10 transition-all group">
               <LogOut className="w-5 h-5 md:w-6 md:h-6" />
               <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                 退出
               </span>
             </button>
           </GlassCard>
        </footer>

        {/* AI Assistant Floating Icon */}
        <AIAssistant user={user} />
        <SurprisePackage />

      </div>
    </div>
  )
}
