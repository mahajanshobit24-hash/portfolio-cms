import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { languages } from '../data/portfolioData';

const Languages = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-16 bg-slate-900/30 border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-bold mb-2">Languages</h3>
          <p className="text-slate-400">Multilingual communication skills</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center hover-lift"
            >
              <h4 className="text-xl font-bold text-white mb-1">{lang.name}</h4>
              <p className="text-blue-400 text-sm font-medium mb-3">{lang.proficiency}</p>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${lang.level}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;