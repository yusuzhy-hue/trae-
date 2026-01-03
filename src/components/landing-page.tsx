'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Bot, Zap, Shield, Code, Cpu, Globe, Medal, Heart, Upload, Wand2, Palette, Music, Mic, Video, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { starTeachers, starStudents, studentWorks, UserProfile, AIWork } from '@/lib/mockData'
import { useAuth } from '@/lib/authContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserDetailModal } from './UserDetailModal'
import { WorkDetailModal } from './WorkDetailModal'
import { useState, useEffect } from 'react'

const calculateScore = (student: UserProfile) => {
  const levelMatch = student.level.match(/\d+/);
  const levelScore = levelMatch ? parseInt(levelMatch[0]) * 10 : 0;
  const medalsScore = (student.medals?.length || 0) * 5;
  const certificatesScore = (student.certificatesCount || 0) * 5;
  const likesScore = student.likes;
  return levelScore + medalsScore + certificatesScore + likesScore;
};

const navTools = [
  { name: "AI 绘画", href: "/tools/painting", icon: Palette },
  { name: "AI 音乐", href: "/tools/music", icon: Music },
  { name: "AI 语音", href: "/tools/speech", icon: Mic },
  { name: "AI 视频", href: "/tools/video", icon: Video },
  { name: "AI 编程", href: "/tools/coding", icon: Code },
]

