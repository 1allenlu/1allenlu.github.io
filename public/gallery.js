// Gallery JavaScript: all features
document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Config
    const config = {
        currentImageIndex: 0,
        allImages: [],
        visibleImages: []
    };

    // The grid and filmstrip use smaller copies; the viewer and hero use the full photo.
    const thumbFor = (src) => src.replace('assets/gallery/', 'assets/gallery/thumbs/');

    // Photo data (width/height let each tile reserve its space before the photo loads)
    const photoData = [
        { src: 'assets/gallery/photo1.jpg',  title: 'Surfers at Sunset',   description: 'Golden hour on the Pacific.', width: 1010, height: 1800 },
        { src: 'assets/gallery/photo2.jpg',  title: 'Night Drive',          description: 'A JDM sedan under neon.', width: 1800, height: 1010 },
        { src: 'assets/gallery/photo3.jpg',  title: 'Coastal Sunset',       description: 'Sun meets the horizon.', width: 1010, height: 1800 },
        { src: 'assets/gallery/photo4.jpg',  title: 'Harbor at Dusk',       description: 'Boats drifting home for the night.', width: 1800, height: 1010 },
        { src: 'assets/gallery/photo5.jpg',  title: 'Airborne',             description: 'Catching air on a late afternoon.', width: 1010, height: 1800 },
        { src: 'assets/gallery/photo6.jpg',  title: 'Clipper City',         description: 'A tall ship crossing the harbor.', width: 1800, height: 1082 },
        { src: 'assets/gallery/photo7.jpg',  title: 'Turret & Sky',         description: "Old Quebec's rooftops.", width: 1800, height: 1200 },
        { src: 'assets/gallery/photo8.jpg',  title: 'Snow Day',             description: 'Old Quebec under fresh snow.', width: 1800, height: 1200 },
        { src: 'assets/gallery/photo9.jpg',  title: 'Chateau Frontenac',    description: "Quebec City's landmark hotel.", width: 1800, height: 1200 },
        { src: 'assets/gallery/photo10.jpg', title: 'Cherry Blossoms',      description: 'The Jefferson Memorial in bloom.', width: 1800, height: 1149 },
        { src: 'assets/gallery/photo11.jpg', title: 'Fuji Through the Wires', description: 'Mount Fuji on a hazy morning.', width: 1199, height: 1800 },
        { src: 'assets/gallery/photo12.jpg', title: 'Blossoms & Friends',   description: 'A huddle under the cherry trees.', width: 1800, height: 1200 },
        { src: 'assets/gallery/photo13.jpg', title: 'Coastal Drive',        description: 'A 911 along the shoreline.', width: 1199, height: 1800 },
        { src: 'assets/gallery/photo14.jpg', title: 'Low Tide',             description: 'Long shadows on the sand.', width: 1800, height: 1199 },
        { src: 'assets/gallery/photo15.jpg', title: 'Rooftops to the Sea',  description: 'A hillside view over the coast.', width: 1251, height: 1800 },
        { src: 'assets/gallery/photo16.jpg', title: 'In Primer',           description: 'Fuselages waiting for paint.', width: 1200, height: 1800 },
        { src: 'assets/gallery/photo17.jpg', title: 'Niagara in Winter',    description: 'Horseshoe Falls, frozen at the edges.', width: 1200, height: 1800 },
        { src: 'assets/gallery/photo18.jpg', title: 'Fallsview',            description: "Niagara's skyline under snow.", width: 1200, height: 1800 },
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

    // Nav goes translucent + blurred once the page scrolls, like the homepage.
    let headerTicking = false;
    window.addEventListener('scroll', () => {
        if (headerTicking) return;
        headerTicking = true;
        requestAnimationFrame(() => {
            if (header) header.classList.toggle('scrolled', window.scrollY > 20);
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

    // Cursor-tracking glow on every .glow-card (the same effect as the homepage cards)
    document.addEventListener('pointermove', (e) => {
        const card = e.target instanceof Element ? e.target.closest('.glow-card') : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    }, { passive: true });

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
        // The first photo is featured in the hero, so the grid starts from the second.
        images.slice(1).forEach((imageData) => createGalleryItem(imageData));
        hideLoading();
        animateGalleryItems();
        buildFilmstrip();
        setFeaturedPhoto();
        if (statsCount) statsCount.textContent = `${config.allImages.length} Photos`;
    }

    function createGalleryItem(imageData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const imgIndex = config.allImages.indexOf(imageData);

        galleryItem.innerHTML = `
            <div class="image-container glow-card" tabindex="0" role="button" aria-label="View ${imageData.title}">
                <div class="image-placeholder" style="aspect-ratio: ${imageData.width} / ${imageData.height}" data-src="${thumbFor(imageData.src)}" data-alt="${imageData.title}"></div>
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
        img.decoding = 'async';
        img.alt = alt;
        img.style.opacity = '0';

        // Fade in only once it's decoded, so the fade itself never stutters
        img.onload = function () {
            img.decode().catch(() => {}).then(() => { img.style.opacity = '1'; });
        };

        img.onerror = function () {
            placeholder.innerHTML = '<div class="placeholder-content" style="color:#aaa">No image</div>';
        };

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

        // Items entering together stagger as a group, like the homepage cards
        const observer = new IntersectionObserver((entries) => {
            entries
                .filter(entry => entry.isIntersecting)
                .forEach((entry, i) => {
                    entry.target.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                });
        }, { rootMargin: '0px 0px -8% 0px' });

        items.forEach(item => observer.observe(item));
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
        bg.fetchPriority = 'high';
        bg.onload = () => bg.decode().catch(() => {}).then(() => bg.classList.add('loaded'));
        bg.src = featured.src;
        galleryFeatured.prepend(bg);

        // The slow drift only needs to run while the hero is on screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                bg.classList.toggle('paused', !entry.isIntersecting);
            }).observe(galleryFeatured);
        }

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
            thumb.src = thumbFor(imgData.src);
            thumb.loading = 'lazy';
            thumb.decoding = 'async';
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
    // per photo and never clean any of them up): recomputes the focusable
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

    let swapToken = 0;

    function preloadPhoto(src) {
        const photo = new Image();
        photo.src = src;
        return photo.decode().catch(() => {});
    }

    function updateLightboxContent(animate) {
        const imageData = config.allImages[config.currentImageIndex];
        const token = ++swapToken;
        clearTimeout(fadeTimeoutId);

        if (animate) {
            // Swap only after the fade-out ends and the next photo is decoded,
            // so it never flashes blank or pops in half-loaded.
            lightboxImage.classList.add('fading');
            const faded = new Promise((resolve) => { fadeTimeoutId = setTimeout(resolve, 200); });
            Promise.all([preloadPhoto(imageData.src), faded]).then(() => {
                if (token !== swapToken) return;
                lightboxImage.src = imageData.src;
                lightboxImage.alt = imageData.title;
                lightboxImage.classList.remove('fading');
            });
        } else {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.title;
        }

        lightboxTitle.textContent    = imageData.title;
        lightboxCategory.textContent = imageData.description;
        lightboxCounter.textContent  = `${config.currentImageIndex + 1} / ${config.allImages.length}`;
        updateFilmstrip();

        // Have the neighbors ready so next/previous feels instant
        const count = config.allImages.length;
        preloadPhoto(config.allImages[(config.currentImageIndex + 1) % count].src);
        preloadPhoto(config.allImages[(config.currentImageIndex - 1 + count) % count].src);
    }

    // Closing is idempotent: a second Escape/click while it's already
    // closing (or mid-close-then-reopen) can't leave the modal half-visible
    // or the body permanently scroll-locked.
    function closeLightbox() {
        if (!lightbox.classList.contains('active')) return;

        stopSlideshow();
        clearTimeout(fadeTimeoutId);
        swapToken++;
        lightboxImage.classList.remove('fading');
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
