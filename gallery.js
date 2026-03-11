// Gallery JavaScript with enhanced animations
document.addEventListener('DOMContentLoaded', function () {
    // Gallery configuration
    const config = {
        imagesPerLoad: 9,
        currentImageIndex: 0,
        allImages: [],
        visibleImages: [],
        currentFilter: 'all'
    };

    // Photo data — replace titles/descriptions with real ones as needed
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

    // DOM elements
    const galleryGrid      = document.getElementById('galleryGrid');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const loadMoreBtn      = document.getElementById('loadMoreBtn');
    const lightbox         = document.getElementById('lightbox');
    const lightboxImage    = document.getElementById('lightboxImage');
    const lightboxTitle    = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxCounter  = document.getElementById('lightboxCounter');
    const lightboxClose    = document.querySelector('.lightbox-close');
    const lightboxPrev     = document.getElementById('lightboxPrev');
    const lightboxNext     = document.getElementById('lightboxNext');
    const scrollProgress   = document.getElementById('scrollProgress');

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    });

    // Initialize
    init();

    function init() {
        config.allImages = [...photoData];
        setupEventListeners();
        loadInitialImages();
    }

    function setupEventListeners() {
        loadMoreBtn.addEventListener('click', loadMoreImages);

        // Lightbox events
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxNext.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowLeft')   showPreviousImage();
            if (e.key === 'ArrowRight')  showNextImage();
        });

        // Touch/swipe support for lightbox
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? showNextImage() : showPreviousImage();
            }
        });
    }

    function loadInitialImages() {
        showLoading();
        galleryGrid.innerHTML = '';
        config.visibleImages = getFilteredImages();
        loadImageBatch(config.visibleImages.slice(0, config.imagesPerLoad));
        updateLoadMoreButton();
    }

    function loadMoreImages() {
        const startIndex = galleryGrid.children.length;
        const newImages  = config.visibleImages.slice(startIndex, startIndex + config.imagesPerLoad);
        if (newImages.length > 0) loadImageBatch(newImages);
        updateLoadMoreButton();
    }

    function loadImageBatch(images) {
        images.forEach((imageData) => createGalleryItem(imageData));
        hideLoading();
        animateGalleryItems();
    }

    function createGalleryItem(imageData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', imageData.category);

        const imgIndex = config.allImages.indexOf(imageData);
        galleryItem.innerHTML = `
            <div class="image-container" onclick="openLightbox(${imgIndex})">
                <div class="image-placeholder" data-src="${imageData.src}" data-alt="${imageData.title}">
                    <div class="placeholder-content">Loading...</div>
                </div>
                <div class="image-overlay">
                    <div class="image-info">
                        <h3>${imageData.title}</h3>
                        <p>${imageData.description}</p>
                    </div>
                </div>
            </div>
        `;

        galleryGrid.appendChild(galleryItem);
        lazyLoadImage(galleryItem.querySelector('.image-placeholder'));
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
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        };

        img.onerror = function () {
            placeholder.innerHTML = '<div class="placeholder-content" style="color:#aaa">No image</div>';
        };

        img.src = src;
        img.alt = alt;
    }

    function animateGalleryItems() {
        const items = galleryGrid.querySelectorAll('.gallery-item:not(.visible)');
        items.forEach((item, index) => {
            setTimeout(() => item.classList.add('visible'), index * 80);
        });
        setTimeout(() => galleryGrid.classList.add('loaded'), 80);
    }

    function getFilteredImages() {
        if (config.currentFilter === 'all') return config.allImages;
        return config.allImages.filter(img => img.category === config.currentFilter);
    }

    function updateLoadMoreButton() {
        const totalVisible   = galleryGrid.children.length;
        const totalAvailable = config.visibleImages.length;
        if (totalVisible >= totalAvailable) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Load More (${totalAvailable - totalVisible} remaining)`;
        }
    }

    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        galleryGrid.classList.remove('loaded');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // Lightbox — open with fade+scale animation
    window.openLightbox = function (imageIndex) {
        config.currentImageIndex = imageIndex;
        updateLightboxContent(false);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function updateLightboxContent(animate) {
        const imageData = config.allImages[config.currentImageIndex];

        if (animate) {
            lightboxImage.classList.add('fading');
            setTimeout(() => {
                lightboxImage.src     = imageData.src;
                lightboxImage.alt     = imageData.title;
                lightboxImage.classList.remove('fading');
            }, 200);
        } else {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.title;
        }

        lightboxTitle.textContent    = imageData.title;
        lightboxCategory.textContent = imageData.description;
        lightboxCounter.textContent  = `${config.currentImageIndex + 1} / ${config.allImages.length}`;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300);
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
