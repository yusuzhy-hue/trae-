'use client'

import React, { useState } from 'react'
import { ToolLabLayout } from '@/components/ToolLabLayout'
import { Mic, Activity, Sparkles, Volume2, Speech, Radio } from 'lucide-react'
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

export default function SpeechPage() {
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
    { subject: '逻辑', A: 0, fullMark: 100 },
    { subject: '情感', A: 0, fullMark: 100 },
    { subject: '修辞', A: 0, fullMark: 100 },
    { subject: '节奏', A: 0, fullMark: 100 },
    { subject: '深度', A: 0, fullMark: 100 },
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
      const result = await generateAIResponse('speech', 'generation', prompt, 'Tone: Professional')
      setAiResult(result)

      // 2. Generate Mentor Suggestion
      generateAIResponse('speech', 'suggestion', `User wants speech about "${prompt}"`, 'User is a public speaker.')
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
        请评价这个演讲稿，并返回严格的JSON格式数据，不要包含任何其他文本。
        JSON格式要求：
        {
          "score": 0-100的整数,
          "radar": [
            {"subject": "逻辑", "A": 0-100, "fullMark": 100},
            {"subject": "情感", "A": 0-100, "fullMark": 100},
            {"subject": "修辞", "A": 0-100, "fullMark": 100},
            {"subject": "节奏", "A": 0-100, "fullMark": 100},
            {"subject": "深度", "A": 0-100, "fullMark": 100}
          ],
          "comment": "一段详细的演讲教练反馈"
        }
        
        演讲稿内容：
        ${aiResult}
      `;

      const resultString = await generateAIResponse('speech', 'evaluation', promptText, 'You are a public speaking coach. Return ONLY JSON.');
      
      let parsedData;
      try {
        const cleanString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        parsedData = {
          score: 85,
          radar: [
            { subject: '逻辑', A: 85, fullMark: 100 },
            { subject: '情感', A: 90, fullMark: 100 },
            { subject: '修辞', A: 80, fullMark: 100 },
            { subject: '节奏', A: 88, fullMark: 100 },
            { subject: '深度', A: 82, fullMark: 100 },
          ],
          comment: resultString || "极具感染力，情感真挚动人。"
        };
      }

      setEvaluation(parsedData.comment)
      setAiScore(parsedData.score)
      setRadarData(parsedData.radar)

      // XP Calculation
      const gained = calculateXPGain(parsedData.score, false);
      
      // Update Attribute XP
      addAttributeXP('speech', gained);
      setXpBubbleAttribute('speech');
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
      toolName="AI 语音实验室"
      toolIcon={
        <>
          <Mic className="w-4 h-4" />
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
      themeColor="pink"
      sidebarLeft={
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
              <Speech className="w-3 h-3" /> 演讲主题
            </h3>
            <Textarea 
              placeholder="输入演讲主题或草稿..." 
              className="bg-black/40 border-pink-500/30 focus:border-pink-400 text-pink-100 min-h-[150px] resize-none p-3 text-sm rounded-lg backdrop-blur-sm"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full bg-pink-600 hover:bg-pink-500 text-white border border-pink-400/50 relative overflow-hidden group"
              onClick={startGeneration}
              disabled={isGenerating}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? '正在撰写...' : '生成演讲稿'}
              </span>
            </Button>
          </div>
          
          <div className="h-px bg-pink-500/20" />

          <div className="space-y-4">
             <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
               <Volume2 className="w-3 h-3" /> 语调预设
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {['激昂', '温情', '专业', '幽默'].map(tone => (
                 <button key={tone} className="p-2 text-xs border border-pink-500/20 rounded hover:bg-pink-500/10 text-pink-200 transition-colors">
                   {tone}
                 </button>
               ))}
             </div>
          </div>
        </div>
      }
      sidebarRight={
        <div className="space-y-6">
           <div className="space-y-2">
             <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
               <Radio className="w-3 h-3" /> 教练建议
             </h3>
             <AnimatePresence mode="wait">
               {mentorSuggestion ? (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-4 rounded-lg bg-pink-900/20 border border-pink-500/30 text-pink-100 text-sm leading-relaxed border-l-4 border-l-pink-500"
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
              <CyberLoading text="合成语音脚本..." />
            </motion.div>
          ) : aiResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 w-full max-w-4xl h-full flex flex-col"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-xl p-8 overflow-y-auto custom-scrollbar">
                <div className="prose prose-invert prose-pink max-w-none">
                  <div className="whitespace-pre-wrap text-pink-50 font-serif leading-relaxed text-lg">
                    {aiResult}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  variant="outline"
                  className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
                >
                  {isEvaluating ? <Activity className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
                  {isEvaluating ? '分析演讲技巧...' : '请求教练评价'}
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
              <Mic className="w-24 h-24 mx-auto text-pink-500/20" />
              <h2 className="text-3xl font-bold text-pink-500/50">AI 语音实验室</h2>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ToolLabLayout>
  )
}
