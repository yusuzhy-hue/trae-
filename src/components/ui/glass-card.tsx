import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  hoverEffect = true,
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-lg",
        // Neon border/glow effect
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-purple-500/5 before:via-transparent before:to-blue-500/5",
        hoverEffect && "hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:bg-white/10 transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
