'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Bot, Zap, Shield, Code, Cpu, Globe, Medal, Heart, Upload, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { starTeachers, starStudents, studentWorks } from '@/lib/mockData'
import { useAuth } from '@/lib/authContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  const { user } = useAuth()

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
            <Link href="/tools" className="hover:text-white transition-colors">AI工具</Link>
            <Link href="/profile" className="hover:text-white transition-colors">个人中心</Link>
            <Link href="/courses" className="hover:text-white transition-colors">精品课程</Link>
            <Link href="/home" className="hover:text-white transition-colors">我的家园</Link>
            <Link href="/competitions" className="hover:text-white transition-colors">赛事中心</Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-purple-500/50">
                  <img src={user.avatar} alt="User Avatar" className="h-full w-full object-cover" />
                </div>
              </div>
            ) : (
              <Link 
                href="/register"
                className="hidden text-sm font-medium text-gray-400 hover:text-white md:block"
              >
                登录
              </Link>
            )}
            <Link
              href={user ? "/profile" : "/register"}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
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
            <div className="mb-12 flex flex-wrap justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-blue-400">首届AI创意大赛</h3>
                <p className="text-sm text-gray-400">立即报名参加</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-purple-400">重庆广电</h3>
                <p className="text-sm text-gray-400">战略合作伙伴</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-md"
            >
              <span className="mr-2 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v2.0 现已上线
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl lg:text-8xl"
            >
              光速构建 <br />
              <span className="text-white">AI 应用</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl"
            >
              构建、部署和扩展 AI 应用的一站式平台。集成最先进的模型和工具。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href={user ? "/profile" : "/register"}
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200"
              >
                {user ? "进入控制台" : "开始构建"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                查看文档
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Star Teachers Section */}
        <section className="px-4 py-20 bg-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">明星教师</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {starTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 text-center transition-all hover:border-purple-500/50"
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

        {/* Star Students Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">明星学员</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {starStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:bg-white/10"
                >
                  <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-blue-500/30 p-1">
                    <img src={student.avatarUrl} alt={student.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{student.name}</h3>
                  <p className="mb-4 text-blue-400">{student.level}</p>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{student.likes}</span>
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
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 transition-all hover:border-white/20"
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

        {/* Features Grid */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">平台特性</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-6 w-6 text-yellow-400" />}
                title="即时部署"
                description="提交代码，剩下的交给我们。包含全球边缘网络。"
                delay={0.1}
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-green-400" />}
                title="企业级安全"
                description="符合 SOC2 标准的基础设施，自动安全更新。"
                delay={0.2}
              />
              <FeatureCard
                icon={<Code className="h-6 w-6 text-blue-400" />}
                title="API 优先"
                description="所有功能均可通过文档完善的类型化 API 使用。"
                delay={0.3}
              />
              <FeatureCard
                icon={<Cpu className="h-6 w-6 text-purple-400" />}
                title="模型无关"
                description="只需更改配置即可在 GPT-4、Claude 和 Llama 之间切换。"
                delay={0.4}
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6 text-pink-400" />}
                title="全球扩展"
                description="自动部署到 35+ 个区域。随处享受低延迟。"
                delay={0.5}
              />
              <FeatureCard
                icon={<Bot className="h-6 w-6 text-orange-400" />}
                title="AI 智能体"
                description="内置用于创建自主 AI 智能体的框架。"
                delay={0.6}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black py-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 AI 智创平台. 保留所有权利.</p>
        </div>
      </footer>


    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-white/20 hover:bg-white/10"
    >
      <div className="mb-4 inline-flex rounded-lg bg-white/5 p-3 ring-1 ring-white/10 group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
