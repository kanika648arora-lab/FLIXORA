import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Info, RotateCcw } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function ContinueWatchingRail({ movies = [] }) {
  const { openPlayer, openModal } = useMovie();
  const railRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!movies || movies.length === 0) return null;

  const checkScroll = () => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction) => {
    if (!railRef.current) return;
    const offset = railRef.current.clientWidth * 0.75;
    railRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="relative py-6 sm:py-8 my-2 select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 rounded-full bg-[#E50914]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E50914] font-bold">
              PICK UP WHERE YOU LEFT OFF
            </span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Continue Watching
          </h2>
        </div>

        {/* Rail Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            data-cursor="click"
            className={`w-9 h-9 rounded-full border border-white/10 glass-panel flex items-center justify-center transition-all ${
              canScrollLeft ? 'text-white hover:bg-white/20 hover:scale-105 cursor-pointer' : 'text-gray-600 opacity-40 cursor-default'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            data-cursor="click"
            className={`w-9 h-9 rounded-full border border-white/10 glass-panel flex items-center justify-center transition-all ${
              canScrollRight ? 'text-white hover:bg-white/20 hover:scale-105 cursor-pointer' : 'text-gray-600 opacity-40 cursor-default'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Rail Container */}
      <div className="relative group">
        <div
          ref={railRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 md:px-12 py-4"
        >
          {movies.map((movie) => {
            const isHovered = hoveredId === movie.id;
            const progress = movie.progress || 60;

            return (
              <div
                key={movie.id}
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor="watch"
                className="relative shrink-0 w-[270px] sm:w-[320px] md:w-[360px] h-[220px] sm:h-[240px] rounded-2xl glass-card overflow-hidden shadow-xl border border-white/10 group/item cursor-pointer transition-all duration-300 hover:scale-105 hover:border-red-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(229,9,20,0.3)]"
              >
                {/* Backdrop / Video Image */}
                <div className="relative w-full h-[65%] overflow-hidden bg-zinc-900">
                  <img
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                  />

                  {/* Video preview on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-black"
                      >
                        <video
                          src={movie.trailerUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Center Resume Overlay Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      openPlayer(movie);
                    }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 group-hover/item:bg-black/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 group-hover/item:bg-white text-black flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Progress Bar at the bottom of the video window */}
                  <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20 z-20 overflow-hidden">
                    <div
                      className="h-full bg-[#E50914] shadow-[0_0_10px_#E50914]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 flex items-center justify-between h-[35%] bg-[#121217]">
                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="font-['Syne'] font-bold text-sm sm:text-base text-white truncate group-hover/item:text-[#E50914] transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {movie.currentEpisode || 'S1:E2'} • <span className="text-gray-300 font-medium">{movie.remainingTime || '28m remaining'}</span>
                    </p>
                  </div>

                  {/* Quick Detail Info Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(movie);
                    }}
                    title="Movie details"
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-white text-gray-300 hover:text-white flex items-center justify-center shrink-0 hover:scale-110 transition-all cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
