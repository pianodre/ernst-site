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

    // Navbar shadow + compact size on scroll
    const navbar = document.querySelector('.navbar');

    const updateNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Scroll spy — highlight the nav link for the section in view
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const spySections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveLink = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        let current = spySections[0];

        spySections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                current = section;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
        });
    };

    if (spySections.length) {
        window.addEventListener('scroll', setActiveLink, { passive: true });
        setActiveLink();
    }

    // Scroll-reveal animations
    const revealElements = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
        // Toggle (not one-shot) so elements replay their reveal when
        // scrolled back into view from either direction
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('revealed', entry.isIntersecting);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                // Scroll slightly into the section so its content sits closer to
                // the top; data-scroll-offset adds a per-section correction
                const extra = parseInt(target.dataset.scrollOffset, 10) || 0;
                const targetPosition = target.offsetTop - navHeight + 48 + extra;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Footer copyright year
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Years-of-experience figures, computed from a start year
    document.querySelectorAll('[data-years-since]').forEach(el => {
        const startYear = parseInt(el.dataset.yearsSince, 10);
        if (!isNaN(startYear)) {
            el.textContent = new Date().getFullYear() - startYear;
        }
    });

    // Contact form submission
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSuccessModal();
            }
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

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
                    alert('Sorry, there was an error sending your message. Please try again or email me directly.');
                }
            } catch (error) {
                alert('Sorry, there was an error sending your message. Please try again or email me directly.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
