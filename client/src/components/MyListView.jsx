import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, Heart, Film, Sparkles } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function MyListView() {
  const { myListMovies, removeFromMyList, openPlayer, openModal, setActiveCategory } = useMovie();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-4 rounded-full bg-[#E50914]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E50914] font-bold">
              SAVED WATCHLIST
            </span>
          </div>
          <h1 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            My List
          </h1>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          {myListMovies.length} {myListMovies.length === 1 ? 'Title' : 'Titles'} Saved
        </div>
      </div>

      {/* Grid of Saved Movies */}
      {myListMovies.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {myListMovies.map((movie) => (
              <motion.div
                layout
                key={movie.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.65,
                  rotate: -8,
                  transition: { duration: 0.35, ease: 'easeInOut' }
                }}
                onClick={() => openModal(movie)}
                data-cursor="watch"
                className="relative rounded-2xl overflow-hidden glass-card border border-white/10 group cursor-pointer hover:border-red-500/40 hover:scale-105 transition-all shadow-xl"
              >
                {/* Poster */}
                <div className="relative h-64 sm:h-76 overflow-hidden bg-zinc-900">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlayer(movie);
                      }}
                      data-cursor="play"
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </button>

                    {/* Animated Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromMyList(movie.id);
                      }}
                      data-cursor="click"
                      title="Remove from My List"
                      className="w-10 h-10 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-[#13131b]">
                  <h4 className="font-['Syne'] font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#E50914] transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                    <span className="text-[#46d369] font-bold">{movie.match}</span>
                    <span>•</span>
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span className="font-mono">{movie.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-gray-500" />
          </div>
          <h3 className="font-['Syne'] text-xl font-bold text-gray-300">Your List is Empty</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mb-6">
            Browse through trending titles and click "+ Add to List" to curate your personalized cinema watchlist.
          </p>
          <button
            onClick={() => setActiveCategory('HOME')}
            className="px-6 py-2.5 rounded-full bg-[#E50914] hover:bg-[#ff2535] text-white text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:scale-105"
          >
            Explore Cinema
          </button>
        </div>
      )}
    </div>
  );
}
