import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Heart, Info, Star, Volume2, VolumeX } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function MovieCard({ movie, isPriority = false, index = 0 }) {
  const { isInMyList, toggleMyList, isLiked, toggleLike, openPlayer, openModal } = useMovie();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const cardRef = useRef(null);
  const videoTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  const inList = isInMyList(movie.id);
  const liked = isLiked(movie.id);

  // 3D Tilt calculation based on mouse coordinates relative to card
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // subtle tilt X
    const rotateY = ((x - centerX) / centerX) * 9;  // subtle tilt Y

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    handleMouseMove(e);

    // Precise hover timing: video preview starts at 250ms
    videoTimeoutRef.current = setTimeout(() => {
      setIsVideoActive(true);
    }, 280);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoActive(false);
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="watch"
      className="relative shrink-0 w-[220px] sm:w-[260px] md:w-[290px] h-[330px] sm:h-[390px] md:h-[430px] cursor-pointer rounded-2xl select-none group/card perspective-[1000px]"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.15 : 1,
          rotateX: isHovered ? tilt.rotateX : 0,
          rotateY: isHovered ? tilt.rotateY : 0,
          zIndex: isHovered ? 60 : 10
        }}
        transition={{
          scale: { type: 'spring', stiffness: 260, damping: 22 },
          rotateX: { type: 'spring', stiffness: 300, damping: 25 },
          rotateY: { type: 'spring', stiffness: 300, damping: 25 }
        }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
        className={`w-full h-full rounded-2xl overflow-hidden glass-card transition-shadow duration-300 relative ${
          isHovered
            ? 'shadow-[0_22px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(229,9,20,0.35)] border-white/20'
            : 'shadow-lg border-white/5'
        }`}
      >
        {/* Dynamic Light Reflection Shine */}
        <div
          className="absolute inset-0 z-30 pointer-events-none rounded-2xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.4) 0%, transparent 65%)`
          }}
        />

        {/* Poster Image / Video Preview */}
        <div className="relative w-full h-[62%] overflow-hidden bg-zinc-900">
          {/* Main Poster Image */}
          <motion.img
            src={movie.posterUrl}
            alt={movie.title}
            loading={isPriority ? 'eager' : 'lazy'}
            animate={{
              scale: isHovered ? 1.08 : 1,
              opacity: isVideoActive ? 0 : 1
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center"
          />

          {/* Autoplaying Trailer on Hover (250ms delay) */}
          <AnimatePresence>
            {isVideoActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full z-10 bg-black"
              >
                <video
                  ref={videoRef}
                  src={movie.trailerUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Subtle video sound toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-400" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badges on Poster */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
            {movie.top10Rank && (
              <span className="px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                TOP 10
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border border-white/10">
              {movie.quality}
            </span>
          </div>

          {/* Gradient overlay on image bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#15151c] to-transparent z-15 pointer-events-none" />
        </div>

        {/* Card Content & Metadata */}
        <div className="relative p-3.5 flex flex-col justify-between h-[38%] bg-[#15151c]">
          <div>
            {/* Title */}
            <h3 className="font-['Syne'] font-bold text-sm sm:text-base text-white truncate group-hover/card:text-[#E50914] transition-colors">
              {movie.title}
            </h3>

            {/* Quick Metadata */}
            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
              <span className="text-[#46d369] font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#46d369]" />
                {movie.match}
              </span>
              <span>•</span>
              <span className="font-mono text-gray-300">{movie.year}</span>
              <span>•</span>
              <span className="px-1 py-0.2 rounded border border-gray-600 text-[9px] font-mono">
                {movie.ageRating}
              </span>
              <span>•</span>
              <span className="truncate">{movie.duration}</span>
            </div>

            {/* Genres */}
            <p className="text-[11px] text-gray-400 mt-1 truncate">
              {movie.genres?.slice(0, 3).join(' • ')}
            </p>
          </div>

          {/* Action Buttons Sequence (Staggered fade & slide up on hover) */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0.85,
              y: isHovered ? 0 : 2
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto"
          >
            <div className="flex items-center gap-2">
              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPlayer(movie);
                }}
                data-cursor="play"
                title="Play Trailer / Movie"
                className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              </button>

              {/* Add to My List */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(movie.id);
                }}
                data-cursor="click"
                title={inList ? 'Remove from My List' : 'Add to My List'}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                  inList
                    ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914]'
                    : 'border-white/30 hover:border-white text-white/80 hover:text-white bg-white/5'
                }`}
              >
                {inList ? <Check className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4" />}
              </button>

              {/* Like / Heart with spring burst */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(movie.id);
                }}
                data-cursor="click"
                whileTap={{ scale: 1.35 }}
                title={liked ? 'Liked' : 'Like'}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                  liked
                    ? 'border-red-500 bg-red-500/20 text-red-500'
                    : 'border-white/30 hover:border-white text-white/80 hover:text-white bg-white/5'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </motion.button>
            </div>

            {/* Info / Modal Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(movie);
              }}
              data-cursor="click"
              title="More Info"
              className="w-8 h-8 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white bg-white/5 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
