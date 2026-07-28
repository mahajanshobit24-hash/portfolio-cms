import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">{personalInfo.name}</h3>
            <p className="text-slate-400 text-sm">{personalInfo.title}</p>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-400 transition-colors">{personalInfo.phone}</a>
            <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-400 transition-colors">{personalInfo.email}</a>
          </div>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg shadow-blue-500/25"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} {personalInfo.name}. Made with <Heart size={14} className="text-red-400 fill-red-400" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;