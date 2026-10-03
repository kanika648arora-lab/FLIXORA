import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PersonalizedGreeting() {
  const { user, activeProfile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const name = activeProfile?.name || user?.name || 'Vaibhav';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 pt-8 pb-2 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border-2 shadow-lg"
          style={{ borderColor: activeProfile?.color || '#E50914' }}
        >
          <img src={activeProfile?.avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-['Syne'] font-extrabold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {name}.</span>
            <Sparkles className="w-4 h-4 text-[#E50914] animate-pulse" />
          </h2>
          <p className="text-xs text-gray-400">
            Curated 4K Cinema based on your preferences
          </p>
        </div>
      </div>
    </motion.div>
  );
}
