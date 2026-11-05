'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');

    const sections = document.querySelectorAll<HTMLElement>('main section[id]');
    function update() {
      setScrolled(window.scrollY > 20);
      let current: string | null = null;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section.id;
      });
      setActive(current);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setIsDark(!isDark);
  }

  return (
    <header className={clsx(scrolled && 'scrolled')}>
      <nav className="container">
        <a href="#top" className="logo">
          Allen Lu
        </a>
        <div className="nav-right">
          <ul className={clsx('nav-links', menuOpen && 'mobile-open')}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={clsx(active && link.href === `#${active}` && 'nav-active')}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sun className="theme-icon theme-icon-sun" aria-hidden strokeWidth={1.75} />
            <Moon className="theme-icon theme-icon-moon" aria-hidden strokeWidth={1.75} />
          </button>
          <button
            className={clsx('mobile-menu-toggle', menuOpen && 'active')}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
