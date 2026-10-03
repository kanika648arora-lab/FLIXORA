import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, User, LogOut, Heart, Sparkles, Check, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, activeProfile, switchProfile, profiles, logout, setIsAuthModalOpen, setIsProfileSelectorOpen } = useAuth();
  const { activeCategory, setActiveCategory, setIsSearchOpen, myList, movies, openPlayer } = useMovie();

  const navLinks = [
    { id: 'HOME', label: 'Home' },
    { id: 'MOVIES', label: 'Movies' },
    { id: 'SERIES', label: 'Series' },
    { id: 'NEW & POPULAR', label: 'New & Popular' },
    { id: 'MY LIST', label: 'My List', badge: myList.length > 0 ? myList.length : null }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, title: 'Neo Tokyo: Cyberpunk 2099', text: 'Now available in 4K Dolby Atmos', time: '1h ago', movieId: 'flx-01' },
    { id: 2, title: 'Chrono Shift Season 2', text: 'Episode 4 is trending #1 worldwide', time: '3h ago', movieId: 'flx-02' },
    { id: 3, title: 'The Abyssal Deep', text: 'Added to Trending Movies today', time: '5h ago', movieId: 'flx-04' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 select-none ${
          isScrolled
            ? 'glass-nav py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Left: Brand & Navigation */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo */}
            <button
              onClick={() => setActiveCategory('HOME')}
              data-cursor="click"
              className="flex items-center gap-1.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E50914] to-[#99000a] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-transform">
                <span className="font-['Syne'] font-black text-white text-base tracking-tighter">F</span>
              </div>
              <span className="font-['Syne'] font-black text-2xl tracking-[0.25em] text-white">
                FLIX<span className="text-[#E50914] drop-shadow-[0_0_12px_rgba(229,9,20,0.7)]">ORA</span>
              </span>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveCategory(link.id)}
                    data-cursor="click"
                    className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label}
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E50914] text-white font-bold">
                          {link.badge}
                        </span>
                      )}
                    </span>

                    {/* Smooth sliding active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions & User Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              data-cursor="click"
              title="Search movies, series, actors"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileMenuOpen(false);
                }}
                data-cursor="click"
                title="Notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/10 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Latest Releases</span>
                      <span className="text-[11px] text-[#E50914] font-medium">3 New</span>
                    </div>

                    <div className="divide-y divide-white/5 mt-2 max-h-72 overflow-y-auto no-scrollbar">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            const movie = movies.find(m => m.id === n.movieId);
                            if (movie) openPlayer(movie);
                            setIsNotificationsOpen(false);
                          }}
                          className="py-3 px-2 flex items-start gap-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Play className="w-4 h-4 text-[#E50914]" fill="#E50914" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-[#E50914] transition-colors truncate">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1">{n.text}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Auth */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  data-cursor="click"
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-105"
                    style={{ borderColor: activeProfile?.color || '#E50914' }}
                  >
                    <img
                      src={activeProfile?.avatar}
                      alt={activeProfile?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  data-cursor="click"
                  className="px-4 py-1.5 rounded-full bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff202e] shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              )}

              {/* Profile Menu Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-white/10 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Switch Profiles */}
                    <div className="px-3 py-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2">Switch Profile</p>
                      <div className="space-y-1.5">
                        {profiles.map((p) => {
                          const isCurrent = p.id === activeProfile?.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                switchProfile(p.id);
                                setIsProfileMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                isCurrent ? 'bg-white/15 text-white font-bold' : 'hover:bg-white/5 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                                <span>{p.name}</span>
                              </div>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-[#E50914]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileSelectorOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#E50914]" />
                        <span>Manage Profiles</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveCategory('MY LIST');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>My List ({myList.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of FLIXORA</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
