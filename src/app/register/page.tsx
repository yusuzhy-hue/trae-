'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Bot, User, GraduationCap, School, Phone, Key, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/authContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [formData, setFormData] = useState({
    school: '',
    name: '',
    grade: '',
    phone: '',
    code: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate activation code
    let userType: 'Trial' | 'Member' = 'Trial'
    let expiryDate: string | undefined

    if (formData.code.trim()) {
      if (formData.code.trim() === 'VIP666') {
        userType = 'Member'
        // Current date + 365 days
        const date = new Date()
        date.setDate(date.getDate() + 365)
        expiryDate = date.toISOString()
      } else {
        setError('激活码无效，请检查或留空以体验用户身份注册')
        setIsLoading(false)
        return
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Save user data via AuthContext
    login({
      name: formData.name,
      school: formData.school,
      role: role,
      userType: userType,
      expiryDate: expiryDate,
      grade: formData.grade,
      phone: formData.phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}` // Generate avatar based on name
    })

    setIsLoading(false)
    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 mx-auto opacity-20 blur-[100px]">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/50" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">加入 AI 智创平台</h1>
            <p className="mt-2 text-sm text-gray-400">开启您的 AI 探索之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identity Selector */}
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                  role === 'student' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="h-4 w-4" />
                我是学生
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                  role === 'teacher' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                我是老师
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-center gap-2 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">所属学校</label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    name="school"
                    required
                    placeholder="请输入您的学校全称" 
                    className="border-white/10 bg-black/20 pl-10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1">真实姓名</label>
                  <Input 
                    name="name"
                    required
                    placeholder="姓名" 
                    className="border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1">年级/班级</label>
                  <Input 
                    name="grade"
                    required
                    placeholder={role === 'student' ? "例：高一(3)班" : "任教年级"} 
                    className="border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    value={formData.grade}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">联系电话</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    name="phone"
                    type="tel"
                    required
                    placeholder="请输入手机号码" 
                    className="border-white/10 bg-black/20 pl-10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  激活码 <span className="text-gray-600">(选填)</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    name="code"
                    placeholder="请输入平台激活码" 
                    className="border-white/10 bg-black/20 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-blue-500"></span>
                  如果没有激活码，将作为体验用户注册
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`w-full h-11 text-base font-medium border-none transition-all duration-300 ${
                role === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  正在注册...
                </>
              ) : (
                '立即注册'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
