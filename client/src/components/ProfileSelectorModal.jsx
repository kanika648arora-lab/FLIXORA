import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileSelectorModal() {
  const { isProfileSelectorOpen, setIsProfileSelectorOpen, profiles, activeProfile, switchProfile } = useAuth();
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [selectedZoomId, setSelectedZoomId] = useState(null);

  if (!isProfileSelectorOpen) return null;

  const handleSelect = (profileId) => {
    setSelectedZoomId(profileId);
    setTimeout(() => {
      switchProfile(profileId);
      setSelectedZoomId(null);
      setIsProfileSelectorOpen(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#070709] overflow-hidden select-none"
      >
        {/* Dynamic Ambient Background Glow based on hovered profile */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-25"
          style={{
            background: hoveredProfile
              ? `radial-gradient(circle at center, ${hoveredProfile.color} 0%, transparent 60%)`
              : 'radial-gradient(circle at center, rgba(229,9,20,0.2) 0%, transparent 60%)'
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => setIsProfileSelectorOpen(false)}
          className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-10 z-10">
          <span className="font-['Syne'] font-black text-2xl tracking-[0.3em] text-white">
            FLIX<span className="text-[#E50914]">ORA</span>
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-4"
          >
            Who's Watching?
          </motion.h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 tracking-widest uppercase">
            Select your profile for personalized 4K cinema
          </p>
        </div>

        {/* Profile Avatars Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl px-4 z-10">
          {profiles.map((profile) => {
            const isHovered = hoveredProfile?.id === profile.id;
            const isZooming = selectedZoomId === profile.id;
            const isCurrent = activeProfile?.id === profile.id;

            return (
              <motion.div
                key={profile.id}
                onMouseEnter={() => setHoveredProfile(profile)}
                onMouseLeave={() => setHoveredProfile(null)}
                onClick={() => handleSelect(profile.id)}
                animate={{
                  scale: isZooming ? 2.5 : isHovered ? 1.08 : 1,
                  opacity: selectedZoomId && !isZooming ? 0 : 1
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Avatar Box */}
                <div
                  className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden p-1 transition-all duration-300"
                  style={{
                    boxShadow: isHovered
                      ? `0 0 40px ${profile.color}`
                      : '0 10px 30px rgba(0,0,0,0.6)'
                  }}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Active Indicator check badge */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Profile Name */}
                <span className="font-['Syne'] font-bold text-base sm:text-lg text-gray-300 group-hover:text-white mt-4 tracking-wide transition-colors">
                  {profile.name}
                </span>

                {profile.isKid && (
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-400 mt-0.5">
                    Kids Safety On
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
