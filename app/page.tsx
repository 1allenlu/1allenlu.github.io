import { About } from '@/components/About';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { Contact } from '@/components/Contact';
import { Education } from '@/components/Education';
import { Experience } from '@/components/Experience';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';

export default function Home() {
  return (
    <>
      <BackgroundCanvas />
      <Nav />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
