'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import ProjectShowcase from './components/ProjectShowcase';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import Stats from './components/Stats';
import Process from './components/Process';
import Insights from './components/Insights';
import ClientInquiries from './components/ClientInquiries';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* Floating decorative elements */}
      <div className="floating-elements">
        <div className="floating-el"></div>
        <div className="floating-el"></div>
        <div className="floating-el"></div>
      </div>

      <CustomCursor />

      <SmoothScroll>
        <main>
          <Navbar />
          <Hero />
          <Philosophy />
          <ProjectShowcase />
          <Services />
          <Testimonials />
          <Partners />
          <Stats />
          <Process />
          <Insights />
          <ClientInquiries />
          <Footer />
          <ScrollToTop />
        </main>
      </SmoothScroll>
    </>
  );
}
