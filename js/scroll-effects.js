/**
 * Scroll Effects - ScaleDown Implementation
 * Based on page-scroll-effects-master
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const sections = document.querySelectorAll('.section');
    let scrolling = false;
    
    // Initialize effects
    initializeStyles();
    initializeEvents();
    
    function initializeStyles() {
        // Add initial styles to sections
        sections.forEach((section, index) => {
            // Get the content container inside the section
            const content = section.querySelector('.section-container');
            if (!content) return;
            
            // Add necessary CSS properties for transitions
            content.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            content.style.willChange = 'transform, opacity';
            
            // Set initial state based on visibility
            updateSectionVisibility(section, content);
        });
    }
    
    function initializeEvents() {
        // Add scroll event listener with throttling for performance
        let lastScrollTime = 0;
        const scrollThrottle = 10; // ms
        
        window.addEventListener('scroll', function() {
            const now = Date.now();
            if (now - lastScrollTime < scrollThrottle) return;
            lastScrollTime = now;
            
            if (!scrolling) {
                scrolling = true;
                window.requestAnimationFrame(function() {
                    animateSections();
                    scrolling = false;
                });
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            animateSections();
        });
        
        // Initial animation
        setTimeout(function() {
            animateSections();
        }, 100);
    }
    
    function animateSections() {
        const windowHeight = window.innerHeight;
        
        sections.forEach((section) => {
            const content = section.querySelector('.section-container');
            if (!content) return;
            
            updateSectionVisibility(section, content);
        });
    }
    
    function updateSectionVisibility(section, content) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visiblePercentage = calculateVisiblePercentage(rect, windowHeight);
        
        if (visiblePercentage > 0.3) { // If at least 30% visible
            // Section is entering or fully visible
            const scale = Math.min(1, 0.7 + (visiblePercentage * 0.3));
            const opacity = Math.min(1, visiblePercentage * 1.5);
            
            content.style.transform = `scale(${scale})`;
            content.style.opacity = opacity;
            section.classList.add('visible');
        } else {
            // Section is leaving or not visible
            const scale = Math.max(0.7, visiblePercentage * 2);
            const opacity = Math.max(0, visiblePercentage * 3);
            
            content.style.transform = `scale(${scale})`;
            content.style.opacity = opacity;
            section.classList.remove('visible');
        }
    }
    
    function calculateVisiblePercentage(rect, windowHeight) {
        // If completely above or below viewport, return 0
        if (rect.bottom <= 0 || rect.top >= windowHeight) {
            return 0;
        }
        
        // Calculate visible height
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const percentage = visibleHeight / Math.min(rect.height, windowHeight);
        
        return Math.max(0, Math.min(1, percentage));
    }
});

