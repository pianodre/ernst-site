/**
 * Dylan Ernst Piano Studio
 * Senior recital program — cover flip, expandable program notes,
 * and scroll reveals. Without JS the cover is hidden and the full
 * program renders static (see css/recital.css).
 */

document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cover = document.getElementById('cover');
    const program = document.getElementById('program');
    const openButton = document.getElementById('open-program');

    // ===== Cover flip =====

    function openProgram() {
        // The page behind the cover can be scrolled — land at the top of
        // the program, jumping instantly so the flip hides the movement
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        cover.classList.add('flipped');
        program.classList.add('open');
        program.focus({ preventScroll: true });

        // Drop the cover from the layout once the page turn finishes
        const settle = () => cover.classList.add('gone');
        if (reduceMotion) {
            settle();
        } else {
            cover.addEventListener('transitionend', settle, { once: true });
            setTimeout(settle, 1500); // fallback if transitionend never fires
        }
    }

    // Direct links to a program anchor (e.g. #anchor-second-half) skip the cover
    if (window.location.hash) {
        document.documentElement.classList.add('skip-cover');
        cover.classList.add('gone');
        program.classList.add('open');
    } else if (openButton) {
        openButton.addEventListener('click', openProgram);
    }

    // ===== Expandable program notes =====

    document.querySelectorAll('.note-toggle').forEach((toggle) => {
        const note = document.getElementById(toggle.getAttribute('aria-controls'));
        if (!note) return;
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            note.classList.toggle('open', !expanded);
        });
    });

    // ===== Scroll reveals (bidirectional, same pattern as the main site) =====

    const revealElements = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('revealed', entry.isIntersecting);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('revealed'));
    }
});
