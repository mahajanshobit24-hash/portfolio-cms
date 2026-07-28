import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Target, Award, Heart } from 'lucide-react';
import { personalInfo, strengths } from '../data/portfolioData';

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">About Me</span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Know Who <span className="text-gradient">I Am</span></h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <User className="text-blue-400" /> Professional Summary
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">{personalInfo.summary}</p>

              <div className="grid grid-cols-2 gap-4">
                {strengths.slice(0, 4).map((strength, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-300">{strength.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Target, label: "Goal Oriented", desc: "Focused on achieving results" },
              { icon: Award, label: "Quality Work", desc: "Delivering excellence always" },
              { icon: Heart, label: "Passionate", desc: "Love what I do" },
              { icon: User, label: "Client First", desc: "Your success is mine" }
            ].map((item, index) => (
              <div key={index} className="glass-card p-6 hover-lift text-center">
                <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-1">{item.label}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;