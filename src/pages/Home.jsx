// Remove this: import React from 'react';
import '../Home.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Categories from '../components/Categories';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <HowItWorks />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}