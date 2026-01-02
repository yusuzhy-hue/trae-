'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { User, School, Calendar, Crown, ShieldAlert, Key, Loader2, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from '@/lib/authContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, login, logout, isLoading } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeCode, setUpgradeCode] = useState('')
  const [upgradeError, setUpgradeError] = useState('')
  const [isUpgrading, setIsUpgrading] = useState(false)

  // Check for expiration logic
  useEffect(() => {
    if (user && user.userType === 'Member' && user.expiryDate) {
      const now = new Date()
      const expiry = new Date(user.expiryDate)
      
      if (now > expiry) {
        // Downgrade logic
        const updatedUser = { ...user, userType: 'Trial' as const, expiryDate: undefined }
        login(updatedUser)
        // You might want to show a toast notification here
      }
    }
  }, [user, login])

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/register')
    }
  }, [user, isLoading, router])

  const handleUpgrade = async () => {
    setUpgradeError('')
    setIsUpgrading(true)

    // Validate code
    if (upgradeCode.trim() === 'VIP666') {
      // Simulate API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const date = new Date()
      date.setDate(date.getDate() + 365)
      
      if (user) {
        const updatedUser = { 
          ...user, 
          userType: 'Member' as const, 
          expiryDate: date.toISOString() 
        }
        login(updatedUser)
        setShowUpgradeModal(false)
        setUpgradeCode('')
      }
    } else {
      setUpgradeError('激活码无效')
    }
    
    setIsUpgrading(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 mx-auto opacity-20 blur-[100px]">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-purple-900/40" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-900/40" />
      </div>

      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <Link 
            href="/" 
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center h-full">
              <div className="relative mx-auto mb-6 h-32 w-32">
                <div className={`absolute inset-0 rounded-full animate-pulse ${user.userType === 'Member' ? 'bg-gradient-to-tr from-yellow-500 to-purple-600 blur-md opacity-50' : 'bg-blue-500 blur-md opacity-20'}`}></div>
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="relative h-full w-full rounded-full border-2 border-white/10 bg-black object-cover" 
                />
                <div className={`absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
                  user.userType === 'Member' 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' 
                    : 'bg-gray-700 text-gray-300 border border-white/10'
                }`}>
                  {user.userType === 'Member' ? <Crown className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {user.userType === 'Member' ? '正式会员' : '体验用户'}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
              
              <div className="flex flex-col gap-2 mt-6 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <School className="h-4 w-4 text-blue-400" />
                  <span>{user.school}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <span>{user.grade}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status & Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Membership Status Card */}
            <div className={`rounded-2xl border p-8 relative overflow-hidden ${
              user.userType === 'Member'
                ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-purple-500/10'
                : 'border-white/10 bg-white/5'
            }`}>
              {user.userType === 'Member' ? (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Crown className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-bold text-yellow-500">全功能已解锁</h2>
                  </div>
                  <p className="text-gray-300 mb-2">您尊贵的会员权益正在生效中。</p>
                  <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 inline-flex px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" />
                    到期时间：{user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : '永久'}
                  </div>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                      <ShieldAlert className="h-6 w-6 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-200">当前为体验模式</h2>
                  </div>
                  <p className="text-gray-400 mb-6">部分高级 AI 功能（如无限生成、模型微调）受限。升级会员解锁全部权益。</p>
                  <Button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg shadow-purple-900/20"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    输入激活码升级
                  </Button>
                </div>
              )}
            </div>

            {/* Placeholder for other stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-gray-400 text-sm font-medium mb-2">已生成作品</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-gray-400 text-sm font-medium mb-2">获得点赞</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-black/90 border-purple-500/50 text-white backdrop-blur-xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              升级会员
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              输入您的激活码以解锁全部功能。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="请输入激活码 (VIP666)" 
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                  value={upgradeCode}
                  onChange={(e) => setUpgradeCode(e.target.value)}
                />
              </div>
              {upgradeError && (
                <p className="text-xs text-red-400 ml-1">{upgradeError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  验证中...
                </>
              ) : (
                '立即升级'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
