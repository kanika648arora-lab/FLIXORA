import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function Top10Rail({ movies = [] }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const top10List = movies
    .filter(m => m.top10Rank != null)
    .sort((a, b) => a.top10Rank - b.top10Rank)
    .slice(0, 10);

  if (top10List.length === 0) return null;

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
              GLOBAL RANKINGS
            </span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Top 10 Movies & Series Today
          </h2>
        </div>

        {/* Controls */}
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

      {/* Rail */}
      <div className="relative group">
        <div
          ref={railRef}
          onScroll={checkScroll}
          className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 md:px-12 py-6"
        >
          {top10List.map((movie, index) => {
            const rank = movie.top10Rank || (index + 1);

            return (
              <div key={movie.id} className="relative flex items-center shrink-0">
                {/* Massive Number Outline */}
                <div className="relative select-none pointer-events-none -mr-8 sm:-mr-12 z-0 font-['Bebas_Neue'] text-[140px] sm:text-[180px] md:text-[210px] leading-none font-black text-transparent [-webkit-text-stroke:4px_#3a3a48] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] opacity-90 transition-transform duration-300">
                  {rank}
                </div>

                {/* Movie Card */}
                <div className="relative z-10">
                  <MovieCard movie={movie} index={index} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
