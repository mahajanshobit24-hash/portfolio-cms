import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Education from '../components/Education';
import Stats from '../components/Stats';
import Languages from '../components/Languages';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Skills />
      <Experience />
      <Services />
      <Education />
      <Languages />
      <Contact />
    </>
  );
};

export default Home;