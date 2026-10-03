import React, { createContext, useContext, useState, useEffect } from 'react';
import { moviesData } from '../data/moviesData';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const { token } = useAuth();
  const [movies] = useState(moviesData);
  const [heroMovie, setHeroMovie] = useState(() => moviesData.find(m => m.featuredHero) || moviesData[0]);
  
  // My List
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem('flixora_mylist');
    return saved ? JSON.parse(saved) : ["flx-01", "flx-02", "flx-05", "flx-08", "flx-10"];
  });

  // Liked items
  const [likedList, setLikedList] = useState(() => {
    const saved = localStorage.getItem('flixora_likes');
    return saved ? JSON.parse(saved) : ["flx-01", "flx-08"];
  });

  // Watch History & Continue Watching
  const [watchHistory, setWatchHistory] = useState(() => {
    const saved = localStorage.getItem('flixora_history');
    return saved ? JSON.parse(saved) : [
      { movieId: "flx-02", progress: 72, currentEpisode: "S2:E4 'The Butterfly Anomaly'", remainingTime: "24m remaining" },
      { movieId: "flx-03", progress: 45, currentEpisode: "Feature Film", remainingTime: "1h 12m remaining" },
      { movieId: "flx-05", progress: 88, currentEpisode: "S1:E8 'The Singularity Gate'", remainingTime: "12m remaining" }
    ];
  });

  // Active overlays
  const [activeModalMovie, setActiveModalMovie] = useState(null);
  const [activeWatchMovie, setActiveWatchMovie] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('HOME');

  // Persistence
  useEffect(() => {
    localStorage.setItem('flixora_mylist', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('flixora_likes', JSON.stringify(likedList));
  }, [likedList]);

  useEffect(() => {
    localStorage.setItem('flixora_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  // Load from backend if available
  useEffect(() => {
    async function loadData() {
      try {
        const sectionsRes = await api.getAllSections(token);
        if (sectionsRes.success && sectionsRes.data) {
          // Sync backend data
        }
      } catch {
        // Fallback to local state
      }
    }
    loadData();
  }, [token]);

  const addToMyList = (movieId) => {
    if (!myList.includes(movieId)) {
      setMyList(prev => [...prev, movieId]);
    }
    try {
      api.addToMyList(movieId, token);
    } catch {}
  };

  const removeFromMyList = (movieId) => {
    setMyList(prev => prev.filter(id => id !== movieId));
    try {
      api.removeFromMyList(movieId, token);
    } catch {}
  };

  const toggleMyList = (movieId) => {
    if (myList.includes(movieId)) {
      removeFromMyList(movieId);
    } else {
      addToMyList(movieId);
    }
  };

  const isInMyList = (movieId) => myList.includes(movieId);

  const toggleLike = (movieId) => {
    if (likedList.includes(movieId)) {
      setLikedList(prev => prev.filter(id => id !== movieId));
    } else {
      setLikedList(prev => [...prev, movieId]);
    }
  };

  const isLiked = (movieId) => likedList.includes(movieId);

  const updateProgress = (movieId, progress, episode, remaining) => {
    setWatchHistory(prev => {
      const idx = prev.findIndex(item => item.movieId === movieId);
      const entry = {
        movieId,
        progress,
        currentEpisode: episode || "Feature Film",
        remainingTime: remaining || "Playing"
      };
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = entry;
        return updated;
      }
      return [entry, ...prev];
    });
  };

  const openModal = (movie) => {
    setActiveModalMovie(movie);
  };

  const closeModal = () => {
    setActiveModalMovie(null);
  };

  const openPlayer = (movie, episode = null) => {
    setActiveWatchMovie(movie);
    setActiveEpisode(episode);
    setActiveModalMovie(null);
  };

  const closePlayer = () => {
    setActiveWatchMovie(null);
    setActiveEpisode(null);
  };

  // Build reactive sections
  const continueWatchingMovies = watchHistory.map(h => {
    const movie = movies.find(m => m.id === h.movieId);
    if (!movie) return null;
    return {
      ...movie,
      progress: h.progress,
      currentEpisode: h.currentEpisode,
      remainingTime: h.remainingTime
    };
  }).filter(Boolean);

  const trendingMovies = movies.filter(m => m.trending);
  const popularMovies = movies.filter(m => m.type === 'movie' && m.rating >= 8.5);
  const topSeries = movies.filter(m => m.type === 'series');
  const newReleases = movies.filter(m => m.year >= 2026);
  const sciFiMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('cyberpunk')));
  const actionMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('espionage')));
  const horrorMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('horror') || g.toLowerCase().includes('mystery')));
  const comedyMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('comedy') || g.toLowerCase().includes('satire')));
  const animeMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('anime') || g.toLowerCase().includes('cyberpunk')));
  const dramaMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('drama') || g.toLowerCase().includes('history')));
  const myListMovies = movies.filter(m => myList.includes(m.id));

  return (
    <MovieContext.Provider value={{
      movies,
      heroMovie,
      setHeroMovie,
      myList,
      myListMovies,
      addToMyList,
      removeFromMyList,
      toggleMyList,
      isInMyList,
      likedList,
      toggleLike,
      isLiked,
      watchHistory,
      updateProgress,
      activeModalMovie,
      openModal,
      closeModal,
      activeWatchMovie,
      activeEpisode,
      openPlayer,
      closePlayer,
      isSearchOpen,
      setIsSearchOpen,
      activeCategory,
      setActiveCategory,
      sections: {
        continueWatching: continueWatchingMovies,
        trendingNow: trendingMovies,
        popularMovies,
        topSeries,
        newReleases,
        sciFi: sciFiMovies,
        action: actionMovies,
        horror: horrorMovies,
        comedy: comedyMovies,
        anime: animeMovies,
        drama: dramaMovies
      }
    }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  return useContext(MovieContext);
}
