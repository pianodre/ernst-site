// Hamburger menu functionality for mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (hamburgerToggle && mobileNavMenu) {
        // Toggle menu on hamburger click
        hamburgerToggle.addEventListener('click', function() {
            hamburgerToggle.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = mobileNavMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerToggle.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = hamburgerToggle.contains(event.target) || mobileNavMenu.contains(event.target);
            
            if (!isClickInsideNav && mobileNavMenu.classList.contains('active')) {
                hamburgerToggle.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            }
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerToggle.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            }
        });
    }
});
