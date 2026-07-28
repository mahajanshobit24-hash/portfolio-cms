import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills } from '../data/portfolioData';

const SkillBar = ({ name, level, delay }) => {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">{name}</span>
        <span className="text-sm text-blue-400">{level}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const [activeTab, setActiveTab] = useState('customerService');
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const tabs = {
    customerService: { label: 'Customer Service', data: skills.customerService },
    graphicDesign: { label: 'Graphic Design', data: skills.graphicDesign },
    digitalMarketing: { label: 'Digital Marketing', data: skills.digitalMarketing },
    technical: { label: 'Technical', data: skills.technical }
  };

  return (
    <section id="skills" className="py-20 lg:py-32 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">My Expertise</span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Skills & <span className="text-gradient">Abilities</span></h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(tabs).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto glass-card p-8"
        >
          {tabs[activeTab].data.map((skill, index) => (
            <SkillBar key={skill.name} {...skill} delay={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;