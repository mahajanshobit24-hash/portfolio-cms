import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';
import { personalInfo } from '../data/portfolioData';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Available for Work
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Hi, I'm{' '}
              <span className="text-gradient">{personalInfo.name}</span>
            </h1>

            <div className="text-xl sm:text-2xl text-slate-400 mb-8 font-light">
              <span className="text-blue-400 font-medium">Telecaller</span>
              <span className="mx-3 text-slate-600">|</span>
              <span className="text-amber-400 font-medium">Customer Support</span>
              <span className="mx-3 text-slate-600">|</span>
              <span className="text-emerald-400 font-medium">Canva Designer</span>
              <span className="mx-3 text-slate-600">|</span>
              <span className="text-purple-400 font-medium">No-Code Developer</span>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
              {personalInfo.summary}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={18} className="text-blue-400" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={18} className="text-amber-400" />
                <a href={`tel:${personalInfo.phone}`} className="hover:text-white transition-colors">{personalInfo.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={18} className="text-emerald-400" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">{personalInfo.email}</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="contact" smooth={true} duration={500} offset={-80}>
                <button className="btn-primary flex items-center gap-2">
                  <Mail size={18} />
                  Get In Touch
                </button>
              </Link>
              <a href={`tel:${personalInfo.phone}`}>
                <button className="btn-outline flex items-center gap-2">
                  <Phone size={18} />
                  Call Me Now
                </button>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative Rings */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-amber-500/20 rounded-3xl blur-xl animate-pulse-slow" />

              <div className="relative glass-card p-8 max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  {/* <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-2xl shadow-blue-500/30">
                    {personalInfo.avatar}
                  </div> */}
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 overflow-hidden">
                    <img
                      src={personalInfo.avatar}
                      alt={personalInfo.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{personalInfo.name}</h2>
                  <p className="text-slate-400 text-sm mb-6">{personalInfo.title}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 w-full mb-6">
                    <div className="text-center p-3 rounded-xl bg-slate-800/50">
                      <div className="text-2xl font-bold text-blue-400">5+</div>
                      <div className="text-xs text-slate-500 mt-1">Years Exp.</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-800/50">
                      <div className="text-2xl font-bold text-amber-400">200+</div>
                      <div className="text-xs text-slate-500 mt-1">Clients</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-800/50">
                      <div className="text-2xl font-bold text-emerald-400">500+</div>
                      <div className="text-xs text-slate-500 mt-1">Designs</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {['LinkedIn', 'GitHub', 'Twitter', 'Instagram'].map((social) => (
                      <button
                        key={social}
                        onClick={() => alert(`${social} link coming soon!`)}
                        className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                        title={social}
                      >
                        <span className="text-xs font-bold">{social[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <Link to="about" smooth={true} duration={500} offset={-80}>
            <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
              <span className="text-sm">Scroll Down</span>
              <ChevronDown size={20} className="animate-bounce" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;