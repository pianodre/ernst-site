/**
 * Dylan Ernst Piano Studio
 * JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Always start at top when page loads/refreshed
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handler (placeholder - requires backend)
    const contactForm = document.querySelector('.contact-form');
    const successModal = document.getElementById('success-modal');
    const successModalClose = document.getElementById('success-modal-close');

    if (contactForm) {
        const showSuccessModal = () => {
            if (!successModal) return;
            successModal.classList.add('active');
            successModal.setAttribute('aria-hidden', 'false');
        };

        const hideSuccessModal = () => {
            if (!successModal) return;
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
        };

        if (successModalClose) {
            successModalClose.addEventListener('click', hideSuccessModal);
        }

        successModal?.addEventListener('click', (e) => {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    headers: {
                        Accept: 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    contactForm.reset();
                    showSuccessModal();
                } else {
                    console.error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error', error);
            }
        });
    }
});