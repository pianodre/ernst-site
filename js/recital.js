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
    const bioPage = document.getElementById('gallery');
    const openButton = document.getElementById('open-program');
    const coverBioButton = document.getElementById('open-bio-cover');
    const backButton = document.getElementById('back-to-program');
    const coverBackButton = document.getElementById('back-to-cover');

    // ===== Page turns (cover → program → performer page) =====

    // Pages behind a turning sheet can be scrolled — always land at the
    // top, jumping instantly so the flip hides the movement
    const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Run after a sheet's turn: on transitionend, with a timeout fallback
    // in case the transition never fires
    function afterTurn(el, settle) {
        let done = false;
        const once = () => {
            if (done) return;
            done = true;
            settle();
        };
        el.addEventListener('transitionend', once, { once: true });
        setTimeout(once, 1500);
    }

    function openProgram() {
        jumpToTop();
        cover.classList.add('flipped');
        program.classList.add('open');
        program.focus({ preventScroll: true });

        // Drop the cover from the layout once the page turn finishes
        if (reduceMotion) {
            cover.classList.add('gone');
        } else {
            afterTurn(cover, () => cover.classList.add('gone'));
        }
    }

    // From the cover, jump straight to the performer page: park the
    // program out of the way (already turned), then turn the cover
    function openBioFromCover() {
        jumpToTop();
        program.classList.add('open', 'sheet', 'flipped', 'gone');
        bioPage.classList.add('open');
        bioPage.focus({ preventScroll: true });
        cover.classList.add('flipped');

        if (reduceMotion) {
            cover.classList.add('gone');
        } else {
            afterTurn(cover, () => cover.classList.add('gone'));
        }
    }

    function backToCover() {
        jumpToTop();
        cover.classList.remove('gone');

        const settle = () => {
            program.classList.remove('open');
            if (openButton) openButton.focus({ preventScroll: true });
        };
        if (reduceMotion) {
            cover.classList.remove('flipped');
            settle();
            return;
        }
        void cover.offsetWidth; // commit the un-hidden cover before turning it back
        cover.classList.remove('flipped');
        afterTurn(cover, settle);
    }

    function backToProgram() {
        jumpToTop();
        program.classList.remove('gone');

        const settle = () => {
            program.classList.remove('sheet');
            bioPage.classList.remove('open');
            program.focus({ preventScroll: true });
        };
        if (reduceMotion) {
            program.classList.remove('flipped');
            settle();
            return;
        }
        void program.offsetWidth; // commit the un-hidden sheet before turning it back
        program.classList.remove('flipped');
        afterTurn(program, settle);
    }

    if (coverBioButton) coverBioButton.addEventListener('click', openBioFromCover);
    if (backButton) backButton.addEventListener('click', backToProgram);
    if (coverBackButton) coverBackButton.addEventListener('click', backToCover);

    // Direct links skip the cover: #gallery opens the performer page,
    // any other anchor (e.g. #anchor-second-half) opens the program
    if (window.location.hash) {
        document.documentElement.classList.add('skip-cover');
        cover.classList.add('gone');
        if (window.location.hash === '#gallery') {
            program.classList.add('open', 'sheet', 'flipped', 'gone');
            bioPage.classList.add('open');
        } else {
            program.classList.add('open');
        }
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
