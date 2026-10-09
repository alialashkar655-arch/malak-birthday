import React from 'react';
import { Heart, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  recipientName: string;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ recipientName, onOpenAdmin }) => {
  return (
    <footer className="py-14 border-t border-rose-200/60 bg-white/40 text-center px-4">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-3">
        <div className="flex items-center gap-1.5 text-rose-500">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
          <Sparkles className="w-4 h-4 text-rose-400" />
        </div>

        <p className="font-serif text-base sm:text-lg text-rose-950 font-semibold">
          Made with all my love, just for {recipientName}. ♡
        </p>

        <p className="text-xs text-rose-600/70 font-sans">
          November 20, 2026 • Forever my favorite person in the world
        </p>

        {/* Discreet admin link */}
        <div className="pt-4">
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-[11px] text-rose-400/80 hover:text-rose-700 transition-colors py-1 px-3 rounded-full hover:bg-rose-50/80 border border-transparent hover:border-rose-200"
          >
            <Lock className="w-3 h-3" />
            <span>Admin & CMS Settings</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
