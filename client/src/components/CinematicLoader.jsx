import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds cinematic intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800); // Allow split/zoom dissolve to complete
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinishing ? (
        <motion.div
          key="loader-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.12,
            filter: "blur(20px)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070709] overflow-hidden select-none"
        >
          {/* Subtle background cinematic lens glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#E50914]/10 blur-[140px] pointer-events-none" />

          {/* FLIXORA Animated Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)", letterSpacing: "0.2em" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                letterSpacing: "0.45em",
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="text-5xl md:text-7xl font-extrabold tracking-[0.45em] text-white flex items-center justify-center font-['Syne']"
            >
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">FLIX</span>
              <span className="text-[#E50914] drop-shadow-[0_0_35px_rgba(229,9,20,0.8)]">ORA</span>
            </motion.div>

            {/* Glowing red accent line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "160px", opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent mt-3 mb-6"
            />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xs uppercase tracking-[0.35em] text-gray-400 font-medium mb-8"
            >
              LOADING EXPERIENCE...
            </motion.p>

            {/* Progress bar container */}
            <div className="w-56 md:w-72 h-[3px] bg-white/10 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E50914] to-[#ff4d5a] shadow-[0_0_12px_#E50914]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Numeric Counter */}
            <motion.span
              className="text-xs font-mono text-gray-500 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {progress} %
            </motion.span>
          </div>

          {/* Film aperture lines */}
          <div className="absolute top-8 left-8 text-white/20 text-xs font-mono tracking-widest hidden sm:block">
            FLIXORA // STUDIO ENGINE v2.6
          </div>
          <div className="absolute bottom-8 right-8 text-white/20 text-xs font-mono tracking-widest hidden sm:block">
            4K UHD • DOLBY ATMOS READY
          </div>
        </motion.div>
      ) : (
        /* Split Apart Zoom Curtain */
        <motion.div
          key="loader-split"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[99999] pointer-events-none"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#070709] border-b border-red-600/30"
          />
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#070709] border-t border-red-600/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
