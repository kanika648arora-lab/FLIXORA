import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, Play, Film, Sparkles, Filter } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen, movies, openPlayer, openModal } = useMovie();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const genres = ['ALL', 'Sci-Fi', 'Action', 'Thriller', 'Drama', 'Anime', 'Comedy', 'Horror', '4K Ultra HD'];

  // Filter movies based on input and genre
  const filteredMovies = movies.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      (m.cast && m.cast.some(c => c.toLowerCase().includes(q))) ||
      (m.director && m.director.toLowerCase().includes(q));

    const matchesGenre =
      selectedGenre === 'ALL' ||
      (selectedGenre === '4K Ultra HD' && m.quality.includes('4K')) ||
      m.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-2xl overflow-y-auto no-scrollbar select-none">
        {/* Ambient Blurred Posters Backdrop */}
        <div className="fixed inset-0 pointer-events-none opacity-20 filter blur-3xl scale-110 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${movies[0]?.backdropUrl})` }}
          />
        </div>

        {/* Top Header & Search Input */}
        <div className="sticky top-0 z-30 w-full pt-8 pb-6 px-4 sm:px-8 md:px-12 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto relative flex items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-[#E50914]" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What are you watching tonight? (Titles, actors, genres...)"
                className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-[#E50914] text-white placeholder-gray-400 font-['Syne'] text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all shadow-2xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Close Search Overlay */}
            <button
              onClick={() => setIsSearchOpen(false)}
              data-cursor="click"
              title="Close search (Esc)"
              className="w-12 h-12 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Filter Genre Chips */}
          <div className="max-w-4xl mx-auto flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Grid */}
        <div className="flex-1 max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : 'Recommended For You'} ({filteredMovies.length})
            </p>
          </div>

          {filteredMovies.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
            >
              {filteredMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  onClick={() => {
                    openModal(movie);
                    setIsSearchOpen(false);
                  }}
                  data-cursor="watch"
                  className="rounded-2xl overflow-hidden glass-card border border-white/10 group cursor-pointer hover:border-red-500/40 hover:scale-105 transition-all shadow-xl"
                >
                  <div className="relative h-60 sm:h-72 overflow-hidden bg-zinc-900">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlayer(movie);
                          setIsSearchOpen(false);
                        }}
                        className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#13131b]">
                    <h4 className="font-['Syne'] font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#E50914] transition-colors">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span className="text-[#46d369] font-bold">{movie.match}</span>
                      <span>•</span>
                      <span>{movie.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
              <h3 className="font-['Syne'] text-xl font-bold text-gray-300">No titles match your search</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Try searching by a different title, genre like "Sci-Fi" or "Action", or explore our recommendations above.
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
