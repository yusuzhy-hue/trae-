import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function CoursesPage() {
  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden">
       {/* Deep Blue Background Effect matching homepage vibe */}
       <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950 -z-10" />
       <div className="absolute top-0 left-1/2 w-96 h-96 bg-yellow-600/30 rounded-full blur-[100px] -z-10" />
       <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] -z-10" />

       <div className="z-10 text-center space-y-8 p-8 flex flex-col items-center">
          <div className="p-4 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
            <BookOpen className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
            这里是精品课程
          </h1>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
       </div>
    </div>
  )
}
