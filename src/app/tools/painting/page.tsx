'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ToolLabLayout } from '@/components/ToolLabLayout'
import { Palette, MousePointer2, Image as ImageIcon, Sparkles, Send, Brain, ThumbsUp, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CyberLoading } from '@/components/ui/CyberLoading'
import { generateAIResponse } from '@/lib/aiService'
import { AIResultModal } from '@/components/AIResultModal'
import { LevelUpNotification } from '@/components/LevelUpNotification'
import { calculateXPGain, updateUserProgress, addAttributeXP } from '@/lib/userLogic'
import { XPGainBubble } from '@/components/XPGainBubble'
import { useResourceStore } from '@/lib/resourceStore'
import { HighEnergyToast } from '@/components/HighEnergyToast'

export default function PaintingPage() {
  const { consumePoints } = useResourceStore()
  const [showToast, setShowToast] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number, color: string }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [mentorSuggestion, setMentorSuggestion] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Evaluation & XP State
  const [showResult, setShowResult] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [radarData, setRadarData] = useState<any[]>([])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpMsg, setLevelUpMsg] = useState('')
  const [showXPBubble, setShowXPBubble] = useState(false)
  const [xpBubbleAttribute, setXpBubbleAttribute] = useState<string>('painting')
  const [xpBubbleAmount, setXpBubbleAmount] = useState(0)

  const mockRadarData = [
    { subject: '构图', A: 0, fullMark: 100 },
    { subject: '色彩', A: 0, fullMark: 100 },
    { subject: '创意', A: 0, fullMark: 100 },
    { subject: '细节', A: 0, fullMark: 100 },
    { subject: '意境', A: 0, fullMark: 100 },
  ]
  
  const canvasRef = useRef<HTMLDivElement>(null)

  const styles = [
    { id: 'pixel', name: '像素风格', icon: '👾' },
    { id: 'oil', name: '油画风格', icon: '🎨' },
    { id: 'cyberpunk', name: '赛博朋克', icon: '🌃' }
  ]

  const ratios = [
    { id: '1:1', label: '1:1 方形' },
    { id: '16:9', label: '16:9 宽屏' }
  ]

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isGenerating) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const colors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981'] // Purple, Pink, Blue, Green
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      
      const newRipple = { x, y, id: Date.now(), color: randomColor }
      setRipples(prev => [...prev, newRipple])

      // Clean up ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }
  }

  const startGeneration = async () => {
    if (!prompt.trim()) return

    // Consume points
    const { triggered } = consumePoints(10)
    if (triggered) {
      setShowToast(true)
    }

    setIsGenerating(true)
    setAiResult('')
    setEvaluation('')
    
    try {
      // 1. Generate Main Content
      const result = await generateAIResponse('painting', 'generation', prompt, `风格: ${selectedStyle}, 比例: ${aspectRatio}`)
      setAiResult(result)

      // 2. Generate Mentor Suggestion (Parallel or Sequential)
      generateAIResponse('painting', 'suggestion', `基于用户想要画的内容"${prompt}"，给出一个简短的艺术创作建议（50字以内）。`, '你是一位数字艺术导师。')
        .then(setMentorSuggestion)
        .catch(console.error)

    } catch (error) {
      console.error(error)
      setAiResult('生成失败，请检查网络或 API Key 设置。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEvaluation = async () => {
    if (!aiResult) return
    setIsEvaluating(true)
    try {
      // Request JSON response
      const prompt = `请评价这个 AI 绘画提示词方案的优缺点：\n${aiResult}\n\n请返回纯 JSON 格式，不包含 markdown 标记，格式如下：
      {
        "score": 85,
        "radar": [
          { "subject": "构图", "A": 80, "fullMark": 100 },
          { "subject": "色彩", "A": 90, "fullMark": 100 },
          { "subject": "创意", "A": 85, "fullMark": 100 },
          { "subject": "细节", "A": 75, "fullMark": 100 },
          { "subject": "意境", "A": 88, "fullMark": 100 }
        ],
        "comment": "你的评价内容..."
      }`
      
      const result = await generateAIResponse('painting', 'evaluation', prompt, '你是一位艺术导师。请只返回 JSON。')
      
      // Parse JSON
      let parsedData;
      try {
        const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        console.error("JSON Parse Error", e);
        parsedData = {
          score: 80,
          radar: mockRadarData.map(d => ({ ...d, A: 80 })),
          comment: result
        };
      }

      setAiScore(parsedData.score);
      setRadarData(parsedData.radar);
      setEvaluation(parsedData.comment);

      // XP Calculation
      const gained = calculateXPGain(parsedData.score, false);
      
      // Update Attribute XP (Painting)
      addAttributeXP('painting', gained);
      setXpBubbleAttribute('painting');
      setXpBubbleAmount(gained);
      setShowXPBubble(true);

      // Update Global XP
      const { leveledUp, levelUpMessage } = updateUserProgress(gained);
      setXpGained(gained);

      if (leveledUp && levelUpMessage) {
        setLevelUpMsg(levelUpMessage);
        setShowLevelUp(true);
      }

      setShowResult(true);

    } catch (error) {
      console.error(error)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <ToolLabLayout
      toolName="AI 绘画"
      toolIcon={
        <>
          <Palette className="w-4 h-4" />
          <LevelUpNotification 
            isVisible={showLevelUp} 
            message={levelUpMsg}
            onClose={() => setShowLevelUp(false)}
          />
          <HighEnergyToast 
            isVisible={showToast} 
            onClose={() => setShowToast(false)} 
          />
        </>
      }
      themeColor="purple"
      sidebarLeft={
        <div className="space-y-8">
          {/* Prompt Input */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
               <Brain className="w-3 h-3" /> 创作构思
             </h3>
             <motion.div 
               whileFocus={{ scale: 1.02 }}
               className="relative group"
             >
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="告诉AI你的想法... (例如：一只在雨中漫步的赛博朋克猫)"
                 className="w-full h-32 bg-black/20 border border-purple-500/30 rounded-lg p-3 text-sm text-purple-100 placeholder-purple-500/30 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all resize-none custom-scrollbar"
               />
               <div className="absolute bottom-2 right-2 text-[10px] text-purple-500/50">
                 {prompt.length}/500
               </div>
             </motion.div>
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> 艺术风格
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left group
                    ${selectedStyle === style.id 
                      ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{style.icon}</span>
                  <span className="text-sm font-medium">{style.name}</span>
                  {selectedStyle === style.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ratio Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> 画布比例
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ratios.map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all
                    ${aspectRatio === ratio.id 
                      ? 'bg-purple-500/20 border-purple-500 text-white' 
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={startGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6 rounded-xl text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><CyberLoading text="" /> 生成中...</span>
            ) : (
              <span className="flex items-center gap-2"><Send className="w-5 h-5" /> 开始创作</span>
            )}
          </Button>
        </div>
      }
      sidebarRight={
        <div className="space-y-6">
           {/* AI Mentor Suggestion */}
           <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
               <Lightbulb className="w-12 h-12 text-purple-400" />
             </div>
             <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
               <Brain className="w-3 h-3" /> AI 导师建议
             </h3>
             <div className="text-sm text-purple-100/80 leading-relaxed min-h-[60px]">
               {mentorSuggestion ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   "{mentorSuggestion}"
                 </motion.div>
               ) : (
                 <span className="text-purple-500/40 italic">等待创作输入...</span>
               )}
             </div>
           </div>

           <div className="space-y-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">灵感画廊</h3>
             {[1, 2, 3].map((i) => (
               <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/5 overflow-hidden relative group cursor-pointer hover:border-purple-500/30 transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 z-10">
                   <span className="text-xs text-white font-medium">示例作品 {i}</span>
                 </div>
                 <div className={`w-full h-full bg-gradient-to-br ${
                   i === 1 ? 'from-purple-900 to-blue-900' : 
                   i === 2 ? 'from-yellow-700 to-blue-800' : 'from-red-900 to-orange-800'
                 }`} />
               </div>
             ))}
           </div>
        </div>
      }
    >
      <div 
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden cursor-crosshair group p-8"
      >
        <XPGainBubble 
          isVisible={showXPBubble} 
          onClose={() => setShowXPBubble(false)} 
          attribute={xpBubbleAttribute} 
          amount={xpBubbleAmount} 
        />

        <AIResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          score={aiScore}
          radarData={radarData.length > 0 ? radarData : mockRadarData}
          feedback={evaluation}
          xpGained={xpGained}
        />

        {/* Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Canvas Frame */}
        <motion.div 
          layout
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative bg-black border-2 border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-500
            ${aspectRatio === '1:1' ? 'aspect-square w-full max-w-2xl' : 'aspect-video w-full max-w-4xl'}
            ${isGenerating ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]' : 'hover:border-purple-500/30'}
          `}
        >
          {/* Main Content Area */}
          <div className="flex-1 p-8 relative overflow-y-auto custom-scrollbar z-20 bg-black/50 backdrop-blur-sm">
            {isGenerating ? (
              <div className="h-full flex items-center justify-center">
                <CyberLoading />
              </div>
            ) : aiResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                  <h2 className="text-xl font-bold text-purple-300">生成方案</h2>
                  <span className="text-xs text-purple-500/60 font-mono">ID: {Date.now().toString().slice(-6)}</span>
                </div>
                <div className="prose prose-invert prose-purple max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                </div>
                
                {/* Evaluation Section */}
                {evaluation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <h3 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" /> 导师评价
                    </h3>
                    <p className="text-sm text-green-100/80">{evaluation}</p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors duration-300">
                   <MousePointer2 className="w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  等待指令...
                </h2>
                <p className="text-gray-500 text-sm max-w-md">
                  请在左侧输入你的创意想法，AI 将为你生成详细的绘画方案与提示词。
                </p>
              </div>
            )}
          </div>

          {/* Ripples Effect */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: 600, height: 600, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ 
                  left: ripple.x, 
                  top: ripple.y,
                  borderColor: ripple.color,
                  boxShadow: `0 0 20px ${ripple.color}`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none z-10"
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Actions */}
        {aiResult && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-4"
          >
            <Button 
              onClick={handleEvaluation}
              disabled={isEvaluating}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            >
              {isEvaluating ? '评价中...' : '请求 AI 评价'}
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200">
              应用到画布 (模拟)
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLabLayout>
  )
}
