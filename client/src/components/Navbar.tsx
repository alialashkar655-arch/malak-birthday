import React, { useState } from 'react';
import { Heart, Sparkles, Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  recipientName: string;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ recipientName, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Our Story', href: '#our-story' },
    { label: 'Memories', href: '#gallery-section' },
    { label: 'Keepsake Book', href: '#photobook-section' },
    { label: 'Date Invitation', href: '#date-invitation-section' },
    { label: 'Love Letter', href: '#love-letters-section' },
    { label: 'Birthday 🎂', href: '#birthday-section' },
  ];

  const handleScroll = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-2 group text-rose-950 font-serif font-bold text-lg sm:text-xl tracking-tight"
        >
          <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </span>
          <span>Our Little Universe</span>
          <span className="font-handwriting text-rose-500 text-xl font-normal hidden sm:inline">
            for {recipientName} ♡
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleScroll(link.href)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-rose-800 hover:text-rose-950 hover:bg-rose-50 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side tools */}
        <div className="flex items-center gap-2">
          {/* Admin lock icon */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin panel access"
            title="Admin CMS Portal"
            className="w-8 h-8 rounded-full text-rose-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-rose-100 px-4 py-4 space-y-2 animate-fade-in shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleScroll(link.href)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-900 hover:bg-rose-50 transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
