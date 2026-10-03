import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Check, Heart, Volume2, VolumeX, Star, Film, Clock, Calendar, Users, Clapperboard, Sparkles } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function MovieModal() {
  const { activeModalMovie, closeModal, isInMyList, toggleMyList, isLiked, toggleLike, openPlayer, movies } = useMovie();
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'episodes' | 'similar'
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!activeModalMovie) return null;

  const inList = isInMyList(activeModalMovie.id);
  const liked = isLiked(activeModalMovie.id);

  // Recommendations: same genre or high rating
  const similarMovies = movies
    .filter(m => m.id !== activeModalMovie.id && m.genres.some(g => activeModalMovie.genres?.includes(g)))
    .slice(0, 6);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto no-scrollbar">
        {/* Backdrop Darkness with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl z-0 cursor-pointer"
        />

        {/* Expanding Modal Window */}
        <motion.div
          layoutId={`modal-card-${activeModalMovie.id}`}
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar glass-panel rounded-3xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(229,9,20,0.2)] bg-[#0f0f15]"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            data-cursor="click"
            title="Close (Esc)"
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video / Trailer Hero in Modal */}
          <div className="relative w-full h-[320px] sm:h-[420px] bg-black overflow-hidden">
            <video
              ref={videoRef}
              src={activeModalMovie.trailerUrl}
              poster={activeModalMovie.backdropUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover scale-102"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f15] via-[#0f0f15]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f15]/80 via-transparent to-transparent pointer-events-none" />

            {/* Title & Floating Primary Buttons over trailer */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
              <div className="max-w-xl">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E50914] bg-[#E50914]/20 px-2.5 py-1 rounded-full border border-red-500/30 backdrop-blur-md mb-2 inline-block">
                  {activeModalMovie.type === 'series' ? 'FLIXORA ORIGINAL SERIES' : 'FLIXORA FEATURE FILM'}
                </span>
                <h2 className="font-['Syne'] font-extrabold text-2xl sm:text-4xl text-white tracking-tight drop-shadow-lg">
                  {activeModalMovie.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 italic mt-1 font-medium">
                  "{activeModalMovie.tagline}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openPlayer(activeModalMovie)}
                  data-cursor="play"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-sm tracking-wider uppercase flex items-center gap-2 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => toggleMyList(activeModalMovie.id)}
                  data-cursor="click"
                  title={inList ? 'Remove from My List' : 'Add to My List'}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md ${
                    inList
                      ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914]'
                      : 'border-white/30 bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  {inList ? <Check className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => toggleLike(activeModalMovie.id)}
                  data-cursor="click"
                  title={liked ? 'Liked' : 'Like'}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md ${
                    liked
                      ? 'border-red-500 bg-red-500/20 text-red-500'
                      : 'border-white/30 bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  data-cursor="click"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  className="w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="px-6 pt-4 pb-2 border-b border-white/10 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-bold tracking-wide uppercase transition-colors relative cursor-pointer ${
                activeTab === 'overview' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
              )}
            </button>

            {activeModalMovie.episodes && (
              <button
                onClick={() => setActiveTab('episodes')}
                className={`pb-2 text-sm font-bold tracking-wide uppercase transition-colors relative cursor-pointer ${
                  activeTab === 'episodes' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Episodes ({activeModalMovie.episodes.length})
                {activeTab === 'episodes' && (
                  <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab('similar')}
              className={`pb-2 text-sm font-bold tracking-wide uppercase transition-colors relative cursor-pointer ${
                activeTab === 'similar' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              More Like This
              {activeTab === 'similar' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Metadata & Story */}
                <div className="md:col-span-2 space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-gray-300">
                    <span className="text-[#46d369] font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#46d369]" />
                      {activeModalMovie.match}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                      {activeModalMovie.year}
                    </span>
                    <span className="px-1.5 py-0.5 rounded border border-gray-600 text-gray-300 font-mono">
                      {activeModalMovie.ageRating}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E50914]/20 text-[#ff4d5a] border border-red-500/30 font-bold font-mono">
                      {activeModalMovie.quality}
                    </span>
                    <span className="text-gray-400">{activeModalMovie.duration}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">
                      {activeModalMovie.audio || 'Dolby Atmos'}
                    </span>
                  </div>

                  {/* Synopsis */}
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light">
                    {activeModalMovie.description}
                  </p>

                  {/* Technical & Audio highlights */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 text-xs text-gray-300">
                    <Sparkles className="w-5 h-5 text-[#E50914] shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Cinematic Master Audio & Visuals</span>
                      <span>Encoded with dynamic HDR10+ luminance and lossless object-based audio mixing.</span>
                    </div>
                  </div>
                </div>

                {/* Right: Credits, Director, Cast */}
                <div className="space-y-4 text-xs border-t md:border-t-0 md:border-l border-white/10 md:pl-6 pt-4 md:pt-0">
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider block mb-1 font-bold">Director</span>
                    <p className="text-white font-medium">{activeModalMovie.director || 'Studio Production'}</p>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase tracking-wider block mb-1 font-bold">Cast</span>
                    <p className="text-gray-300 leading-relaxed font-medium">
                      {activeModalMovie.cast ? activeModalMovie.cast.join(', ') : 'Marcus Chen, Elena Rostova, Tariq Al-Mansoor'}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase tracking-wider block mb-1 font-bold">Genres</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeModalMovie.genres?.map((g) => (
                        <span key={g} className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[11px]">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Episodes Tab (For Series) */}
            {activeTab === 'episodes' && activeModalMovie.episodes && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 mb-2 text-xs text-gray-400">
                  <span>Season 1</span>
                  <span>{activeModalMovie.episodes.length} Episodes</span>
                </div>

                {activeModalMovie.episodes.map((ep) => (
                  <div
                    key={ep.epNumber}
                    onClick={() => openPlayer(activeModalMovie, ep)}
                    className="p-3 rounded-2xl hover:bg-white/10 border border-white/5 flex items-center gap-4 cursor-pointer transition-all group"
                  >
                    <span className="text-base font-bold text-gray-500 group-hover:text-white w-6 text-center font-mono">
                      {ep.epNumber}
                    </span>

                    <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                      <img
                        src={activeModalMovie.backdropUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 fill-white text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                          {ep.title}
                        </h4>
                        <span className="text-xs font-mono text-gray-400 shrink-0 ml-2">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{ep.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* More Like This Tab */}
            {activeTab === 'similar' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarMovies.map((similar) => (
                  <div
                    key={similar.id}
                    onClick={() => openPlayer(similar)}
                    className="rounded-2xl overflow-hidden glass-card border border-white/10 group cursor-pointer hover:border-red-500/40 transition-all hover:scale-102"
                  >
                    <div className="relative h-32 sm:h-36 overflow-hidden">
                      <img
                        src={similar.backdropUrl || similar.posterUrl}
                        alt={similar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                        {similar.duration}
                      </div>
                    </div>
                    <div className="p-3 bg-[#13131a]">
                      <h4 className="font-['Syne'] font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#E50914] transition-colors">
                        {similar.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                        <span className="text-[#46d369] font-bold">{similar.match}</span>
                        <span>•</span>
                        <span>{similar.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
