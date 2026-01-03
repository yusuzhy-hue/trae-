'use client'

import React, { useState } from 'react'
import { ToolLabLayout } from '@/components/ToolLabLayout'
import { Code, Activity, Sparkles, Terminal, Cpu, Braces } from 'lucide-react'
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

export default function CodingPage() {
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
    { subject: '规范', A: 0, fullMark: 100 },
    { subject: '性能', A: 0, fullMark: 100 },
    { subject: '安全', A: 0, fullMark: 100 },
    { subject: '复用', A: 0, fullMark: 100 },
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
      const result = await generateAIResponse('coding', 'generation', prompt, 'Stack: React, Next.js, Tailwind')
      setAiResult(result)

      // 2. Generate Mentor Suggestion
      generateAIResponse('coding', 'suggestion', `用户想要编写关于 "${prompt}" 的代码。请给出一个简短的、有建设性的中文编程建议（50字以内）。`, '你是一位经验丰富的技术导师。')
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
        请评价这个代码方案，并返回严格的JSON格式数据，不要包含任何其他文本。
        JSON格式要求：
        {
          "score": 0-100的整数,
          "radar": [
            {"subject": "逻辑", "A": 0-100, "fullMark": 100},
            {"subject": "规范", "A": 0-100, "fullMark": 100},
            {"subject": "性能", "A": 0-100, "fullMark": 100},
            {"subject": "安全", "A": 0-100, "fullMark": 100},
            {"subject": "复用", "A": 0-100, "fullMark": 100}
          ],
          "comment": "一段详细的技术面试反馈"
        }
        
        代码内容：
        ${aiResult}
      `;

      const resultString = await generateAIResponse('coding', 'evaluation', promptText, '你是一位资深技术专家。请只返回 JSON。');
      
      let parsedData;
      try {
        const cleanString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        parsedData = {
          score: 80,
          radar: [
            { subject: '逻辑', A: 80, fullMark: 100 },
            { subject: '规范', A: 85, fullMark: 100 },
            { subject: '性能', A: 75, fullMark: 100 },
            { subject: '安全', A: 80, fullMark: 100 },
            { subject: '复用', A: 70, fullMark: 100 },
          ],
          comment: resultString || "代码质量尚可，建议优化边界条件处理。"
        };
      }

      setEvaluation(parsedData.comment)
      setAiScore(parsedData.score)
      setRadarData(parsedData.radar)

      // XP Calculation
      const gained = calculateXPGain(parsedData.score, false);
      
      // Update Attribute XP
      addAttributeXP('coding', gained);
      setXpBubbleAttribute('coding');
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
      toolName="AI 编程实验室"
      toolIcon={
        <>
          <Code className="w-4 h-4" />
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
      themeColor="green"
      sidebarLeft={
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3 h-3" /> 需求描述
            </h3>
            <Textarea 
              placeholder="描述功能需求、API 接口或 Bug..." 
              className="bg-black/40 border-green-500/30 focus:border-green-400 text-green-100 min-h-[150px] resize-none p-3 text-sm rounded-lg backdrop-blur-sm font-mono"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full bg-green-600 hover:bg-green-500 text-white border border-green-400/50 relative overflow-hidden group"
              onClick={startGeneration}
              disabled={isGenerating}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? '正在编译...' : '生成代码'}
              </span>
            </Button>
          </div>
          
          <div className="h-px bg-green-500/20" />

          <div className="space-y-4">
             <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
               <Cpu className="w-3 h-3" /> 技术栈
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {['React', 'Python', 'Node.js', 'Rust'].map(stack => (
                 <button key={stack} className="p-2 text-xs border border-green-500/20 rounded hover:bg-green-500/10 text-green-200 transition-colors font-mono">
                   {stack}
                 </button>
               ))}
             </div>
          </div>
        </div>
      }
      sidebarRight={
        <div className="space-y-6">
           <div className="space-y-2">
             <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                  <Braces className="w-3 h-3" /> 代码审查
                </h3>
             <AnimatePresence mode="wait">
               {mentorSuggestion ? (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-4 rounded-lg bg-green-900/20 border border-green-500/30 text-green-100 text-sm leading-relaxed border-l-4 border-l-green-500 font-mono"
                 >
                   {mentorSuggestion}
                 </motion.div>
               ) : (
                 <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-gray-500 text-xs italic text-center font-mono">
                   // 等待输入...
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
              <CyberLoading text="编译模块中..." />
            </motion.div>
          ) : aiResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 w-full max-w-5xl h-full flex flex-col"
            >
              <div className="flex-1 bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-6 overflow-y-auto custom-scrollbar font-mono text-sm">
                <div className="prose prose-invert prose-green max-w-none">
                  <div className="whitespace-pre-wrap text-green-50 leading-relaxed">
                    {aiResult}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                >
                  {isEvaluating ? <Activity className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
                  {isEvaluating ? '运行测试中...' : '请求技术面试'}
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
              <Terminal className="w-24 h-24 mx-auto text-green-500/20" />
              <h2 className="text-3xl font-bold text-green-500/50">AI 编程实验室</h2>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ToolLabLayout>
  )
}
