'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plus, Heart, Search, Upload, Bot, MessageSquare, ThumbsUp, Send } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import { studentWorks, AIWork, Comment, myLibraryWorks } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "../../components/ui/label"
import { WorkDetailModal } from '@/components/WorkDetailModal'

export default function CommunityPage() {
  const { user } = useAuth()
  const [works, setWorks] = useState<AIWork[]>([])
  const [selectedWork, setSelectedWork] = useState<AIWork | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({})
  
  // Upload Form State
  const [newWork, setNewWork] = useState<{
    title: string;
    description: string;
    tags: string;
    coverUrl: string;
    fileType?: 'image' | 'video' | 'audio' | 'document' | 'text';
    fileUrl?: string;
    fileName?: string;
  }>({
    title: '',
    description: '',
    tags: '',
    coverUrl: '' 
  })

  const handleSelectFromLibrary = (work: AIWork) => {
    setNewWork({
      ...newWork,
      title: newWork.title || work.title,
      description: newWork.description || work.description || '',
      tags: newWork.tags || (work.tags?.join(', ') || ''),
      coverUrl: work.coverUrl,
      fileType: 'image'
    })
    setIsLibraryOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type.startsWith('image/') ? 'image'
      : file.type.startsWith('video/') ? 'video'
      : file.type.startsWith('audio/') ? 'audio'
      : file.type.startsWith('text/') ? 'text'
      : 'document'

    const objectUrl = URL.createObjectURL(file)
    
    setNewWork(prev => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      fileType: fileType as any,
      fileUrl: objectUrl,
      fileName: file.name,
      // If it's an image, use it as cover. If not, use placeholder
      coverUrl: fileType === 'image' ? objectUrl : 
                 fileType === 'video' ? 'https://placehold.co/400x300/1e1e1e/white?text=视频' :
                 fileType === 'audio' ? 'https://placehold.co/400x300/1e1e1e/white?text=音频' :
                 'https://placehold.co/400x300/1e1e1e/white?text=文档'
    }))
  }

  // Load works from mockData + localStorage
  useEffect(() => {
    const loadWorks = () => {
      // 1. Get localStorage works
      const storedWorksJson = localStorage.getItem('community_works')
      const storedWorks: AIWork[] = storedWorksJson ? JSON.parse(storedWorksJson) : []
      
      // 2. Merge with mock works
      // We want to prioritize stored works if IDs conflict (unlikely with timestamp IDs)
      const allWorks = [...storedWorks, ...studentWorks]
      
      // 3. Update likes from localStorage for all works
      const worksWithLikes = allWorks.map(work => {
         if (typeof window === 'undefined') return work;
         // Check if this work is liked by current user (for UI state)
         // And also check if there's a persisted like count override?
         // Since mockData is static, we can't persist global like counts easily without a backend.
         // But for the user experience, we can use the `liked_work_count_{id}` pattern if we implemented it,
         // or just rely on the existing logic in WorkDetailModal which updates local state.
         // However, the list view needs to show updated counts.
         // Let's check how LandingPage handles it. It doesn't really sync list view counts persistently for mock data.
         // But for new works (in localStorage), we can update them in localStorage.
         
         // For now, let's just display.
         return work;
      })

      setWorks(worksWithLikes)
    }

    loadWorks()
    
    // Listen for storage events to update list if needed
    window.addEventListener('storage', loadWorks)
    return () => window.removeEventListener('storage', loadWorks)
  }, [])

  const handleUpload = () => {
    if (!user) {
      alert("请先登录")
      return
    }

    if (!newWork.title || !newWork.description) {
      alert("请填写完整信息")
      return
    }

    const workId = `work_${Date.now()}`
    const createdWork: AIWork = {
      id: workId,
      title: newWork.title,
      description: newWork.description,
      coverUrl: newWork.coverUrl || `https://placehold.co/400x300/purple/white?text=${encodeURIComponent(newWork.title)}`,
      tags: newWork.tags.split(/[,， ]+/).filter(t => t.trim()),
      authorName: user.name,
      authorLevel: user.grade || 'L1', // Default level
      authorAvatarUrl: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      fileType: newWork.fileType,
      fileUrl: newWork.fileUrl,
      fileName: newWork.fileName
    }

    // Save to localStorage
    const storedWorksJson = localStorage.getItem('community_works')
    const storedWorks: AIWork[] = storedWorksJson ? JSON.parse(storedWorksJson) : []
    const updatedWorks = [createdWork, ...storedWorks]
    localStorage.setItem('community_works', JSON.stringify(updatedWorks))

    // Update state
    setWorks(prev => [createdWork, ...prev])
    setIsUploadOpen(false)
    setNewWork({ title: '', description: '', tags: '', coverUrl: '' })
  }

  const handleAddComment = (workId: string) => {
    if (!user) {
      alert("请先登录")
      return
    }
    const content = commentInputs[workId]
    if (!content?.trim()) return

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      user: user.name,
      avatarUrl: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      content: content,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setWorks(prev => prev.map(w => {
      if (w.id === workId) {
        return {
          ...w,
          comments: [newComment, ...(w.comments || [])]
        }
      }
      return w
    }))

    setCommentInputs(prev => ({...prev, [workId]: ''}))
  }

  const handleLikeComment = (workId: string, commentId: string) => {
     setWorks(prev => prev.map(w => {
       if (w.id === workId && w.comments) {
         return {
           ...w,
           comments: w.comments.map(c => 
             c.id === commentId ? { ...c, likes: c.likes + 1 } : c
           ).sort((a, b) => b.likes - a.likes) // Keep sorted by likes
         }
       }
       return w
     }))
  }

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const fileTypeMap: Record<string, string> = {
    image: '图片',
    video: '视频',
    audio: '音频',
    text: '文本',
    document: '文档'
  }

  return (
    <div className="min-h-screen bg-[#111] text-white selection:bg-green-500/30 font-sans">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#111]/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">创作者社区</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Button 
               onClick={() => setIsUploadOpen(true)}
               className="bg-[#07C160] hover:bg-[#06AD56] text-white gap-2 rounded-md"
             >
               <Upload className="w-4 h-4" />
               发布
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        {/* Search */}
        <div className="mb-8">
           <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="搜索..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/5 border-transparent text-white placeholder:text-gray-500 focus:bg-white/10 rounded-lg"
            />
          </div>
        </div>

        {/* Works List - WeChat Dialogue Style */}
        <div className="flex flex-col gap-8">
          <AnimatePresence>
            {filteredWorks.map((work, index) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img src={work.authorAvatarUrl} alt={work.authorName} className="w-10 h-10 rounded-md bg-gray-700 object-cover" />
                </div>

                {/* Content Bubble */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gray-400 font-medium text-sm">{work.authorName}</span>
                    <span className="text-xs text-gray-600">{work.createdAt || '刚刚'}</span>
                  </div>
                  
                  <div className="relative group">
                    <div 
                      className="bg-[#252525] text-gray-200 p-4 rounded-lg rounded-tl-none inline-block max-w-full shadow-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors relative border border-white/5"
                      onClick={() => setSelectedWork(work)}
                    >
                      {/* Triangle Pointer */}
                      <div className="absolute top-0 -left-[8px] w-0 h-0 border-t-[8px] border-t-[#252525] border-l-[8px] border-l-transparent" />
                      
                      <h3 className="font-bold text-lg mb-2 leading-tight text-white">{work.title}</h3>
                      {work.coverUrl && (
                        <div className="mb-3 rounded overflow-hidden max-w-[300px]">
                           <img src={work.coverUrl} alt={work.title} className="w-full h-auto object-cover" />
                        </div>
                      )}
                      <p className="text-sm opacity-90 whitespace-pre-wrap">{work.description}</p>
                      
                      {work.tags && work.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {work.tags.map(t => (
                            <span key={t} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Comments */}
                  <div className="mt-3 pl-1">
                    <div className="flex items-center gap-6 text-gray-500 text-sm mb-3">
                       <button className="flex items-center gap-1.5 hover:text-[#07C160] transition-colors">
                         <ThumbsUp className="w-4 h-4" />
                         <span>{work.likes}</span>
                       </button>
                       <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                         <MessageSquare className="w-4 h-4" />
                         <span>{work.comments?.length || 0}</span>
                       </button>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white/5 rounded-lg p-3">
                      {/* Comment Input */}
                      <div className="flex gap-2 mb-4">
                        <Input 
                          placeholder="评论..." 
                          value={commentInputs[work.id] || ''}
                          onChange={(e) => setCommentInputs({...commentInputs, [work.id]: e.target.value})}
                          className="h-8 text-xs bg-black/20 border-transparent focus:bg-black/40"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(work.id)}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleAddComment(work.id)}
                          className="h-8 px-3 bg-[#07C160] hover:bg-[#06AD56] text-white"
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Comments List */}
                      {work.comments && work.comments.length > 0 && (
                        <div className="space-y-3">
                          {[...(work.comments)].sort((a, b) => b.likes - a.likes).map(comment => (
                            <div key={comment.id} className="flex gap-2 items-start text-xs">
                              <img src={comment.avatarUrl} className="w-6 h-6 rounded bg-gray-700 flex-shrink-0" />
                              <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-gray-400 font-medium">{comment.user}</span>
                                  <div className="flex items-center gap-2">
                                     <span className="text-gray-600 scale-90">{comment.createdAt}</span>
                                     <button 
                                       onClick={() => handleLikeComment(work.id, comment.id)}
                                       className="flex items-center gap-0.5 text-gray-500 hover:text-red-500"
                                     >
                                       <Heart className="w-3 h-3" />
                                       <span>{comment.likes}</span>
                                     </button>
                                  </div>
                                </div>
                                <p className="text-gray-300 mt-0.5 break-words">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>暂无相关作品，快来发布第一个作品吧！</p>
          </div>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-[#1e1e1e] border-white/5 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>发布新作品</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                value={newWork.title}
                onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                className="bg-black/30 border-white/10"
                placeholder="作品标题"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">内容</Label>
              <Textarea 
                id="desc" 
                value={newWork.description}
                onChange={(e) => setNewWork({...newWork, description: e.target.value})}
                className="bg-black/30 border-white/10"
                placeholder="分享你的想法..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">标签</Label>
              <Input 
                id="tags" 
                value={newWork.tags}
                onChange={(e) => setNewWork({...newWork, tags: e.target.value})}
                className="bg-black/30 border-white/10"
                placeholder="标签 (逗号分隔)"
              />
            </div>
            <div className="grid gap-2">
              <Label>内容来源</Label>
              <div className="flex flex-col gap-3">
                 {/* File Upload Area */}
                 <div className="border-2 border-dashed border-white/10 rounded-lg p-6 hover:border-[#07C160] transition-colors bg-black/20 text-center relative group">
                   <input 
                      type="file" 
                      accept="image/*,video/*,audio/*,.ppt,.pptx,.pdf,text/plain"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#07C160] transition-colors">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">点击或拖拽上传文件</span>
                      <span className="text-xs text-gray-500">支持图片、视频、音频、PPT、PDF、文本</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-2 text-xs text-gray-500 my-1">
                    <div className="h-px bg-white/10 flex-grow" />
                    <span>或</span>
                    <div className="h-px bg-white/10 flex-grow" />
                 </div>

                 {/* Library Selection Button */}
                 <Button 
                   type="button"
                   variant="ghost" 
                   onClick={() => setIsLibraryOpen(true)}
                   className="w-full border border-white/10 text-white hover:bg-white/10 hover:text-white"
                 >
                   从我的作品库选择
                 </Button>

                 {/* Preview */}
                 {newWork.coverUrl && (
                   <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black/20 relative group">
                     {newWork.fileType === 'image' ? (
                       <img src={newWork.coverUrl} alt="预览" className="h-40 w-full object-contain" />
                     ) : (
                       <div className="h-20 flex items-center justify-center gap-3">
                          <span className="font-medium text-white">{newWork.fileName || '已选择文件'}</span>
                          <span className="text-xs px-2 py-1 bg-white/10 rounded uppercase">{newWork.fileType ? (fileTypeMap[newWork.fileType] || newWork.fileType) : ''}</span>
                       </div>
                     )}
                     
                     <div className="absolute top-2 right-2">
                       <Button 
                         size="sm" 
                         variant="destructive" 
                         className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         onClick={() => setNewWork({...newWork, coverUrl: '', fileUrl: undefined, fileName: undefined, fileType: undefined})}
                       >
                         ×
                       </Button>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="text-gray-400">取消</Button>
            <Button onClick={handleUpload} className="bg-[#07C160] hover:bg-[#06AD56] text-white">发表</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Library Selection Dialog */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="bg-[#1e1e1e] border-white/5 text-white sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择我的作品</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
            {myLibraryWorks.map((work) => (
              <div 
                key={work.id}
                onClick={() => handleSelectFromLibrary(work)}
                className="group cursor-pointer relative rounded-lg overflow-hidden border border-white/10 bg-black/20 hover:border-[#07C160] transition-all"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img 
                    src={work.coverUrl} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-sm truncate">{work.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{work.createdAt}</p>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="bg-[#07C160] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    选择
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal - Keeping it for compatibility if clicked */}
      <WorkDetailModal
        work={selectedWork}
        onClose={() => setSelectedWork(null)}
      />
    </div>
  )
}
