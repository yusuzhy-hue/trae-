'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Palette, Music, Mic, Video, Code, Calendar, Users, Clock, ChevronRight, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

// 赛事数据模型
const competitions = [
  {
    id: 1,
    title: 'AI+绘画：未来城市',
    icon: Palette,
    color: 'text-purple-400',
    bgGlow: 'from-purple-500/20 to-blue-500/20',
    iconBg: 'bg-purple-500/20',
    borderColor: 'group-hover:border-purple-500/50',
    rules: '参赛者需使用 AI 绘画工具（如 Midjourney, Stable Diffusion 等）创作一幅展现2050年未来城市风貌的作品。要求画面细节丰富，体现科技与人文的融合。需附带 200 字以内的设计理念说明，解释作品中的核心创意元素。',
    registrationTime: '2026.01.01 - 2026.02.01',
    competitionTime: '2026.02.10',
    groups: ['小学组', '初中组', '高中组', '教师组']
  },
  {
    id: 2,
    title: 'AI+音乐：赛博交响',
    icon: Music,
    color: 'text-pink-400',
    bgGlow: 'from-pink-500/20 to-rose-500/20',
    iconBg: 'bg-pink-500/20',
    borderColor: 'group-hover:border-pink-500/50',
    rules: '利用 AI 音乐生成工具创作一段时长 2-3 分钟的交响乐。作品需融合传统管弦乐与电子合成器音色，表现“赛博朋克”主题的冲突与和谐。提交格式为 MP3/WAV，并附上使用的 AI 工具清单及创作思路。',
    registrationTime: '2026.01.05 - 2026.02.05',
    competitionTime: '2026.02.15',
    groups: ['小学组', '初中组', '高中组', '教师组']
  },
  {
    id: 3,
    title: 'AI+演讲：智能时代的思考',
    icon: Mic,
    color: 'text-green-400',
    bgGlow: 'from-green-500/20 to-emerald-500/20',
    iconBg: 'bg-green-500/20',
    borderColor: 'group-hover:border-green-500/50',
    rules: '结合 AI 语音克隆或合成技术，制作一段 3 分钟的主题演讲音频。演讲内容需探讨人工智能对未来教育或生活的影响。要求语音自然流畅，情感表达准确，背景配乐得当。需提交音频文件及演讲稿文本。',
    registrationTime: '2026.01.10 - 2026.02.10',
    competitionTime: '2026.02.20',
    groups: ['小学组', '初中组', '高中组', '教师组']
  },
  {
    id: 4,
    title: 'AI+视频：微光叙事',
    icon: Video,
    color: 'text-orange-400',
    bgGlow: 'from-orange-500/20 to-red-500/20',
    iconBg: 'bg-orange-500/20',
    borderColor: 'group-hover:border-orange-500/50',
    rules: '使用 AI 视频生成工具（如 Sora, Runway 等）制作一部 1-2 分钟的微电影。主题为“微光”，讲述一个温暖人心的小故事。画面需保持连贯性，剪辑节奏紧凑。允许后期进行少量人工调整，但 AI 生成画面需占比 80% 以上。',
    registrationTime: '2026.01.15 - 2026.02.15',
    competitionTime: '2026.02.25',
    groups: ['小学组', '初中组', '高中组', '教师组']
  },
  {
    id: 5,
    title: 'AI+编程：逻辑之美',
    icon: Code,
    color: 'text-blue-400',
    bgGlow: 'from-blue-500/20 to-cyan-500/20',
    iconBg: 'bg-blue-500/20',
    borderColor: 'group-hover:border-blue-500/50',
    rules: '借助 AI 编程助手（如 Copilot, Cursor 等）开发一个具有实用价值的小型 Web 应用或 Python 脚本。代码需整洁规范，注释清晰。需提交 GitHub 仓库链接及演示视频，并在视频中展示 AI 如何辅助解决关键编程难题。',
    registrationTime: '2026.01.20 - 2026.02.20',
    competitionTime: '2026.03.01',
    groups: ['小学组', '初中组', '高中组', '教师组']
  }
]

