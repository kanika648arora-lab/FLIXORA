import React from 'react';
import { Home, Search, Film, Heart, User } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const { activeCategory, setActiveCategory, setIsSearchOpen, myList } = useMovie();
  const { setIsProfileSelectorOpen, activeProfile } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-2 flex items-center justify-around select-none">
      {/* Home */}
      <button
        onClick={() => setActiveCategory('HOME')}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
          activeCategory === 'HOME' ? 'text-[#E50914]' : 'text-gray-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* Search */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-gray-400 active:text-white"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      {/* New & Popular */}
      <button
        onClick={() => setActiveCategory('NEW & POPULAR')}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
          activeCategory === 'NEW & POPULAR' ? 'text-[#E50914]' : 'text-gray-400'
        }`}
      >
        <Film className="w-5 h-5" />
        <span>New</span>
      </button>

      {/* My List */}
      <button
        onClick={() => setActiveCategory('MY LIST')}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors relative ${
          activeCategory === 'MY LIST' ? 'text-[#E50914]' : 'text-gray-400'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {myList.length > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#E50914] text-white rounded-full text-[8px] flex items-center justify-center font-bold">
              {myList.length}
            </span>
          )}
        </div>
        <span>My List</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setIsProfileSelectorOpen(true)}
        className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-gray-400 active:text-white"
      >
        <div
          className="w-5 h-5 rounded-full overflow-hidden border"
          style={{ borderColor: activeProfile?.color || '#E50914' }}
        >
          <img src={activeProfile?.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <span>Profile</span>
      </button>
    </div>
  );
}
