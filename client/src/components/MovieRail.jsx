import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRail({ title, subtitle = 'FEATURED COLLECTION', movies = [], sectionId = '' }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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

  // Mouse drag support for smooth inertia
  const handleMouseDown = (e) => {
    if (!railRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - railRef.current.offsetLeft);
    setScrollLeftState(railRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !railRef.current) return;
    e.preventDefault();
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag multiplier
    railRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section id={sectionId} className="relative py-6 sm:py-8 my-2 select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 rounded-full bg-[#E50914]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E50914] font-bold">
              {subtitle}
            </span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {title}
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 md:px-12 py-6 scroll-smooth ${
            isDragging ? 'cursor-grabbing select-none' : ''
          }`}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${sectionId}-${movie.id}`}
              movie={movie}
              index={index}
              isPriority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
