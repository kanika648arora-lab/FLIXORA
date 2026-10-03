import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider, useMovie } from './context/MovieContext';

// Components
import CinematicLoader from './components/CinematicLoader';
import CustomCursor from './components/CustomCursor';
import ParticlesAtmosphere from './components/ParticlesAtmosphere';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PersonalizedGreeting from './components/PersonalizedGreeting';
import ContinueWatchingRail from './components/ContinueWatchingRail';
import Top10Rail from './components/Top10Rail';
import MovieRail from './components/MovieRail';
import MyListView from './components/MyListView';
import MovieModal from './components/MovieModal';
import VideoPlayer from './components/VideoPlayer';
import SearchOverlay from './components/SearchOverlay';
import ProfileSelectorModal from './components/ProfileSelectorModal';
import AuthModal from './components/AuthModal';
import MobileBottomNav from './components/MobileBottomNav';

gsap.registerPlugin(ScrollTrigger);

function MainContent() {
  const { activeCategory, sections, movies } = useMovie();

  return (
    <main className="relative z-10 min-h-screen pb-24 md:pb-16 overflow-hidden">
      {activeCategory === 'MY LIST' ? (
        <MyListView />
      ) : activeCategory === 'MOVIES' ? (
        <div className="pt-24">
          <HeroSection />
          <MovieRail title="Blockbuster Movies" subtitle="FEATURE FILM SELECTION" movies={sections.popularMovies} sectionId="movies-pop" />
          <MovieRail title="Action & Explosive Thrillers" subtitle="HIGH ADRENALINE" movies={sections.action} sectionId="movies-action" />
          <MovieRail title="Sci-Fi & Cyberpunk Realities" subtitle="FUTURISTIC WORLDS" movies={sections.sciFi} sectionId="movies-scifi" />
          <MovieRail title="Psychological Horror & Mystery" subtitle="DARK & SUSPENSEFUL" movies={sections.horror} sectionId="movies-horror" />
        </div>
      ) : activeCategory === 'SERIES' ? (
        <div className="pt-24">
          <HeroSection />
          <MovieRail title="Binge-Worthy Series" subtitle="MULTI-SEASON SAGAS" movies={sections.topSeries} sectionId="series-top" />
          <MovieRail title="Epic Dramas & Historical Chronicles" subtitle="IMMERSE IN STORY" movies={sections.drama} sectionId="series-drama" />
          <MovieRail title="Anime & Groundbreaking Animation" subtitle="VISUAL MASTERPIECES" movies={sections.anime} sectionId="series-anime" />
        </div>
      ) : activeCategory === 'NEW & POPULAR' ? (
        <div className="pt-24">
          <HeroSection />
          <Top10Rail movies={movies} />
          <MovieRail title="2026 Fresh Releases" subtitle="JUST ADDED TO CATALOG" movies={sections.newReleases} sectionId="new-releases" />
          <MovieRail title="Trending Across the Globe" subtitle="MOST WATCHED TODAY" movies={sections.trendingNow} sectionId="trending" />
        </div>
      ) : (
        /* Standard Personalized Home */
        <>
          {/* Full-Screen Hero Section */}
          <HeroSection />

          {/* Personalized Greeting */}
          <PersonalizedGreeting />

          {/* Continue Watching Rail with Progress Bars */}
          <ContinueWatchingRail movies={sections.continueWatching} />

          {/* Top 10 Numbered Rail */}
          <Top10Rail movies={movies} />

          {/* Trending Now */}
          <MovieRail
            title="Trending Now"
            subtitle="CURRENT GLOBAL SENSATIONS"
            movies={sections.trendingNow}
            sectionId="trending-now"
          />

          {/* Sci-Fi & Cyberpunk Worlds */}
          <MovieRail
            title="Sci-Fi & Cyberpunk Realities"
            subtitle="FUTURISTIC ODYSSEYS"
            movies={sections.sciFi}
            sectionId="scifi-rail"
          />

          {/* Action & Espionage */}
          <MovieRail
            title="Action & Espionage"
            subtitle="HIGH STAKES CINEMA"
            movies={sections.action}
            sectionId="action-rail"
          />

          {/* Popular Movies */}
          <MovieRail
            title="Critically Acclaimed Movies"
            subtitle="AWARD WINNING MASTERPIECES"
            movies={sections.popularMovies}
            sectionId="popular-movies"
          />

          {/* Top Series */}
          <MovieRail
            title="Top Original Series"
            subtitle="MULTI-SEASON SAGAS"
            movies={sections.topSeries}
            sectionId="top-series"
          />

          {/* Anime & Animation */}
          <MovieRail
            title="Anime & Animated Marvels"
            subtitle="EXTRAORDINARY ARTISTRY"
            movies={sections.anime}
            sectionId="anime-rail"
          />

          {/* Horror & Thriller */}
          <MovieRail
            title="Horror & Deep Sea Thrillers"
            subtitle="CHILLING SUSPENSE"
            movies={sections.horror}
            sectionId="horror-rail"
          />

          {/* Comedy & Satire */}
          <MovieRail
            title="Comedy & Sharp Satires"
            subtitle="IRREVERENT & WITTY"
            movies={sections.comedy}
            sectionId="comedy-rail"
          />

          {/* Drama & Epics */}
          <MovieRail
            title="Historical Epics & Human Drama"
            subtitle="TIMELESS TALES"
            movies={sections.drama}
            sectionId="drama-rail"
          />
        </>
      )}

      {/* Cinematic Footer */}
      <footer className="mt-20 pt-16 pb-12 border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#E50914] flex items-center justify-center font-['Syne'] font-black text-white text-xs">
              F
            </div>
            <span className="font-['Syne'] font-black text-lg tracking-[0.25em] text-white">
              FLIX<span className="text-[#E50914]">ORA</span>
            </span>
            <span className="text-gray-500 text-xs hidden sm:inline">| Pure Cinematic Streaming Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span>4K Ultra HD</span>
            <span>•</span>
            <span>Dolby Vision</span>
            <span>•</span>
            <span>Dolby Atmos</span>
            <span>•</span>
            <span>Spatial Audio</span>
          </div>

          <p className="text-xs text-gray-500">
            &copy; 2026 FLIXORA Studios. Built for Vaibhav.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <MovieProvider>
        {/* Cinematic Intro Loader */}
        {!loadingComplete && (
          <CinematicLoader onComplete={() => setLoadingComplete(true)} />
        )}

        {/* Global Atmosphere & Interactive Cursor */}
        <CustomCursor />
        <ParticlesAtmosphere />

        {/* Sticky Glass Navbar */}
        <Navbar />

        {/* Main Application */}
        <MainContent />

        {/* Floating Modals and Fullscreen Overlays */}
        <MovieModal />
        <VideoPlayer />
        <SearchOverlay />
        <ProfileSelectorModal />
        <AuthModal />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </MovieProvider>
    </AuthProvider>
  );
}
