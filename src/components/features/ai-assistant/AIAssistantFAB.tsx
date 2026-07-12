"use client";

import { Bot } from "lucide-react";
import { motion } from "motion/react";

export function AIAssistantFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50
                 w-12 h-12 rounded-full
                 bg-primary text-primary-foreground
                 shadow-lg shadow-primary/25
                 hover:shadow-xl hover:shadow-primary/35
                 hover:scale-105 active:scale-95
                 transition-all duration-200
                 flex items-center justify-center"
      aria-label="qiaoqiao"
    >
      <Bot className="w-5 h-5" />
    </motion.button>
  );
}
