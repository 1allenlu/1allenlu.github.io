// Gallery JavaScript with optimized loading
document.addEventListener('DOMContentLoaded', function () {
    // Gallery configuration
    const config = {
        imagesPerLoad: 8,
        currentImageIndex: 0,
        allImages: [],
        visibleImages: [],
        currentFilter: 'all'
    };

    // Example photo data - replace with your actual photo paths and info
    const photoData = [
        { src: 'assets/gallery/photo1.jpg', category: 'all', title: 'Photo 1', description: 'Photography' },
        { src: 'assets/gallery/photo2.jpg', category: 'all', title: 'Photo 2', description: 'Photography' },
        { src: 'assets/gallery/photo3.jpg', category: 'all', title: 'Photo 3', description: 'Photography' },
        { src: 'assets/gallery/photo4.jpg', category: 'all', title: 'Photo 4', description: 'Photography' },
        { src: 'assets/gallery/photo5.jpg', category: 'all', title: 'Photo 5', description: 'Photography' },
        { src: 'assets/gallery/photo6.jpg', category: 'all', title: 'Photo 6', description: 'Photography' },
        { src: 'assets/gallery/photo7.jpg', category: 'all', title: 'Photo 7', description: 'Photography' },
        { src: 'assets/gallery/photo8.jpg', category: 'all', title: 'Photo 8', description: 'Photography' },
        { src: 'assets/gallery/photo9.jpg', category: 'all', title: 'Photo 9', description: 'Photography' },
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
    const galleryGrid = document.getElementById('galleryGrid');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    // const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Initialize gallery
    init();

    function init() {
        config.allImages = [...photoData];
        setupEventListeners();
        loadInitialImages();
    }

    function setupEventListeners() {
        // Filter buttons
        // filterBtns.forEach(btn => {
        //     btn.addEventListener('click', handleFilterClick);
        // });

        // Load more button
        loadMoreBtn.addEventListener('click', loadMoreImages);

        // Lightbox events
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxNext.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
        });
    }

    function loadInitialImages() {
        showLoading();

        // Clear existing gallery
        galleryGrid.innerHTML = '';
        config.visibleImages = getFilteredImages();

        // Load first batch
        const initialImages = config.visibleImages.slice(0, config.imagesPerLoad);
        loadImageBatch(initialImages);

        // Update load more button
        updateLoadMoreButton();
    }

    function loadMoreImages() {
        const startIndex = galleryGrid.children.length;
        const endIndex = startIndex + config.imagesPerLoad;
        const newImages = config.visibleImages.slice(startIndex, endIndex);

        if (newImages.length > 0) {
            loadImageBatch(newImages);
        }

        updateLoadMoreButton();
    }

    function loadImageBatch(images) {
        images.forEach((imageData, index) => {
            createGalleryItem(imageData, index);
        });

        hideLoading();
        animateGalleryItems();
    }

    function createGalleryItem(imageData, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', imageData.category);

        galleryItem.innerHTML = `
            <div class="image-container" onclick="openLightbox(${config.allImages.indexOf(imageData)})">
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

        // Lazy load the actual image
        lazyLoadImage(galleryItem.querySelector('.image-placeholder'));
    }

    function lazyLoadImage(placeholder) {
        const src = placeholder.getAttribute('data-src');
        const alt = placeholder.getAttribute('data-alt');

        // Create a new image element
        const img = new Image();

        img.onload = function () {
            // Replace placeholder with actual image
            placeholder.innerHTML = '';
            img.style.opacity = '0';
            placeholder.appendChild(img);

            // Fade in the image
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);
        };

        img.onerror = function () {
            placeholder.innerHTML = '<div class="placeholder-content">Failed to load</div>';
        };

        img.src = src;
        img.alt = alt;
        img.style.transition = 'opacity 0.3s ease';
    }

    function animateGalleryItems() {
        const items = galleryGrid.querySelectorAll('.gallery-item:not(.visible)');

        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });

        // Show grid after animation starts
        setTimeout(() => {
            galleryGrid.classList.add('loaded');
        }, 100);
    }

    function handleFilterClick(e) {
        const filter = e.target.getAttribute('data-filter');
        config.currentFilter = filter;

        // Update active button
        // // filterBtns.forEach(btn => btn.classList.remove('active'));
        // e.target.classList.add('active');

        // Reload gallery with filter
        loadInitialImages();
    }

    function getFilteredImages() {
        if (config.currentFilter === 'all') {
            return config.allImages;
        }
        return config.allImages.filter(img => img.category === config.currentFilter);
    }

    function updateLoadMoreButton() {
        const totalVisible = galleryGrid.children.length;
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

    // Lightbox functions
    window.openLightbox = function (imageIndex) {
        config.currentImageIndex = imageIndex;
        const imageData = config.allImages[imageIndex];

        lightboxImage.src = imageData.src;
        lightboxTitle.textContent = imageData.title;
        lightboxCategory.textContent = imageData.description;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPreviousImage() {
        config.currentImageIndex = config.currentImageIndex > 0
            ? config.currentImageIndex - 1
            : config.allImages.length - 1;

        const imageData = config.allImages[config.currentImageIndex];
        lightboxImage.src = imageData.src;
        lightboxTitle.textContent = imageData.title;
        lightboxCategory.textContent = imageData.description;
    }

    function showNextImage() {
        config.currentImageIndex = config.currentImageIndex < config.allImages.length - 1
            ? config.currentImageIndex + 1
            : 0;

        const imageData = config.allImages[config.currentImageIndex];
        lightboxImage.src = imageData.src;
        lightboxTitle.textContent = imageData.title;
        lightboxCategory.textContent = imageData.description;
    }

    // Intersection Observer for better performance
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target.querySelector('.image-placeholder img');
                if (!placeholder) {
                    lazyLoadImage(entry.target.querySelector('.image-placeholder'));
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe gallery items as they're added
    const originalAppendChild = galleryGrid.appendChild;
    galleryGrid.appendChild = function (child) {
        const result = originalAppendChild.call(this, child);
        observer.observe(child);
        return result;
    };
});