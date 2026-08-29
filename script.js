document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

    // Sections fade in once their top edge scrolls into view, and the nav
    // link highlights whichever section's top has passed the upper third of
    // the viewport. Both are driven by getBoundingClientRect() on every
    // scroll tick rather than IntersectionObserver's percent-of-area
    // threshold, which fails to ever fire for a section taller than the
    // viewport (e.g. the Projects timeline) since that percentage is never
    // reached.
    const revealSections = document.querySelectorAll('main section:not(.hero)');
    revealSections.forEach(s => s.classList.add('reveal-init'));
    const navSections = document.querySelectorAll('main section[id]');

    function updateOnScroll() {
        const scrollTop = window.scrollY;
        const viewportH = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - viewportH;

        if (scrollProgress) {
            scrollProgress.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
        }
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', scrollTop > 400);
        }
        if (header) {
            header.classList.toggle('scrolled', scrollTop > 20);
        }

        revealSections.forEach(s => {
            if (!s.classList.contains('animate-in') && s.getBoundingClientRect().top < viewportH * 0.92) {
                s.classList.add('animate-in');
            }
        });

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

    window.addEventListener('scroll', updateOnScroll);
    updateOnScroll();

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth scroll for in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinksContainer.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('active');
        });

        navLinksContainer.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // Ripple effect on buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Hero subtitle: rotate through roles (starts from the static fallback
    // text already in the markup, so it degrades gracefully without JS)
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle && subtitle.dataset.words) {
        const words = subtitle.dataset.words.split(',');
        subtitle.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            const current = words[wordIndex];
            if (!deleting) {
                charIndex++;
                if (charIndex > current.length) {
                    deleting = true;
                    setTimeout(tick, 1400);
                    return;
                }
            } else {
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            subtitle.textContent = current.slice(0, charIndex);
            subtitle.appendChild(cursor);
            setTimeout(tick, deleting ? 40 : 80);
        };

        setTimeout(tick, 800);
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Subtle cursor-tracked tilt on cards — kept small (±3deg) so it reads
    // as polish rather than a gimmick. Only engages on pointer devices;
    // touch screens simply never fire mousemove here.
    const TILT_MAX_DEG = 3;
    document.querySelectorAll('.role-card, .project-timeline-card, .skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateX = (-py * TILT_MAX_DEG * 2).toFixed(2);
            const rotateY = (px * TILT_MAX_DEG * 2).toFixed(2);
            card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
