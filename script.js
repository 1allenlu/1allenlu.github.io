document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Nav goes translucent + blurred once the page scrolls past the hero
    function updateHeader() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // Section reveals: fade + rise in as each element crosses into view.
    // Elements stay visible once revealed (no re-hiding on scroll back up).
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (revealTargets.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealTargets.forEach(el => el.classList.add('in-view'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

            revealTargets.forEach(el => observer.observe(el));
        }
    }

    // Nav active-link highlighting, driven by the same scroll tick as the header
    const navSections = document.querySelectorAll('main section[id]');
    function updateActiveNav() {
        const viewportH = window.innerHeight;
        let activeId = null;
        navSections.forEach(s => {
            if (s.getBoundingClientRect().top <= viewportH * 0.35) {
                activeId = s.id;
            }
        });
        if (activeId) {
            navLinkEls.forEach(a => {
                a.classList.toggle('nav-active', a.getAttribute('href') === `#${activeId}`);
            });
        }
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Subtle hero parallax: the glow drifts slower than the page scrolls
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow && !reduceMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                heroGlow.style.transform = `translateX(-50%) translateY(${window.scrollY * 0.15}px)`;
                ticking = false;
            });
        }, { passive: true });
    }

    // Smooth scroll for in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
                return;
            }
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    });

    // Theme toggle: explicit choice overrides the system preference and is
    // remembered across visits (the inline script in <head> applies it
    // before first paint, so there's no flash of the wrong theme on load).
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', function () {
            const isOpen = navLinksContainer.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinksContainer.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Hero subtitle: cross-fade through roles (starts from the static
    // fallback text already in the markup, so it degrades gracefully
    // without JS or with reduced motion)
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle && subtitle.dataset.words && !reduceMotion) {
        const words = subtitle.dataset.words.split(',');
        let wordIndex = 0;
        subtitle.style.transition = 'opacity 500ms cubic-bezier(0.42, 0, 0.58, 1)';

        setInterval(() => {
            subtitle.style.opacity = '0';
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                subtitle.textContent = words[wordIndex];
                subtitle.style.opacity = '1';
            }, 500);
        }, 2600);
    }

    // Collapse long tag lists (skills + project tech) behind a "+N more" toggle
    const TAG_LIMIT = 5;
    document.querySelectorAll('.skill-tags, .project-tech').forEach(container => {
        const tags = Array.from(container.children);
        if (tags.length <= TAG_LIMIT) return;

        tags.slice(TAG_LIMIT).forEach(tag => tag.classList.add('tag-hidden'));

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'tag-toggle visible';
        const hiddenCount = tags.length - TAG_LIMIT;
        toggle.textContent = `+${hiddenCount} more`;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.dataset.expanded === 'true';
            tags.slice(TAG_LIMIT).forEach(tag => tag.classList.toggle('tag-hidden', isExpanded));
            toggle.dataset.expanded = String(!isExpanded);
            toggle.textContent = isExpanded ? `+${hiddenCount} more` : 'Show less';
        });

        container.insertAdjacentElement('afterend', toggle);
    });

    // Logo scrolls to top
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }
});