type Competition = typeof competitions[0]

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate.replace(/\./g, '-')) - +new Date()
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-4 text-center">
      {[
        { label: '天', value: timeLeft.days },
        { label: '时', value: timeLeft.hours },
        { label: '分', value: timeLeft.minutes },
        { label: '秒', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[3rem] border border-white/10">
            <span className="text-xl font-bold font-mono">{String(item.value).padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function CompetitionsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredCompetitions, setRegisteredCompetitions] = useState<Set<number>>(new Set())

  // Load registered competitions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('my_competitions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const ids = new Set(parsed.map((c: any) => c.id))
        setRegisteredCompetitions(ids as Set<number>)
      } catch (e) {
        console.error('Failed to parse competitions', e)
      }
    }
  }, [])

  const handleRegisterClick = (comp: Competition) => {
    if (registeredCompetitions.has(comp.id)) return
    setSelectedCompetition(comp)
    setSelectedGroup('')
    setIsRegistered(false)
  }

  const handleClose = () => {
    setSelectedCompetition(null)
    setIsRegistered(false)
  }

  const handleSubmit = () => {
    if (!selectedGroup || !selectedCompetition) return
    
    // 1. Save to my_competitions
    const newRegistration = {
      id: selectedCompetition.id,
      title: selectedCompetition.title,
      time: selectedCompetition.competitionTime,
      group: selectedGroup,
      registeredAt: new Date().toISOString()
    }

    const savedCompetitions = JSON.parse(localStorage.getItem('my_competitions') || '[]')
    const updatedCompetitions = [...savedCompetitions, newRegistration]
    localStorage.setItem('my_competitions', JSON.stringify(updatedCompetitions))

    // 2. Create Calendar Reminder (1 day before)
    const competitionDate = new Date(selectedCompetition.competitionTime.replace(/\./g, '-'))
    const reminderDate = new Date(competitionDate)
    reminderDate.setDate(reminderDate.getDate() - 1)

    const newEvent = {
      id: Date.now(), // simple unique id
      title: `备赛提醒：${selectedCompetition.title}`,
      date: reminderDate.toISOString().split('T')[0], // YYYY-MM-DD
      type: 'reminder',
      description: `明天是 ${selectedCompetition.title} 比赛日，请做好准备！`
    }

    const savedEvents = JSON.parse(localStorage.getItem('my_calendar_events') || '[]')
    localStorage.setItem('my_calendar_events', JSON.stringify([...savedEvents, newEvent]))

    // 3. Update local state
    setRegisteredCompetitions(prev => new Set(prev).add(selectedCompetition.id))

    setIsRegistered(true)
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center relative overflow-hidden">
       {/* Deep Blue Background Effect */}
       <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-slate-900 to-slate-950 -z-10" />
       <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
       <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10" />

       {/* Header */}
       <header className="w-full max-w-5xl px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
         <div className="flex flex-col items-start gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  赛事中心
                </h1>
                <p className="text-gray-400 mt-1">参与顶级 AI 赛事，展示你的创意与才华</p>
              </div>
            </div>
         </div>
       </header>

       {/* Competition List */}
       <main className="w-full max-w-5xl px-6 pb-20 space-y-6 relative z-10">
         {competitions.map((comp, index) => (
           <motion.div
             key={comp.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
             className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 ${comp.borderColor}`}
           >
             {/* Hover Glow Effect */}
             <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${comp.bgGlow} pointer-events-none`} />
             
             <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
               {/* Left: Icon */}
               <div className={`shrink-0 p-4 rounded-xl ${comp.iconBg} border border-white/5`}>
                 <comp.icon className={`w-8 h-8 ${comp.color}`} />
               </div>

               {/* Middle: Content */}
               <div className="flex-1 space-y-4">
                 <div>
                   <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                     {comp.title}
                   </h2>
                   <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>报名: {comp.registrationTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-300/80">
                        <Clock className="w-4 h-4" />
                        <span>比赛: {comp.competitionTime}</span>
                      </div>
                   </div>
                 </div>

                 <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <span className="text-white/60 font-medium mr-2">规则:</span>
                      {comp.rules}
                    </p>
                 </div>

                 <div className="flex items-center gap-2 flex-wrap">
                   <Users className="w-4 h-4 text-gray-500" />
                   {comp.groups.map(group => (
                     <span key={group} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                       {group}
                     </span>
                   ))}
                 </div>
               </div>

               {/* Right: Action Button */}
              <div className="w-full md:w-auto shrink-0 flex flex-col items-center justify-center">
                <Button 
                  onClick={() => handleRegisterClick(comp)}
                  disabled={registeredCompetitions.has(comp.id)}
                  className={`w-full md:w-auto px-8 py-6 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-105 hover:shadow-xl
                    ${registeredCompetitions.has(comp.id) 
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed hover:bg-white/10 hover:scale-100 hover:shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                    }`}
                >
                  {registeredCompetitions.has(comp.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      已报名
                    </>
                  ) : (
                    <>
                      立即报名
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
             </div>
           </motion.div>
         ))}
       </main>

       {/* Registration Modal */}
       <AnimatePresence>
         {selectedCompetition && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
             onClick={handleClose}
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
             >
                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-96 h-96 opacity-20 bg-gradient-to-br ${selectedCompetition.bgGlow} blur-[100px] pointer-events-none`} />

                {/* Close Button */}
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                {!isRegistered ? (
                  <div className="p-8 md:p-10 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${selectedCompetition.iconBg} border border-white/5`}>
                          <selectedCompetition.icon className={`w-10 h-10 ${selectedCompetition.color}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedCompetition.title}</h2>
                          <p className="text-gray-400 text-sm mt-1">距离比赛开始还有</p>
                        </div>
                      </div>
                      <CountdownTimer targetDate={selectedCompetition.competitionTime} />
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          关键时间节点
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                           <div className="bg-black/20 p-3 rounded-lg flex justify-between">
                             <span className="text-gray-400">报名时间</span>
                             <span className="text-white">{selectedCompetition.registrationTime}</span>
                           </div>
                           <div className="bg-black/20 p-3 rounded-lg flex justify-between border border-blue-500/20">
                             <span className="text-gray-400">比赛日期</span>
                             <span className="text-blue-300 font-semibold">{selectedCompetition.competitionTime}</span>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-white">选择参赛组别</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {selectedCompetition.groups.map((group) => (
                            <label
                              key={group}
                              className={`
                                cursor-pointer relative overflow-hidden rounded-xl border p-4 text-center transition-all
                                ${selectedGroup === group 
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="group"
                                value={group}
                                checked={selectedGroup === group}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="sr-only"
                              />
                              <span className="font-medium">{group}</span>
                              {selectedGroup === group && (
                                <motion.div
                                  layoutId="active-check"
                                  className="absolute top-2 right-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10 flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={!selectedGroup}
                        className={`
                          px-8 py-6 rounded-xl font-bold text-lg shadow-lg transition-all
                          ${selectedGroup 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:scale-105 hover:shadow-blue-500/25' 
                            : 'bg-white/10 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        提交报名
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-24 h-24 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6"
                    >
                      <CheckCircle className="w-12 h-12" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">报名成功！</h2>
                    <p className="text-gray-400 text-lg max-w-md">
                      您已成功报名参加 <span className="text-white font-medium">“{selectedCompetition.title}”</span>。
                      赛事日程已同步至您的个人中心。
                    </p>
                    <Button 
                      onClick={handleClose}
                      className="mt-8 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      关闭
                    </Button>
                  </div>
                )}
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}