export function LandingPage() {
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [selectedWork, setSelectedWork] = useState<AIWork | null>(null)
  const [students, setStudents] = useState<UserProfile[]>(starStudents)

  useEffect(() => {
    // 初始化时排序并检查点赞状态
    const processed = starStudents.map(s => {
       // 如果是在服务端，跳过 localStorage
       if (typeof window === 'undefined') return s;
       
       const storageKey = `liked_student_${s.id}_${user?.phone}`;
       const isLiked = localStorage.getItem(storageKey) === 'true';
       // 如果本地记录已点赞，则在基础点赞数上+1（假设mock数据不包含当前用户的赞）
       return {
           ...s,
           isLiked,
           likes: s.likes + (isLiked ? 1 : 0)
       };
    });
    const sorted = processed.sort((a, b) => calculateScore(b) - calculateScore(a));
    setStudents(sorted);
  }, [user]);

  const handleStudentLike = (e: React.MouseEvent, student: UserProfile) => {
    e.stopPropagation();
    
    if (!user) {
      alert("请先登录");
      return;
    }

    const newIsLiked = !student.isLiked;
    const newLikes = student.likes + (newIsLiked ? 1 : -1);
    
    const storageKey = `liked_student_${student.id}_${user.phone}`;
    if (newIsLiked) {
      localStorage.setItem(storageKey, 'true');
    } else {
      localStorage.removeItem(storageKey);
    }

    const updatedStudents = students.map(s => 
      s.id === student.id ? { ...s, likes: newLikes, isLiked: newIsLiked } : s
    );
    
    const sorted = updatedStudents.sort((a, b) => calculateScore(b) - calculateScore(a));
    setStudents(sorted);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">AI 智创平台</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-white transition-colors py-2 focus:outline-none">
                人工智能工具
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-40">
                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1.5 flex flex-col gap-0.5">
                   {navTools.map((tool) => (
                     <Link 
                       key={tool.href} 
                       href={tool.href}
                       className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                     >
                       <tool.icon className="w-4 h-4" />
                       <span className="text-sm">{tool.name}</span>
                     </Link>
                   ))}
                </div>
              </div>
            </div>
            <Link href="/courses" className="hover:text-white transition-colors">精品课程</Link>
            <Link href="/home" className="hover:text-white transition-colors">我的家园</Link>
            <Link href="/competitions" className="hover:text-white transition-colors">赛事中心</Link>
            <Link href="/community" className="hover:text-white transition-colors">社区</Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-purple-500/50">
                  <img src={user.avatar} alt="用户头像" className="h-full w-full object-cover" />
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="hidden text-sm font-medium text-gray-400 hover:text-white md:block"
              >
                登录
              </Link>
            )}
            <Link
              href={user ? "/profile" : "/register"}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:from-purple-500 hover:to-pink-500 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              {user ? "个人中心" : "立即注册"}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative px-4 pb-20 pt-10 md:pt-20">
          <div className="absolute inset-0 -z-10 mx-auto max-w-5xl opacity-20 blur-[100px]">
            <div className="aspect-[1108/632] w-full bg-gradient-to-r from-[#80caff] to-[#4f46e5]" />
          </div>
          
          <div className="container mx-auto max-w-5xl text-center">
            {/* Featured Events / Partners */}
            <div className="mb-16 flex flex-col items-center justify-center gap-6 w-full">
              <Link href="/competitions" className="w-full max-w-lg">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)" }}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-12 py-8 backdrop-blur-md w-full text-center"
                >
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">首届AI创意大赛</h3>
                  <p className="text-lg text-gray-300">立即报名参加</p>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-12 py-8 backdrop-blur-md w-full max-w-lg text-center"
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-2">重庆广电</h3>
                <p className="text-lg text-gray-300">战略合作伙伴</p>
              </motion.div>
            </div>




          </div>
        </section>

        {/* Core AI Capabilities - Moved here */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">核心AI能力中心</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Palette className="h-6 w-6 text-purple-400" />}
                title="AI 绘画"
                description="智能图像生成，支持多种艺术风格与创意设计。"
                delay={0.1}
                href="/tools/painting"
              />
              <FeatureCard
                icon={<Music className="h-6 w-6 text-pink-400" />}
                title="AI 音乐"
                description="自动作曲与编曲，激发音乐创作灵感。"
                delay={0.2}
                href="/tools/music"
              />
              <FeatureCard
                icon={<Mic className="h-6 w-6 text-green-400" />}
                title="AI 语音"
                description="高保真语音合成与识别，打破沟通障碍。"
                delay={0.3}
                href="/tools/speech"
              />
              <FeatureCard
                icon={<Video className="h-6 w-6 text-orange-400" />}
                title="AI 视频"
                description="文本生成视频，让您的创意动起来。"
                delay={0.4}
                href="/tools/video"
              />
              <FeatureCard
                icon={<Code className="h-6 w-6 text-blue-400" />}
                title="AI 编程"
                description="智能代码补全与生成，提升开发效率。"
                delay={0.5}
                href="/tools/coding"
              />
            </div>
          </div>
        </section>

        {/* Star Students Section */}
        <section className="px-4 py-20 bg-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">明星学员</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 text-center transition-all hover:bg-white/10 cursor-pointer"
                  onClick={() => setSelectedUser(student)}
                >
                  <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-blue-500/30 p-1">
                    <img src={student.avatarUrl} alt={student.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{student.name}</h3>
                  <p className="mb-4 text-blue-400">{student.level}</p>
                  <div 
                    className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
                    onClick={(e) => handleStudentLike(e, student)}
                  >
                    <Heart className={`h-4 w-4 ${student.isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                    <span>{student.likes}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Star Teachers Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">明星教师</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {starTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-purple-500/50 cursor-pointer"
                  onClick={() => setSelectedUser(teacher)}
                >
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500/30 p-1">
                    <img src={teacher.avatarUrl} alt={teacher.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                  <p className="mb-4 text-purple-400">{teacher.level}</p>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{teacher.likes} 赞</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Works Section */}
        <section className="px-4 py-20 bg-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">学员 AI 作品</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {studentWorks.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 transition-all hover:border-white/20 cursor-pointer"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={work.coverUrl} alt={work.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-bold text-black shadow-lg backdrop-blur-sm">
                      <Medal className="h-3 w-3" />
                      AI 作品
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-white">{work.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={work.authorAvatarUrl} alt={work.authorName} className="h-8 w-8 rounded-full border border-white/20" />
                        <div>
                          <p className="text-sm font-medium text-white">{work.authorName}</p>
                          <p className="text-xs text-gray-400">{work.authorLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{work.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black py-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 AI 智创平台. 保留所有权利.</p>
        </div>
      </footer>

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />

      {/* Work Detail Modal */}
      <WorkDetailModal 
        work={selectedWork} 
        onClose={() => setSelectedWork(null)} 
      />
    </div>
  )
}

function FeatureCard({ icon, title, description, delay, href }: { icon: React.ReactNode, title: string, description: string, delay: number, href?: string }) {
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-white/20 hover:bg-white/10 h-full"
    >
      <div className="mb-4 inline-flex rounded-lg bg-white/5 p-3 ring-1 ring-white/10 group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )

  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>
  }
  
  return CardContent
}
