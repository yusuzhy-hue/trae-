"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star } from "lucide-react";

interface LevelUpNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export function LevelUpNotification({
  isVisible,
  message,
  onClose,
}: LevelUpNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 left-0 right-0 z-[100] mx-auto flex w-fit items-center gap-3 rounded-full border border-yellow-400/50 bg-black/80 px-6 py-3 shadow-[0_0_30px_rgba(234,179,8,0.4)] backdrop-blur-md"
        >
          <div className="relative">
            <Crown className="h-6 w-6 text-yellow-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute -inset-1 rounded-full border border-yellow-400/30 border-t-yellow-400"
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">
              升级啦！
            </span>
            <span className="text-sm font-medium text-yellow-100">
              {message}
            </span>
          </div>

          <div className="flex gap-1">
             {[1, 2, 3].map((i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
               </motion.div>
             ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
