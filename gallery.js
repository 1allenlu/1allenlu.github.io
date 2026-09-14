// Gallery JavaScript — all features
document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Config
    const config = {
        currentImageIndex: 0,
        allImages: [],
        visibleImages: []
    };

    // Photo data
    const photoData = [
        { src: 'assets/gallery/photo1.jpg',  title: 'Surfers at Sunset',   description: 'Golden hour on the Pacific.' },
        { src: 'assets/gallery/photo2.jpg',  title: 'Night Drive',          description: 'A JDM sedan under neon.' },
        { src: 'assets/gallery/photo3.jpg',  title: 'Coastal Sunset',       description: 'Sun meets the horizon.' },
        { src: 'assets/gallery/photo4.jpg',  title: 'Harbor at Dusk',       description: 'Boats drifting home for the night.' },
        { src: 'assets/gallery/photo5.jpg',  title: 'Airborne',             description: 'Catching air on a late afternoon.' },
        { src: 'assets/gallery/photo6.jpg',  title: 'Clipper City',         description: 'A tall ship crossing the harbor.' },
        { src: 'assets/gallery/photo7.jpg',  title: 'Turret & Sky',         description: "Old Quebec's rooftops." },
        { src: 'assets/gallery/photo8.jpg',  title: 'Snow Day',             description: 'Old Quebec under fresh snow.' },
        { src: 'assets/gallery/photo9.jpg',  title: 'Chateau Frontenac',    description: "Quebec City's landmark hotel." },
        { src: 'assets/gallery/photo10.jpg', title: 'Cherry Blossoms',      description: 'The Jefferson Memorial in bloom.' },
        { src: 'assets/gallery/photo11.jpg', title: 'Fuji Through the Wires', description: 'Mount Fuji on a hazy morning.' },
        { src: 'assets/gallery/photo12.jpg', title: 'Blossoms & Friends',   description: 'A huddle under the cherry trees.' },
        { src: 'assets/gallery/photo13.jpg', title: 'Coastal Drive',        description: 'A 911 along the shoreline.' },
        { src: 'assets/gallery/photo14.jpg', title: 'Low Tide',             description: 'Long shadows on the sand.' },
        { src: 'assets/gallery/photo15.jpg', title: 'Rooftops to the Sea',  description: 'A hillside view over the coast.' },
        { src: 'assets/gallery/photo16.jpg', title: 'In Primer',           description: 'Fuselages waiting for paint.' },
        { src: 'assets/gallery/photo17.jpg', title: 'Niagara in Winter',    description: 'Horseshoe Falls, frozen at the edges.' },
        { src: 'assets/gallery/photo18.jpg', title: 'Fallsview',            description: "Niagara's skyline under snow." },
    ];

    // Fisher-Yates shuffle for random layout on each reload
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // DOM elements
    const galleryGrid      = document.getElementById('galleryGrid');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const lightbox         = document.getElementById('lightbox');
    const lightboxContent  = document.querySelector('.lightbox-content');
    const lightboxImage    = document.getElementById('lightboxImage');
    const lightboxTitle    = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxCounter  = document.getElementById('lightboxCounter');
    const lightboxClose    = document.querySelector('.lightbox-close');
    const lightboxPrev     = document.getElementById('lightboxPrev');
    const lightboxNext     = document.getElementById('lightboxNext');
    const header           = document.querySelector('header');
    const mobileToggle     = document.getElementById('mobileMenuToggle');
    const navLinksEl       = document.querySelector('.nav-links');
    const slideshowBtn     = document.getElementById('slideshowBtn');
    const slideshowFill    = document.getElementById('slideshowFill');
    const filmstripEl      = document.getElementById('filmstrip');
    const keyboardHint     = document.getElementById('keyboardHint');
    const galleryFeatured  = document.getElementById('galleryFeatured');
    const statsCount       = document.getElementById('statsCount');

    // Nav goes translucent + blurred once the page scrolls past the photo
    // hero (not just a few pixels in) so its white-on-photo text has room.
    // The hero's height is cached (it doesn't change on scroll) and only
    // recomputed on resize, and the toggle itself is rAF-throttled.
    let heroThreshold = galleryFeatured ? Math.max(galleryFeatured.offsetHeight - 90, 20) : 20;
    window.addEventListener('resize', () => {
        heroThreshold = galleryFeatured ? Math.max(galleryFeatured.offsetHeight - 90, 20) : 20;
    }, { passive: true });

    let headerTicking = false;
    window.addEventListener('scroll', () => {
        if (headerTicking) return;
        headerTicking = true;
        requestAnimationFrame(() => {
            if (header) header.classList.toggle('scrolled', window.scrollY > heroThreshold);
            headerTicking = false;
        });
    }, { passive: true });

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

    // Mobile menu
    if (mobileToggle && navLinksEl) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinksEl.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Initialize
    init();

    function init() {
        config.allImages = shuffle([...photoData]); // random order on every load
        setupEventListeners();
        loadInitialImages();
    }

    function setupEventListeners() {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => { stopSlideshow(); showPreviousImage(); });
        lightboxNext.addEventListener('click', () => { stopSlideshow(); showNextImage(); });
        trapFocus(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape')     closeLightbox();
            if (e.key === 'ArrowLeft')  { stopSlideshow(); showPreviousImage(); }
            if (e.key === 'ArrowRight') { stopSlideshow(); showNextImage(); }
        });

        // Touch swipe
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                stopSlideshow();
                diff > 0 ? showNextImage() : showPreviousImage();
            }
        });

        if (slideshowBtn) {
            slideshowBtn.addEventListener('click', toggleSlideshow);
        }
    }

    function loadInitialImages() {
        showLoading();
        galleryGrid.innerHTML = '';
        config.visibleImages = config.allImages;
        loadImageBatch(config.visibleImages);
    }

    function loadImageBatch(images) {
        images.forEach((imageData) => createGalleryItem(imageData));
        hideLoading();
        animateGalleryItems();
        setupParallax();
        buildFilmstrip();
        setFeaturedPhoto();
        if (statsCount) statsCount.textContent = `${config.allImages.length} Photos`;
    }

    function createGalleryItem(imageData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const imgIndex = config.allImages.indexOf(imageData);

        galleryItem.innerHTML = `
            <div class="image-container" tabindex="0" role="button" aria-label="View ${imageData.title}">
                <div class="image-placeholder" data-src="${imageData.src}" data-alt="${imageData.title}">
                    <div class="placeholder-content">Loading...</div>
                </div>
                <span class="image-caption">${imageData.title}</span>
            </div>
        `;

        const container = galleryItem.querySelector('.image-container');
        container.addEventListener('click', () => openLightbox(imgIndex, container));
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(imgIndex, container);
            }
        });

        galleryGrid.appendChild(galleryItem);
        lazyLoadImage(galleryItem.querySelector('.image-placeholder'));
    }

    // Genuinely lazy: the <img> carries loading="lazy" and sits in the DOM
    // from the start, so the browser itself defers the network fetch until
    // the tile is actually near the viewport (a `new Image()` preloaded
    // up front, as this used to do, downloads all 18 photos on page load
    // regardless of scroll position).
    function lazyLoadImage(placeholder) {
        const src = placeholder.getAttribute('data-src');
        const alt = placeholder.getAttribute('data-alt');
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = alt;
        img.style.opacity = '0';

        img.onload = function () {
            placeholder.classList.add('loaded');
            requestAnimationFrame(() => { img.style.opacity = '1'; });
        };

        img.onerror = function () {
            placeholder.innerHTML = '<div class="placeholder-content" style="color:#aaa">No image</div>';
        };

        placeholder.innerHTML = '';
        placeholder.appendChild(img);
        img.src = src;
    }

    // Items reveal as they actually scroll into view, rather than all at once
    // right after load: most of the grid sits below the fold on first paint.
    function animateGalleryItems() {
        galleryGrid.classList.add('loaded');
        const items = galleryGrid.querySelectorAll('.gallery-item:not(.visible)');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        items.forEach(item => observer.observe(item));
    }

    // A gentle, alternating drift on the grid images as the page scrolls:
    // each image moves at a slightly different rate, via a CSS variable so
    // it composes with (rather than fights) the hover-scale transform.
    function setupParallax() {
        if (reduceMotion) return;
        const containers = Array.from(galleryGrid.querySelectorAll('.image-container'));
        if (!containers.length) return;

        const speeds = [0.05, -0.06, 0.035, -0.04, 0.055, -0.03];
        containers.forEach((el, i) => { el.dataset.speed = speeds[i % speeds.length]; });

        let ticking = false;
        function update() {
            const viewportCenter = window.innerHeight / 2;
            containers.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
                const speed = parseFloat(el.dataset.speed || 0);
                const offset = (viewportCenter - (rect.top + rect.height / 2)) * speed;
                el.style.setProperty('--py', `${offset.toFixed(1)}px`);
            });
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        galleryGrid.classList.remove('loaded');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // --- Hero background photo (the hero section doubles as the featured photo) ---
    function setFeaturedPhoto() {
        if (!galleryFeatured || config.allImages.length === 0) return;
        const featured = config.allImages[0];

        const bg = new Image();
        bg.className = 'gallery-hero-bg';
        bg.alt = '';
        bg.onload = () => bg.classList.add('loaded');
        bg.src = featured.src;
        galleryFeatured.prepend(bg);

        // Clicking (or Enter/Space) the hero opens the lightbox on its featured photo
        galleryFeatured.addEventListener('click', () => openLightbox(0, null));
        galleryFeatured.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(0, null);
            }
        });
    }

    // --- Filmstrip ---
    function buildFilmstrip() {
        if (!filmstripEl) return;
        filmstripEl.innerHTML = '';
        config.allImages.forEach((imgData, i) => {
            const selectThumb = (e) => {
                e.stopPropagation();
                config.currentImageIndex = i;
                updateLightboxContent(true);
                updateFilmstrip();
            };

            const thumb = document.createElement('img');
            thumb.src = imgData.src;
            thumb.alt = imgData.title;
            thumb.className = 'filmstrip-thumb';
            thumb.tabIndex = 0;
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('aria-label', `View ${imgData.title}`);
            thumb.addEventListener('click', selectThumb);
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectThumb(e);
                }
            });
            filmstripEl.appendChild(thumb);
        });
    }

    function updateFilmstrip() {
        const thumbs = document.querySelectorAll('.filmstrip-thumb');
        thumbs.forEach((t, i) => t.classList.toggle('active', i === config.currentImageIndex));
        const activeThumb = thumbs[config.currentImageIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    // --- Slideshow ---
    let slideshowActive = false;
    let slideshowTimer  = null;

    function toggleSlideshow() {
        slideshowActive ? stopSlideshow() : startSlideshow();
    }

    function startSlideshow() {
        slideshowActive = true;
        if (slideshowBtn) {
            slideshowBtn.innerHTML = '&#9646;&#9646;'; // pause icon
            slideshowBtn.setAttribute('aria-label', 'Pause slideshow');
        }
        animateSlideshowProgress();
        slideshowTimer = setInterval(() => {
            showNextImage();
            animateSlideshowProgress();
        }, 3000);
    }

    function stopSlideshow() {
        if (!slideshowActive) return;
        slideshowActive = false;
        clearInterval(slideshowTimer);
        if (slideshowBtn) {
            slideshowBtn.innerHTML = '&#9654;'; // play icon
            slideshowBtn.setAttribute('aria-label', 'Play slideshow');
        }
        if (slideshowFill) {
            slideshowFill.style.transition = 'none';
            slideshowFill.style.width = '0%';
        }
    }

    function animateSlideshowProgress() {
        if (!slideshowFill) return;
        slideshowFill.style.transition = 'none';
        slideshowFill.style.width = '0%';
        slideshowFill.offsetHeight; // force reflow
        slideshowFill.style.transition = 'width 3s linear';
        slideshowFill.style.width = '100%';
    }

    // --- Keyboard hint (once per session) ---
    let hintShown = false;

    function showKeyboardHint() {
        if (hintShown || !keyboardHint || sessionStorage.getItem('galleryHintShown')) return;
        hintShown = true;
        sessionStorage.setItem('galleryHintShown', '1');
        keyboardHint.classList.add('visible');
        setTimeout(() => keyboardHint.classList.remove('visible'), 3500);
    }

    // --- Lightbox focus trap ---
    // Attached once (not on every open, which used to stack a fresh listener
    // per photo and never clean any of them up) — recomputes the focusable
    // set on each Tab press since the filmstrip's thumbnails change per image.
    function trapFocus(el) {
        el.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !lightbox.classList.contains('active')) return;
            const focusable = el.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last  = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }
        });
    }

    let lastFocusedElement = null;
    let fadeTimeoutId = null;
    let closeTimeoutId = null;

    // --- Lightbox: zoom-from-position open ---
    window.openLightbox = function (imageIndex, sourceEl) {
        // Cancel any in-flight close from a moment ago so reopening never
        // races with the previous close's cleanup (stale timers resetting
        // state out from under the newly-opened image).
        clearTimeout(closeTimeoutId);
        lightboxContent.style.transition = '';

        lastFocusedElement = document.activeElement;
        config.currentImageIndex = imageIndex;
        updateLightboxContent(false);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (sourceEl) {
            // Zoom from the clicked card's position
            const rect = sourceEl.getBoundingClientRect();
            const fromX = (rect.left + rect.width  / 2) - (window.innerWidth  / 2);
            const fromY = (rect.top  + rect.height / 2) - (window.innerHeight / 2);
            const fromScale = Math.min(rect.width / (window.innerWidth * 0.85), 0.2);

            lightboxContent.style.transition = 'none';
            lightboxContent.style.transform  = `translate(${fromX}px, ${fromY}px) scale(${fromScale})`;
            lightboxContent.style.opacity    = '0';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    lightboxContent.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
                    lightboxContent.style.transform  = 'translate(0, 0) scale(1)';
                    lightboxContent.style.opacity    = '1';
                });
            });
        } else {
            // Fallback: simple scale-in
            lightboxContent.style.transform = 'scale(0.88)';
            lightboxContent.style.opacity   = '0';
            requestAnimationFrame(() => {
                lightboxContent.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease';
                lightboxContent.style.transform  = 'scale(1)';
                lightboxContent.style.opacity    = '1';
            });
        }

        showKeyboardHint();
        updateFilmstrip();
        setTimeout(() => { lightboxClose.focus(); }, 60);
    };

    function updateLightboxContent(animate) {
        const imageData = config.allImages[config.currentImageIndex];
        clearTimeout(fadeTimeoutId);

        if (animate) {
            lightboxImage.classList.add('fading');
            fadeTimeoutId = setTimeout(() => {
                lightboxImage.src = imageData.src;
                lightboxImage.alt = imageData.title;
                lightboxImage.classList.remove('fading');
            }, 260);
        } else {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.title;
        }

        lightboxTitle.textContent    = imageData.title;
        lightboxCategory.textContent = imageData.description;
        lightboxCounter.textContent  = `${config.currentImageIndex + 1} / ${config.allImages.length}`;
        updateFilmstrip();
    }

    // Closing is idempotent: a second Escape/click while it's already
    // closing (or mid-close-then-reopen) can't leave the modal half-visible
    // or the body permanently scroll-locked.
    function closeLightbox() {
        if (!lightbox.classList.contains('active')) return;

        stopSlideshow();
        clearTimeout(fadeTimeoutId);
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';

        lightboxContent.style.transition = 'transform 0.3s ease, opacity 0.25s ease';
        lightboxContent.style.transform  = 'scale(0.9)';
        lightboxContent.style.opacity    = '0';

        clearTimeout(closeTimeoutId);
        closeTimeoutId = setTimeout(() => {
            lightboxContent.style.transform  = '';
            lightboxContent.style.opacity    = '';
            lightboxContent.style.transition = '';
            lightboxImage.src = '';
        }, 280);

        if (lastFocusedElement) lastFocusedElement.focus();
    }

    function showPreviousImage() {
        config.currentImageIndex = config.currentImageIndex > 0
            ? config.currentImageIndex - 1
            : config.allImages.length - 1;
        updateLightboxContent(true);
    }

    function showNextImage() {
        config.currentImageIndex = config.currentImageIndex < config.allImages.length - 1
            ? config.currentImageIndex + 1
            : 0;
        updateLightboxContent(true);
    }
});
