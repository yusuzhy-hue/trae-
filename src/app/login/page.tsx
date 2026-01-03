'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Smartphone, QrCode, CheckCircle2, Key } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/authContext'
import { Checkbox } from '@/components/ui/checkbox'
import { LoginSuccessAnimation } from '@/components/LoginSuccessAnimation'

export default function LoginPage() {
  const router = useRouter()
  const { login, checkUser } = useAuth()
  const [loginMethod, setLoginMethod] = useState<'password' | 'phone' | 'wechat'>('password')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(true)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleGetCode = () => {
    if (!phoneNumber) {
      alert('请输入手机号码')
      return
    }
    if (phoneNumber.length !== 11) {
      alert('请输入正确的11位手机号码')
      return
    }
    
    if (!checkUser(phoneNumber)) {
      alert('该手机号未注册，请先前往注册')
      return
    }

    setCountdown(60)
    alert('验证码已发送：123456') // Mock behavior
  }

  const handleLoginSuccess = (user: any) => {
    setIsLoading(false)
    setIsSuccess(true)
    // Perform actual login logic here, but delay redirect until animation finishes
    login(user, rememberMe)
  }

  const handleAnimationComplete = () => {
    router.push('/')
  }

  const handleLogin = async () => {
    setError('')
    if (!agreed) {
      alert('请先阅读并同意用户协议和隐私政策')
      return
    }

    if (loginMethod === 'password') {
        if (!phoneNumber || !password) {
            alert('请输入账号和密码')
            return
        }

        const user = checkUser(phoneNumber)
        if (!user) {
            alert('该账号未注册，请先前往注册')
            return
        }

        if (user.password && user.password !== password) {
            alert('密码错误，请重试')
            return
        } else if (!user.password) {
            alert('该账号未设置密码，请使用短信验证码登录')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            handleLoginSuccess(user)
        }, 1000)
        return
    }

    if (loginMethod === 'phone') {
      if (!phoneNumber || !verificationCode) {
        alert('请输入手机号和验证码')
        return
      }
      // Mock validation
      if (verificationCode !== '123456') {
        alert('验证码错误 (测试码: 123456)')
        return
      }
      
      const user = checkUser(phoneNumber)
      if (!user) {
        alert('该手机号未注册，请先前往注册')
        return
      }

      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        handleLoginSuccess(user)
      }, 1500)
    }
  }

  const handleWechatScanMock = () => {
    if (!agreed) {
        alert('请先阅读并同意用户协议和隐私政策')
        return
    }
    
    const wechatTestPhone = '13900139000'
    const user = checkUser(wechatTestPhone)
    
    if (!user) {
        alert('该微信未绑定账号，请先使用手机号注册')
        return
    }

    setIsLoading(true)
    setTimeout(() => {
        handleLoginSuccess(user)
    }, 1500)
  }

  if (isSuccess) {
    return <LoginSuccessAnimation onComplete={handleAnimationComplete} />
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
       {/* Background Effects */}
       <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950 -z-10" />
       <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] -z-10" />
       <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] -z-10" />

       {/* Back Button */}
       <Link 
          href="/"
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all hover:scale-105 text-sm text-gray-400 hover:text-white"
       >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
       </Link>

       <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                欢迎回来
              </h1>
              <p className="text-gray-400 text-sm">登录 AI 智创平台，开启您的创作之旅</p>
            </div>

            {/* Login Method Tabs */}
            <div className="flex bg-white/5 p-1 rounded-lg mb-8">
              <button
                onClick={() => setLoginMethod('password')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  loginMethod === 'password' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Key className="w-4 h-4" />
                密码登录
              </button>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  loginMethod === 'phone' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                短信登录
              </button>
              <button
                onClick={() => setLoginMethod('wechat')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  loginMethod === 'wechat' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <QrCode className="w-4 h-4" />
                微信扫码
              </button>
            </div>

            <div className="h-[320px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {loginMethod === 'password' && (
                <motion.div
                    key="password"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label className="text-gray-300">账号</Label>
                        <Input 
                            type="text" 
                            placeholder="请输入手机号/账号"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">密码</Label>
                        <Input 
                            type="password" 
                            placeholder="请输入登录密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox 
                            id="remember" 
                            checked={rememberMe}
                            onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                            className="border-white/20 checked:bg-blue-600 checked:border-blue-600"
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400 cursor-pointer select-none"
                        >
                            记住我（方便下次自动登录）
                        </label>
                    </div>

                    <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 mt-2 shadow-lg shadow-blue-500/20"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                登录中...
                            </div>
                        ) : '登录'}
                    </Button>
                </motion.div>
              )}

              {loginMethod === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-gray-300">手机号码</Label>
                    <Input 
                      type="tel" 
                      placeholder="请输入手机号码"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">验证码</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="text" 
                        placeholder="请输入验证码"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleGetCode}
                        disabled={countdown > 0}
                        className="w-32 border-white/10 hover:bg-white/10 hover:text-white text-gray-300 bg-transparent"
                      >
                        {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 mt-4 shadow-lg shadow-purple-500/20"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            登录中...
                        </div>
                    ) : '登录'}
                  </Button>
                </motion.div>
              )}

              {loginMethod === 'wechat' && (
                <motion.div
                  key="wechat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center py-4"
                >
                  <div 
                    className="relative group cursor-pointer"
                    onClick={handleWechatScanMock}
                    title="点击模拟扫码登录"
                  >
                    <div className="w-48 h-48 bg-white p-2 rounded-xl mb-4 shadow-inner">
                        {/* Placeholder QR Code */}
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-lg overflow-hidden relative">
                             <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MockLogin" alt="微信二维码" className="w-full h-full opacity-90" />
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity">
                                <span className="text-white font-medium text-sm">点击模拟扫码</span>
                             </div>
                        </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">请使用微信扫描二维码登录</p>
                  <div className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20">
                    未注册用户请先前往注册页面
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>


            {/* Agreement */}
            <div className="mt-8 flex items-start gap-2 text-xs text-gray-500 justify-center">
              <div 
                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${agreed ? 'bg-purple-500 border-purple-500 text-white' : 'border-gray-600 hover:border-gray-500'}`}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <p className="leading-tight">
                登录即代表您已同意
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 mx-1">《用户协议》</Link>
                和
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 mx-1">《隐私政策》</Link>
              </p>
            </div>
          </div>
       </div>
    </div>
  )
}
