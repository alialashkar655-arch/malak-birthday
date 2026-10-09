import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  emoji: string;
}

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let pId = 0;
    const colors = ['#f43f6c', '#fe6d8f', '#ffa6b8', '#ffd0d9', '#e3a9b3'];
    const emojis = ['♡', '✨', '🌸', '💖'];

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Throttle particle creation
      if (Math.random() < 0.25) {
        const newParticle: Particle = {
          id: pId++,
          x: e.clientX + (Math.random() * 16 - 8),
          y: e.clientY + (Math.random() * 16 - 8),
          size: Math.random() * 8 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        };

        setParticles(prev => [...prev.slice(-12), newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Fade particles
    const interval = setInterval(() => {
      setParticles(prev => prev.slice(1));
    }, 150);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Floating particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute select-none transition-all duration-700 ease-out font-serif pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            color: p.color,
            transform: 'translate(-50%, -50%)',
            opacity: 0.8
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Main cursor dot */}
      <div
        className="fixed w-3 h-3 rounded-full bg-rose-400/80 pointer-events-none transition-transform duration-75 ease-out shadow-sm -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </div>
  );
};
