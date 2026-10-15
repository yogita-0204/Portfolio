import React from 'react';
import { useTheme } from './theme/ThemeProvider';

import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Statement from './components/Statement';
import Metrics from './components/Metrics';
import Apparatus from './components/Apparatus';
import FieldWork from './components/FieldWork';
import Lab from './components/Lab';
import Exhibit from './components/Exhibit';
import CaseStudies from './components/CaseStudies';
import Credentials from './components/Credentials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Crosshair from './components/bits/Crosshair';
import ClickSpark from './components/bits/ClickSpark';

export default function App() {
  const { theme } = useTheme();

  return (
    <div className={`scope t-${theme} relative min-h-screen`}>
      <Crosshair />
      <ClickSpark />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Statement />
        <Metrics />
        <Apparatus />
        <FieldWork />
        <Lab />
        <Exhibit />
        <CaseStudies />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
