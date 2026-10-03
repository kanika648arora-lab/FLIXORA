import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, ArrowLeft, Volume2, VolumeX, RotateCcw, RotateCw,
  Maximize, Minimize, Settings, FastForward, Check, Subtitles, HelpCircle
} from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function VideoPlayer() {
  const { activeWatchMovie, activeEpisode, closePlayer, updateProgress } = useMovie();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('4K Ultra HD');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);

  if (!activeWatchMovie) return null;

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
      }
    }, 3200);
  }, [isPlaying]);

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimer();
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimer]);

  // Keyboard shortcuts (Space = Play/Pause, Left/Right = Skip 10s, F = Fullscreen, Esc = Close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        skipTime(-10);
      } else if (e.code === 'ArrowRight') {
        skipTime(10);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'Escape' && !document.fullscreenElement) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);

    // Update progress in history
    if (videoRef.current.duration) {
      const progressPercent = Math.floor((videoRef.current.currentTime / videoRef.current.duration) * 100);
      const remainingSec = Math.floor(videoRef.current.duration - videoRef.current.currentTime);
      const remainingStr = `${Math.floor(remainingSec / 60)}m remaining`;
      updateProgress(activeWatchMovie.id, progressPercent, activeEpisode?.title || "Feature Film", remainingStr);
    }
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (amount) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + amount));
    resetControlsTimer();
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    if (videoRef.current.muted) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = volume || 0.85;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setShowSettingsMenu(false);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    closePlayer();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={activeWatchMovie.videoUrl}
        poster={activeWatchMovie.backdropUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Subtitles Overlay */}
      {subtitlesEnabled && isPlaying && (
        <div className="absolute bottom-28 left-0 right-0 pointer-events-none text-center px-4 z-20">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-black/80 text-white font-medium text-base sm:text-lg tracking-wide border border-white/10 shadow-lg">
            [Suspenseful cinematic orchestral score playing]
          </span>
        </div>
      )}

      {/* Cinematic Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar with Back Arrow & Titles */}
            <div className="p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClose}
                  data-cursor="click"
                  title="Back to Browse (Esc)"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md border border-white/15"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="font-['Syne'] font-extrabold text-lg sm:text-xl text-white tracking-wide">
                    {activeWatchMovie.title}
                  </h2>
                  {activeEpisode ? (
                    <p className="text-xs text-red-400 font-semibold tracking-wide">
                      Ep {activeEpisode.epNumber}: {activeEpisode.title}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      {activeWatchMovie.quality} • {activeWatchMovie.audio}
                    </p>
                  )}
                </div>
              </div>

              {/* Quality & Brand Badge */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#E50914]/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold">
                  {quality}
                </span>
                <span className="font-['Syne'] font-black text-white text-lg tracking-[0.2em] hidden sm:block">
                  FLIX<span className="text-[#E50914]">ORA</span>
                </span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-auto flex flex-col gap-3">
              {/* Cinematic Progress Bar */}
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="relative w-full h-2.5 hover:h-4 bg-white/20 rounded-full cursor-pointer transition-all flex items-center group/progress overflow-visible"
              >
                {/* Buffered / Played Line */}
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#ff2b38] rounded-full relative shadow-[0_0_15px_#E50914]"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Seeker Scrubber Dot */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between pt-1">
                {/* Left Controls: Play, Skip, Volume, Timer */}
                <div className="flex items-center gap-3 sm:gap-5">
                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    data-cursor="click"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>

                  {/* Skip -10s */}
                  <button
                    onClick={() => skipTime(-10)}
                    data-cursor="click"
                    title="Rewind 10 seconds"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  {/* Skip +10s */}
                  <button
                    onClick={() => skipTime(10)}
                    data-cursor="click"
                    title="Fast forward 10 seconds"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>

                  {/* Volume Slider & Mute Toggle */}
                  <div className="flex items-center gap-2 group/vol">
                    <button
                      onClick={toggleMute}
                      data-cursor="click"
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-24 h-1 accent-[#E50914] bg-white/30 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Time Counter */}
                  <span className="text-xs font-mono text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls: Subtitles, Speed/Quality, Fullscreen */}
                <div className="flex items-center gap-3 sm:gap-4 relative">
                  {/* Subtitles Button */}
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    data-cursor="click"
                    title="Subtitles (CC)"
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      subtitlesEnabled ? 'text-red-400 bg-red-500/20' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Subtitles className="w-5 h-5" />
                  </button>

                  {/* Settings / Speed Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                      data-cursor="click"
                      title="Playback Speed & Settings"
                      className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    {/* Settings Popover */}
                    {showSettingsMenu && (
                      <div className="absolute bottom-12 right-0 w-52 glass-panel rounded-2xl p-3 shadow-2xl border border-white/15 z-50 text-xs">
                        <span className="text-gray-400 uppercase font-bold tracking-wider block mb-2 px-1">
                          Playback Speed
                        </span>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                              playbackSpeed === s ? 'bg-[#E50914]/20 text-[#E50914] font-bold' : 'hover:bg-white/10 text-gray-300'
                            }`}
                          >
                            <span>{s === 1 ? 'Normal (1x)' : `${s}x`}</span>
                            {playbackSpeed === s && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    data-cursor="click"
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
