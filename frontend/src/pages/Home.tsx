import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/sections/Header';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Countdown from '@/sections/Countdown';
import Welcome from '@/sections/Welcome';
import Speakers from '@/sections/Speakers';
import Schedule from '@/sections/Schedule';
import Registration from '@/sections/Registration';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { user, login, logout } = useAuth();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="relative bg-white">
      <Header user={user} login={login} logout={logout} />
      <Navigation />

      <main>
        <Hero />
        <Countdown />
        <Welcome />
        <Speakers />
        <Schedule />
        <Registration />
      </main>

      <Footer />
    </div>
  );
}