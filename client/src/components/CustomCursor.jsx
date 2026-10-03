import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrame = useRef();

  useEffect(() => {
    // Check if device has touch capability
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Inspect target elements
      const target = e.target;
      if (!target) return;

      const card = target.closest('[data-cursor="watch"]');
      const playBtn = target.closest('[data-cursor="play"]');
      const clickEl = target.closest('button, a, [data-cursor="click"]');

      if (playBtn) {
        setCursorType('play');
      } else if (card) {
        setCursorType('watch');
      } else if (clickEl) {
        setCursorType('click');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop
    const render = () => {
      const lerp = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;
      setCursorPos({ x: currentPos.current.x, y: currentPos.current.y });
      animFrame.current = requestAnimationFrame(render);
    };

    animFrame.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrame.current);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[999999] transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
        left: 0,
        top: 0
      }}
    >
      {cursorType === 'default' && (
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="absolute w-8 h-8 rounded-full border border-white/20 animate-ping opacity-25" />
        </div>
      )}

      {cursorType === 'watch' && (
        <div className="-translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-[#E50914] text-white text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center gap-1.5 backdrop-blur-sm animate-in zoom-in-75 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          WATCH
        </div>
      )}

      {cursorType === 'play' && (
        <div className="-translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black font-extrabold text-[10px] tracking-widest uppercase shadow-[0_0_25px_rgba(255,255,255,0.7)] flex items-center justify-center animate-in zoom-in-75 duration-150">
          PLAY
        </div>
      )}

      {cursorType === 'click' && (
        <div className="-translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-[2px] transition-all duration-150" />
      )}
    </div>
  );
}
