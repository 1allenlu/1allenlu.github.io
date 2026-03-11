// Gallery JavaScript — all features
document.addEventListener('DOMContentLoaded', function () {
    // Config
    const config = {
        currentImageIndex: 0,
        allImages: [],
        visibleImages: [],
        currentFilter: 'all'
    };

    // Photo data
    const photoData = [
        { src: 'assets/gallery/photo1.jpg',  category: 'all', title: 'Photo 1',  description: 'Photography' },
        { src: 'assets/gallery/photo2.jpg',  category: 'all', title: 'Photo 2',  description: 'Photography' },
        { src: 'assets/gallery/photo3.jpg',  category: 'all', title: 'Photo 3',  description: 'Photography' },
        { src: 'assets/gallery/photo4.jpg',  category: 'all', title: 'Photo 4',  description: 'Photography' },
        { src: 'assets/gallery/photo5.jpg',  category: 'all', title: 'Photo 5',  description: 'Photography' },
        { src: 'assets/gallery/photo6.jpg',  category: 'all', title: 'Photo 6',  description: 'Photography' },
        { src: 'assets/gallery/photo7.jpg',  category: 'all', title: 'Photo 7',  description: 'Photography' },
        { src: 'assets/gallery/photo8.jpg',  category: 'all', title: 'Photo 8',  description: 'Photography' },
        { src: 'assets/gallery/photo9.jpg',  category: 'all', title: 'Photo 9',  description: 'Photography' },
        { src: 'assets/gallery/photo10.jpg', category: 'all', title: 'Photo 10', description: 'Photography' },
        { src: 'assets/gallery/photo11.jpg', category: 'all', title: 'Photo 11', description: 'Photography' },
        { src: 'assets/gallery/photo12.jpg', category: 'all', title: 'Photo 12', description: 'Photography' },
        { src: 'assets/gallery/photo13.jpg', category: 'all', title: 'Photo 13', description: 'Photography' },
        { src: 'assets/gallery/photo14.jpg', category: 'all', title: 'Photo 14', description: 'Photography' },
        { src: 'assets/gallery/photo15.jpg', category: 'all', title: 'Photo 15', description: 'Photography' },
        { src: 'assets/gallery/photo16.jpg', category: 'all', title: 'Photo 16', description: 'Photography' },
        { src: 'assets/gallery/photo17.jpg', category: 'all', title: 'Photo 17', description: 'Photography' },
        { src: 'assets/gallery/photo18.jpg', category: 'all', title: 'Photo 18', description: 'Photography' },
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
    const scrollProgress   = document.getElementById('scrollProgress');
    const scrollToTopBtn   = document.getElementById('scrollToTop');
    const mobileToggle     = document.getElementById('mobileMenuToggle');
    const navLinksEl       = document.querySelector('.nav-links');
    const slideshowBtn     = document.getElementById('slideshowBtn');
    const slideshowFill    = document.getElementById('slideshowFill');
    const filmstripEl      = document.getElementById('filmstrip');
    const keyboardHint     = document.getElementById('keyboardHint');
    const galleryFeatured  = document.getElementById('galleryFeatured');
    const statsCount       = document.getElementById('statsCount');
    const featuredCount    = document.getElementById('featuredCount');

    // Scroll progress + scroll-to-top
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) {
            scrollProgress.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
        }
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', scrollTop > 400);
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Mobile menu
    if (mobileToggle && navLinksEl) {
        mobileToggle.addEventListener('click', () => {
            navLinksEl.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
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
        config.visibleImages = getFilteredImages();
        loadImageBatch(config.visibleImages);
    }

    function loadImageBatch(images) {
        images.forEach((imageData) => createGalleryItem(imageData));
        hideLoading();
        animateGalleryItems();
        buildFilmstrip();
        setFeaturedPhoto();
        if (statsCount) statsCount.textContent = `${config.allImages.length} Photos`;
    }

    function createGalleryItem(imageData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', imageData.category);

        const imgIndex = config.allImages.indexOf(imageData);
        const displayNum = String(imgIndex + 1).padStart(2, '0');

        galleryItem.innerHTML = `
            <div class="image-container" onclick="openLightbox(${imgIndex}, this)">
                <div class="image-placeholder" data-src="${imageData.src}" data-alt="${imageData.title}">
                    <div class="placeholder-content">Loading...</div>
                </div>
                <span class="image-count-badge">${displayNum}</span>
                <div class="image-overlay">
                    <div class="image-info">
                        <h3></h3>
                        <p>${imageData.description}</p>
                    </div>
                </div>
            </div>
        `;

        galleryGrid.appendChild(galleryItem);
        lazyLoadImage(galleryItem.querySelector('.image-placeholder'));
        addTypingCaption(galleryItem.querySelector('.image-container'), imageData.title);
    }

    // --- Typing caption on hover ---
    function addTypingCaption(container, title) {
        const titleEl = container.querySelector('.image-info h3');
        let timer = null;

        container.addEventListener('mouseenter', () => {
            clearInterval(timer);
            titleEl.textContent = '';
            let i = 0;
            timer = setInterval(() => {
                if (i < title.length) {
                    titleEl.textContent += title[i++];
                } else {
                    clearInterval(timer);
                }
            }, 35);
        });

        container.addEventListener('mouseleave', () => {
            clearInterval(timer);
            titleEl.textContent = title; // restore instantly on leave
        });
    }

    function lazyLoadImage(placeholder) {
        const src = placeholder.getAttribute('data-src');
        const alt = placeholder.getAttribute('data-alt');
        const img = new Image();

        img.onload = function () {
            placeholder.innerHTML = '';
            placeholder.classList.add('loaded');
            img.style.opacity = '0';
            placeholder.appendChild(img);
            requestAnimationFrame(() => { img.style.opacity = '1'; });
        };

        img.onerror = function () {
            placeholder.innerHTML = '<div class="placeholder-content" style="color:#aaa">No image</div>';
        };

        img.src = src;
        img.alt = alt;
    }

    function animateGalleryItems() {
        const items = galleryGrid.querySelectorAll('.gallery-item:not(.visible)');
        items.forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 80));
        setTimeout(() => galleryGrid.classList.add('loaded'), 80);
    }

    function getFilteredImages() {
        return config.currentFilter === 'all'
            ? config.allImages
            : config.allImages.filter(img => img.category === config.currentFilter);
    }

    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        galleryGrid.classList.remove('loaded');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // --- Featured photo banner ---
    function setFeaturedPhoto() {
        if (!galleryFeatured || config.allImages.length === 0) return;
        const featured = config.allImages[0];

        // Insert an img for proper hover zoom
        galleryFeatured.innerHTML = `
            <img class="gallery-featured-inner-img" src="${featured.src}" alt="${featured.title}">
            <div class="gallery-featured-overlay">
                <span class="featured-tag">Featured</span>
                <p class="featured-count">${config.allImages.length} photos in this collection</p>
            </div>
        `;

        // Click featured opens its lightbox
        galleryFeatured.style.cursor = 'pointer';
        galleryFeatured.addEventListener('click', () => openLightbox(0, null));
    }

    // --- Filmstrip ---
    function buildFilmstrip() {
        if (!filmstripEl) return;
        filmstripEl.innerHTML = '';
        config.allImages.forEach((imgData, i) => {
            const thumb = document.createElement('img');
            thumb.src = imgData.src;
            thumb.alt = imgData.title;
            thumb.className = 'filmstrip-thumb';
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                config.currentImageIndex = i;
                updateLightboxContent(true);
                updateFilmstrip();
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
        if (slideshowBtn) slideshowBtn.innerHTML = '&#9646;&#9646;'; // pause icon
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
        if (slideshowBtn) slideshowBtn.innerHTML = '&#9654;'; // play icon
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
    function trapFocus(el) {
        const focusable = el.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        el.addEventListener('keydown', function onTab(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }
            if (!lightbox.classList.contains('active')) el.removeEventListener('keydown', onTab);
        });
    }

    let lastFocusedElement = null;

    // --- Lightbox: zoom-from-position open ---
    window.openLightbox = function (imageIndex, sourceEl) {
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
        setTimeout(() => { lightboxClose.focus(); trapFocus(lightbox); }, 60);
    };

    function updateLightboxContent(animate) {
        const imageData = config.allImages[config.currentImageIndex];

        if (animate) {
            lightboxImage.classList.add('fading');
            setTimeout(() => {
                lightboxImage.src = imageData.src;
                lightboxImage.alt = imageData.title;
                lightboxImage.classList.remove('fading');
            }, 180);
        } else {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.title;
        }

        lightboxTitle.textContent    = imageData.title;
        lightboxCategory.textContent = imageData.description;
        lightboxCounter.textContent  = `${config.currentImageIndex + 1} / ${config.allImages.length}`;
        updateFilmstrip();
    }

    function closeLightbox() {
        stopSlideshow();
        lightboxContent.style.transition = 'transform 0.3s ease, opacity 0.25s ease';
        lightboxContent.style.transform  = 'scale(0.9)';
        lightboxContent.style.opacity    = '0';

        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
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
