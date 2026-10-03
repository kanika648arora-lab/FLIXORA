import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Info, Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMovie } from '../context/MovieContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { heroMovie, isInMyList, toggleMyList, openPlayer, openModal } = useMovie();
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const heroContainerRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  const inList = isInMyList(heroMovie?.id);

  // GSAP ScrollTrigger for Parallax, Scale, Blur and Upward Motion on Scroll
  useEffect(() => {
    if (!heroContainerRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll animation
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        },
        scale: 1.15,
        yPercent: 18,
        filter: 'blur(8px) brightness(0.6)',
        ease: 'none'
      });

      // Text fade & rise
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: '60% top',
            scrub: 1
          },
          y: -80,
          opacity: 0,
          ease: 'power1.out'
        });
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, [heroMovie]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Title word-by-word animation variants
  const titleWords = heroMovie?.title ? heroMovie.title.split(' ') : ['FLIXORA', 'ORIGINAL'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div
      ref={heroContainerRef}
      className="relative w-full h-[95vh] min-h-[700px] overflow-hidden select-none bg-black flex items-center"
    >
      {/* Background Cinematic Movie Trailer Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src={heroMovie?.trailerUrl || heroMovie?.videoUrl}
          poster={heroMovie?.backdropUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out will-change-transform"
        />

        {/* Fallback poster until video buffers */}
        {!videoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-sm transition-opacity duration-1000"
            style={{ backgroundImage: `url(${heroMovie?.backdropUrl})` }}
          />
        )}

        {/* Cinematic Multi-layered Gradients */}
        {/* Left readable shadow for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent w-full md:w-[65%] pointer-events-none" />
        {/* Bottom fade into movie rails */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent pointer-events-none" />
        {/* Top subtle vignette */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#070709]/80 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Left aligned */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 w-full pt-16 md:pt-20 flex flex-col justify-center"
      >
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Brand Pill */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-md mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-400">
              FLIXORA EXCLUSIVE PREMIERE
            </span>
          </motion.div>

          {/* Title Animated Word-by-Word */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            {titleWords.map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block mr-3">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg sm:text-xl font-medium text-gray-200 tracking-wide mb-3 italic"
          >
            "{heroMovie?.tagline}"
          </motion.p>

          {/* Metadata Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold mb-5 text-gray-300"
          >
            <span className="text-[#46d369] font-bold tracking-wide flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#46d369]" />
              {heroMovie?.match || '99% Match'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10 text-xs font-mono">
              {heroMovie?.year || '2026'}
            </span>
            <span className="px-1.5 py-0.5 rounded border border-gray-500 text-gray-300 text-xs font-mono">
              {heroMovie?.ageRating || '16+'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#E50914]/20 text-[#ff4b58] border border-red-500/30 text-xs font-mono font-bold">
              {heroMovie?.quality || '4K Ultra HD'}
            </span>
            <span className="hidden sm:inline-block text-gray-400 font-mono text-xs">
              {heroMovie?.duration}
            </span>
            <span className="text-gray-400 hidden sm:inline-block">•</span>
            <span className="text-gray-300">
              {heroMovie?.genres?.slice(0, 3).join(' • ')}
            </span>
          </motion.div>

          {/* Description Sliding Up */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl font-light"
          >
            {heroMovie?.description}
          </motion.p>

          {/* Action Buttons Staggered */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Play Button */}
            <button
              onClick={() => openPlayer(heroMovie)}
              data-cursor="play"
              className="px-7 py-3 rounded-full bg-white text-black font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2.5 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer group"
            >
              <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
              <span>Play Now</span>
            </button>

            {/* My List Toggle */}
            <button
              onClick={() => toggleMyList(heroMovie?.id)}
              data-cursor="click"
              className={`px-6 py-3 rounded-full border text-sm sm:text-base font-bold tracking-wide flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
                inList
                  ? 'bg-white/20 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {inList ? <Check className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5" />}
              <span>{inList ? 'In My List' : 'Add to List'}</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={() => openModal(heroMovie)}
              data-cursor="click"
              className="px-5 py-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-white text-sm sm:text-base font-semibold flex items-center gap-2 transition-all hover:scale-105 backdrop-blur-md cursor-pointer"
            >
              <Info className="w-5 h-5 text-gray-300" />
              <span>Details</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Right Controls: Audio Mute & Age Rating Badge */}
      <div className="absolute right-6 sm:right-12 bottom-20 z-20 flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={toggleAudio}
          data-cursor="click"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="w-11 h-11 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:border-white hover:bg-black/70 hover:scale-110 transition-all cursor-pointer shadow-lg group"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-300 group-hover:text-white" />
          ) : (
            <div className="relative">
              <Volume2 className="w-5 h-5 text-red-400 group-hover:text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
          )}
        </button>

        {/* Age Rating Pill */}
        <div className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md border-l-4 border-red-600 text-xs font-mono font-bold tracking-wider text-gray-200 uppercase rounded-r shadow-lg">
          {heroMovie?.ageRating || '16+'}
        </div>
      </div>
    </div>
  );
}
