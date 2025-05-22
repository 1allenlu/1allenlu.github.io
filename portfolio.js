// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll(".gallery-item");
    
    // Add a slight fade-in effect to gallery items
    setTimeout(() => {
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = "1";
            }, index * 50);
        });
    }, 300);
});

// Make sure the toggle menu function is available
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}