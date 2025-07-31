/**
 * Experience Card Expand/Collapse Functionality
 * Only active on mobile devices (max-width: 768px)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Get all expandable experience cards
    const experienceCards = document.querySelectorAll('[data-expandable]');
    
    // Initialize cards based on screen size
    function initializeCards() {
        experienceCards.forEach(card => {
            const header = card.querySelector('.experience-header');
            const content = card.querySelector('.experience-content');
            
            if (isMobile()) {
                // On mobile, collapse all cards initially
                card.classList.remove('expanded');
                
                // Add click event listener to entire header
                header.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggleCard(card);
                });
                
                // Make entire header clickable
                header.style.cursor = 'pointer';
            } else {
                // On desktop, ensure all cards are expanded and remove click handlers
                card.classList.add('expanded');
                header.style.cursor = 'default';
                
                // Remove click event listeners by cloning the header
                const newHeader = header.cloneNode(true);
                header.parentNode.replaceChild(newHeader, header);
            }
        });
    }
    
    // Toggle card expansion (accordion style - only one open at a time)
    function toggleCard(card) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            card.classList.remove('expanded');
        } else {
            // Close all other cards (accordion behavior)
            experienceCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
            
            card.classList.add('expanded');
        }
    }
    
    // Initialize on page load
    initializeCards();
    
    // Re-initialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            initializeCards();
        }, 250);
    });
});
