"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import confetti from "canvas-confetti";
import { X, Trophy, Sparkles } from "lucide-react";

interface AIResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number; // 0-100
  radarData: {
    subject: string;
    A: number; // Score for this dimension
    fullMark: number;
  }[];
  feedback: string;
  xpGained?: number;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

export function AIResultModal({
  isOpen,
  onClose,
  score,
  radarData,
  feedback,
  xpGained = 150,
}: AIResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContent
          onClose={onClose}
          score={score}
          radarData={radarData}
          feedback={feedback}
          xpGained={xpGained}
        />
      )}
    </AnimatePresence>
  );
}

function ModalContent({
  onClose,
  score,
  radarData,
  feedback,
  xpGained,
}: {
  onClose: () => void;
  score: number;
  radarData: AIResultModalProps["radarData"];
  feedback: string;
  xpGained: number;
}) {
  const [displayedFeedback, setDisplayedFeedback] = useState("");
  const feedbackIndexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (feedbackIndexRef.current < feedback.length) {
        setDisplayedFeedback((prev) => prev + feedback.charAt(feedbackIndexRef.current));
        feedbackIndexRef.current++;
      } else {
        clearInterval(intervalId);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [feedback]);

  // Confetti effect
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-[0_0_50px_rgba(147,51,234,0.3)]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visuals & Score */}
          <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 via-black to-black p-12">
            {/* Medal/Score Circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", duration: 1.5 }}
              className="relative mb-8 flex h-48 w-48 items-center justify-center rounded-full border-4 border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-purple-900/20 shadow-[0_0_60px_rgba(234,179,8,0.3)]"
            >
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                  综合得分
                </span>
                <span className="text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  <AnimatedNumber value={score} />
                </span>
              </div>
              
              {/* Decorative glowing rings */}
              <div className="absolute -inset-4 rounded-full border border-yellow-500/20 opacity-50 blur-sm" />
              <div className="absolute -inset-8 rounded-full border border-purple-500/20 opacity-30 blur-md" />
            </motion.div>

            {/* Radar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="能力维度"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Feedback & Rewards */}
          <div className="flex flex-col bg-black/50 p-8 md:p-12">
            <div className="mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-bold text-white">AI 评估报告</h3>
            </div>

            {/* Typewriter Feedback */}
            <div className="mb-8 min-h-[150px] rounded-xl border border-white/5 bg-white/5 p-6 font-mono text-sm leading-relaxed text-gray-300">
              {displayedFeedback}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1 inline-block h-4 w-2 bg-cyan-500 align-middle"
              />
            </div>

            {/* XP Reward */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-auto flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-yellow-900/20 to-purple-900/20 p-6 text-center border border-yellow-500/30"
            >
              <div className="mb-2 flex items-center gap-2 text-yellow-400">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold uppercase tracking-wider">获得奖励</span>
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-4xl font-black text-white drop-shadow-lg">
                +{xpGained} <span className="text-2xl text-yellow-500">经验值</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
