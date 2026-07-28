import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, BookOpen, School, Laptop, Shield } from 'lucide-react';
import { education } from '../data/portfolioData';

const iconMap = { GraduationCap, BookOpen, School, Laptop, Shield };

const Education = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-teal-500 to-teal-600'
  };

  return (
    <section id="education" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Academic Background</span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">My <span className="text-gradient">Education</span></h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((edu, index) => {
            const Icon = iconMap[edu.icon];
            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover-lift relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[edu.color]} opacity-10 rounded-full blur-2xl`} />

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[edu.color]} flex items-center justify-center text-white flex-shrink-0`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">{edu.degree}</h3>
                    <p className="text-slate-400 text-sm mb-2">{edu.institution}</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      edu.status === 'In Progress' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {edu.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;