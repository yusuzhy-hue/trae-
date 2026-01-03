'use client'

import React, { useState, useEffect } from 'react'
import { ToolLabLayout } from '@/components/ToolLabLayout'
import { Music, Activity, Play, Pause, Sliders, AudioLines, Heart, Smile, Zap, Sparkles, Send, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { generateAIResponse } from '@/lib/aiService'
import { CyberLoading } from '@/components/ui/CyberLoading'
import { AIResultModal } from '@/components/AIResultModal'
import { LevelUpNotification } from '@/components/LevelUpNotification'
import { calculateXPGain, updateUserProgress, addAttributeXP } from '@/lib/userLogic'
import { XPGainBubble } from '@/components/XPGainBubble'
import { cn } from '@/lib/utils'
import { useResourceStore } from '@/lib/resourceStore'
import { HighEnergyToast } from '@/components/HighEnergyToast'

export default function MusicPage() {
  const { consumePoints } = useResourceStore()
  const [showToast, setShowToast] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState([120])
  const [selectedMood, setSelectedMood] = useState('happy')
  const [spectrumData, setSpectrumData] = useState<number[]>(new Array(32).fill(10))
  
  // AI State
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState('')
  const [mentorSuggestion, setMentorSuggestion] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  
  // Evaluation State
  const [aiScore, setAiScore] = useState(0)
  const [radarData, setRadarData] = useState<any[]>([])
  
  // Level Up Notification
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpMsg, setLevelUpMsg] = useState('')

  // XP Bubble
  const [showXPBubble, setShowXPBubble] = useState(false)
  const [xpBubbleAttribute, setXpBubbleAttribute] = useState('')
  const [xpBubbleAmount, setXpBubbleAmount] = useState(0)

  const moods = [
    { id: 'sad', name: '忧伤', icon: <Heart className="w-4 h-4" /> },
    { id: 'happy', name: '欢快', icon: <Smile className="w-4 h-4" /> },
    { id: 'exciting', name: '激昂', icon: <Zap className="w-4 h-4" /> }
  ]

  // Simulate click sound
  const playClickSound = () => {
    // console.log('🎵 Electronic Click Sound')
  }

  // Animate spectrum
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying || isGenerating) {
      interval = setInterval(() => {
        setSpectrumData(prev => prev.map(() => Math.random() * 100))
      }, 100)
    } else {
      setSpectrumData(new Array(32).fill(10))
    }
    return () => clearInterval(interval)
  }, [isPlaying, isGenerating])

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
    setMentorSuggestion('')
    setIsPlaying(true) // Start visualizer
    
    try {
      // 1. Generate Main Content
      const result = await generateAIResponse('music', 'generation', prompt, `Mood: ${selectedMood}, BPM: ${bpm[0]}`)
      setAiResult(result)

      // 2. Generate Mentor Suggestion
      generateAIResponse('music', 'suggestion', `User wants music about "${prompt}"`, 'User is a beginner producer.')
        .then(setMentorSuggestion)
        .catch(console.error)

    } catch (error) {
      console.error(error)
      setAiResult('生成失败，请检查网络或 API Key 设置。')
    } finally {
      setIsGenerating(false)
      setIsPlaying(false)
    }
  }

  const handleEvaluation = async () => {
    if (!aiResult) return
    setIsEvaluating(true)
    try {
      const promptText = `
        请评价这个音乐制作方案，并返回严格的JSON格式数据，不要包含任何其他文本（如markdown代码块标记）。
        JSON格式要求：
        {
          "score": 0-100的整数,
          "radar": [
            {"subject": "创意", "A": 0-100, "fullMark": 100},
            {"subject": "技巧", "A": 0-100, "fullMark": 100},
            {"subject": "完成度", "A": 0-100, "fullMark": 100},
            {"subject": "情感", "A": 0-100, "fullMark": 100},
            {"subject": "混音", "A": 0-100, "fullMark": 100}
          ],
          "comment": "一段详细的评语"
        }
        
        方案内容：
        ${aiResult}
      `;

      const resultString = await generateAIResponse('music', 'evaluation', promptText, 'You are a music critic. Return ONLY JSON.');
      
      // Parse JSON safely
      let parsedData;
      try {
        // Remove markdown code blocks if present
        const cleanString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        // Fallback mock data
        parsedData = {
          score: 85,
          radar: [
            { subject: '创意', A: 85, fullMark: 100 },
            { subject: '技巧', A: 80, fullMark: 100 },
            { subject: '完成度', A: 90, fullMark: 100 },
            { subject: '情感', A: 88, fullMark: 100 },
            { subject: '混音', A: 75, fullMark: 100 },
          ],
          comment: resultString || "评价解析失败，但作品依然出色。"
        };
      }

      setEvaluation(parsedData.comment);
      setAiScore(parsedData.score);
      setRadarData(parsedData.radar);
      
      // Calculate XP
      const gained = calculateXPGain(parsedData.score, false); 
      
      // Update Attribute XP
      addAttributeXP('music', gained);
      setXpBubbleAttribute('music');
      setXpBubbleAmount(gained);
      setShowXPBubble(true);

      // Update Global XP
      const { leveledUp, levelUpMessage } = updateUserProgress(gained); // Global only
      setXpGained(gained);

      if (leveledUp && levelUpMessage) {
        setLevelUpMsg(levelUpMessage);
        setShowLevelUp(true);
      }

      setShowResult(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsEvaluating(false)
    }
  }

  // Mock data for the result modal
  const mockRadarData = [
    { subject: '创意', A: 85, fullMark: 100 },
    { subject: '技巧', A: 90, fullMark: 100 },
    { subject: '完成度', A: 78, fullMark: 100 },
    { subject: '情感', A: 92, fullMark: 100 },
    { subject: '混音', A: 75, fullMark: 100 },
  ]

  return (
    <ToolLabLayout
      toolName="AI 音乐实验室"
      toolIcon={
        <>
          <Music className="w-4 h-4" />
          <LevelUpNotification
             isVisible={showLevelUp}
             onClose={() => setShowLevelUp(false)}
             message={levelUpMsg}
           />
           <HighEnergyToast 
             isVisible={showToast} 
             onClose={() => setShowToast(false)} 
           />
        </>
      }
      themeColor="cyan"
      sidebarLeft={
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Mic className="w-3 h-3" /> 音乐描述
            </h3>
            <div className="relative group">
              <Textarea 
                placeholder="描述你想要的音乐..." 
                className="bg-black/40 border-cyan-500/30 focus:border-cyan-400 text-cyan-100 min-h-[100px] resize-none p-3 text-sm rounded-lg backdrop-blur-sm transition-all group-hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              </div>
            </div>
            <Button 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] relative overflow-hidden group"
              onClick={startGeneration}
              disabled={isGenerating}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'AI 编曲中...' : '开始创作'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </div>

          <div className="h-px bg-cyan-500/20" />

          {/* Mood Regulator */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3 h-3" /> 情感调节器
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => {
                    playClickSound()
                    setSelectedMood(mood.id)
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium group
                    ${selectedMood === mood.id 
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {mood.icon}
                    {mood.name}
                  </span>
                  {selectedMood === mood.id && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Beat Control (BPM) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3 h-3" /> 节拍控制
              </h3>
              <span className="text-xs text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/30">
                {bpm[0]} BPM
              </span>
            </div>
            <div className="px-2">
              <Slider
                defaultValue={[120]}
                max={200}
                min={60}
                step={1}
                value={bpm}
                onValueChange={setBpm}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      }
      sidebarRight={
        <div className="space-y-6 h-full flex flex-col">
           {/* AI Mentor Suggestion */}
           <div className="space-y-2">
             <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
               <AudioLines className="w-3 h-3" /> AI 制作人建议
             </h3>
             <AnimatePresence mode="wait">
               {mentorSuggestion ? (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30 text-cyan-100 text-sm leading-relaxed relative overflow-hidden"
                 >
                   <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                   {mentorSuggestion}
                 </motion.div>
               ) : (
                 <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-gray-500 text-xs italic text-center">
                   等待生成建议...
                 </div>
               )}
             </AnimatePresence>
           </div>

           {/* History / Inspiration (Simplified) */}
           <div className="flex-1 overflow-hidden flex flex-col">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">历史记录</h3>
             <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer text-xs text-gray-400 transition-colors border border-transparent hover:border-cyan-500/20">
                   示例音乐 #{i}
                 </div>
               ))}
             </div>
           </div>
        </div>
      }
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden">
        <XPGainBubble 
          isVisible={showXPBubble} 
          onClose={() => setShowXPBubble(false)} 
          attribute={xpBubbleAttribute} 
          amount={xpBubbleAmount} 
        />
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CyberLoading text="AI 正在编曲..." />
            </motion.div>
          ) : aiResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 w-full max-w-3xl h-[70%] flex flex-col"
            >
              {/* Result Card */}
              <div className="flex-1 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                <div className="prose prose-invert prose-cyan max-w-none">
                  <div className="whitespace-pre-wrap text-cyan-50 font-mono leading-relaxed">
                    {aiResult}
                  </div>
                </div>
              </div>

              {/* Evaluation Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                >
                  {isEvaluating ? <Activity className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
                  {isEvaluating ? '正在分析...' : '请求 AI 乐评'}
                </Button>
              </div>

              {/* AI Result Modal */}
              <AIResultModal
                isOpen={showResult}
                onClose={() => setShowResult(false)}
                score={aiScore}
                radarData={radarData.length > 0 ? radarData : mockRadarData}
                feedback={evaluation}
                xpGained={xpGained}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 flex flex-col items-center w-full"
            >
              {/* Spectrum Analyzer (Keep as background/idle) */}
              <div className="w-full max-w-2xl h-48 flex items-end justify-center gap-1 px-8 mb-8">
                {spectrumData.map((height, index) => (
                  <motion.div
                    key={index}
                    animate={{ height: `${Math.max(5, height)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex-1 bg-cyan-500/80 rounded-t shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    style={{ opacity: 0.3 + (height / 150) }}
                  />
                ))}
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-cyan-500 tracking-tight">AI 音乐实验室</h2>
                <p className="text-cyan-500/60 max-w-md mx-auto">
                  输入描述，调整参数，让 AI 为你谱写未来的旋律。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
      </div>
    </ToolLabLayout>
  )
}
