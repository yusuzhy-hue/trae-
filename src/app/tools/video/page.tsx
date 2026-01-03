'use client'

import React, { useState } from 'react'
import { ToolLabLayout } from '@/components/ToolLabLayout'
import { Video, Activity, Sparkles, Clapperboard, Film, Aperture, Video as VideoIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { generateAIResponse } from '@/lib/aiService'
import { CyberLoading } from '@/components/ui/CyberLoading'
import { AIResultModal } from '@/components/AIResultModal'
import { LevelUpNotification } from '@/components/LevelUpNotification'
import { calculateXPGain, updateUserProgress, addAttributeXP } from '@/lib/userLogic'
import { XPGainBubble } from '@/components/XPGainBubble'
import { useResourceStore } from '@/lib/resourceStore'
import { HighEnergyToast } from '@/components/HighEnergyToast'

export default function VideoPage() {
  const { consumePoints } = useResourceStore()
  const [showToast, setShowToast] = useState(false)
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

  // Mock data for initial render
  const mockRadarData = [
    { subject: '分镜', A: 0, fullMark: 100 },
    { subject: '构图', A: 0, fullMark: 100 },
    { subject: '叙事', A: 0, fullMark: 100 },
    { subject: '光影', A: 0, fullMark: 100 },
    { subject: '创意', A: 0, fullMark: 100 },
  ]

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
    
    try {
      // 1. Generate Main Content
      const result = await generateAIResponse('video', 'generation', prompt, 'Style: Cinematic')
      setAiResult(result)

      // 2. Generate Mentor Suggestion
      generateAIResponse('video', 'suggestion', `User wants video about "${prompt}"`, 'User is a filmmaker.')
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
      const promptText = `
        请评价这个视频脚本方案，并返回严格的JSON格式数据，不要包含任何其他文本。
        JSON格式要求：
        {
          "score": 0-100的整数,
          "radar": [
            {"subject": "分镜", "A": 0-100, "fullMark": 100},
            {"subject": "构图", "A": 0-100, "fullMark": 100},
            {"subject": "叙事", "A": 0-100, "fullMark": 100},
            {"subject": "光影", "A": 0-100, "fullMark": 100},
            {"subject": "创意", "A": 0-100, "fullMark": 100}
          ],
          "comment": "一段详细的影评"
        }
        
        脚本内容：
        ${aiResult}
      `;

      const resultString = await generateAIResponse('video', 'evaluation', promptText, 'You are a film critic. Return ONLY JSON.');
      
      let parsedData;
      try {
        const cleanString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        parsedData = {
          score: 85,
          radar: [
            { subject: '分镜', A: 85, fullMark: 100 },
            { subject: '构图', A: 90, fullMark: 100 },
            { subject: '叙事', A: 80, fullMark: 100 },
            { subject: '光影', A: 88, fullMark: 100 },
            { subject: '创意', A: 82, fullMark: 100 },
          ],
          comment: resultString || "镜头语言运用得当，极具视觉冲击力。"
        };
      }

      setEvaluation(parsedData.comment)
      setAiScore(parsedData.score)
      setRadarData(parsedData.radar)

      // XP Calculation
      const gained = calculateXPGain(parsedData.score, false);
      
      // Update Attribute XP
      addAttributeXP('video', gained);
      setXpBubbleAttribute('video');
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

  return (
    <ToolLabLayout
      toolName="AI 视频实验室"
      toolIcon={
        <>
          <VideoIcon className="w-4 h-4" />
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
      themeColor="orange"
      sidebarLeft={
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Clapperboard className="w-3 h-3" /> 画面描述
            </h3>
            <Textarea 
              placeholder="描述镜头语言、场景和动作..." 
              className="bg-black/40 border-orange-500/30 focus:border-orange-400 text-orange-100 min-h-[150px] resize-none p-3 text-sm rounded-lg backdrop-blur-sm"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/50 relative overflow-hidden group"
              onClick={startGeneration}
              disabled={isGenerating}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? '正在编写脚本...' : '生成分镜'}
              </span>
            </Button>
          </div>
          
          <div className="h-px bg-orange-500/20" />

          <div className="space-y-4">
             <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
               <Aperture className="w-3 h-3" /> 风格预设
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {['电影感', '二次元', '记录片', '赛博朋克'].map(style => (
                 <button key={style} className="p-2 text-xs border border-orange-500/20 rounded hover:bg-orange-500/10 text-orange-200 transition-colors">
                   {style}
                 </button>
               ))}
             </div>
          </div>
        </div>
      }
      sidebarRight={
        <div className="space-y-6">
           <div className="space-y-2">
             <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
               <Film className="w-3 h-3" /> 导演建议
             </h3>
             <AnimatePresence mode="wait">
               {mentorSuggestion ? (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-4 rounded-lg bg-orange-900/20 border border-orange-500/30 text-orange-100 text-sm leading-relaxed border-l-4 border-l-orange-500"
                 >
                   {mentorSuggestion}
                 </motion.div>
               ) : (
                 <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-gray-500 text-xs italic text-center">
                   等待生成建议...
                 </div>
               )}
             </AnimatePresence>
           </div>
        </div>
      }
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center p-8">
        <XPGainBubble 
          isVisible={showXPBubble} 
          onClose={() => setShowXPBubble(false)} 
          attribute={xpBubbleAttribute} 
          amount={xpBubbleAmount} 
        />
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CyberLoading text="正在渲染分镜..." />
            </motion.div>
          ) : aiResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 w-full max-w-4xl h-full flex flex-col"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-xl p-8 overflow-y-auto custom-scrollbar">
                <div className="prose prose-invert prose-orange max-w-none">
                  <div className="whitespace-pre-wrap text-orange-50 font-mono leading-relaxed">
                    {aiResult}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  variant="outline"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                >
                  {isEvaluating ? <Activity className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
                  {isEvaluating ? '影评人分析中...' : '请求导演评价'}
                </Button>
              </div>
              
              <AnimatePresence>
                {/* Removed original simple evaluation popup in favor of AIResultModal */}
              </AnimatePresence>

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
            <div className="text-center space-y-4 opacity-50">
              <VideoIcon className="w-24 h-24 mx-auto text-orange-500/20" />
              <h2 className="text-3xl font-bold text-orange-500/50">AI 视频实验室</h2>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ToolLabLayout>
  )
}
