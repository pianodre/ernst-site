/**
 * Dylan Ernst Piano Studio
 * Senior recital — countdown cover, cover flip, expandable program notes,
 * and scroll reveals. The program is sealed until the recital starts: the
 * countdown unlocks it on the minute, and the date itself lives in
 * js/recital-boot.js. Without JS the page stays on the cover.
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
    const root = document.documentElement;

    // The gate: set before first paint by js/recital-boot.js, and again here
    // if the countdown runs out while someone has the page open
    const isUnlocked = () => root.classList.contains('unlocked');

    // ===== Countdown to the recital =====

    // Counts down to the unlock, not to the downbeat: the program opens at
    // midnight so it can be read all day before the recital
    const openTime = (window.RECITAL && window.RECITAL.opens instanceof Date)
        ? window.RECITAL.opens.getTime()
        : NaN;
    const statusLine = document.getElementById('cover-status');
    const digits = {};
    document.querySelectorAll('[data-countdown]').forEach((el) => {
        digits[el.getAttribute('data-countdown')] = el;
    });

    const pad = (value) => String(value).padStart(2, '0');

    function paintCountdown(msLeft) {
        const total = Math.floor(Math.max(0, msLeft) / 1000);
        const parts = {
            days: Math.floor(total / 86400),
            hours: Math.floor(total / 3600) % 24,
            minutes: Math.floor(total / 60) % 60,
            seconds: total % 60,
        };
        Object.keys(parts).forEach((unit) => {
            if (digits[unit]) digits[unit].textContent = pad(parts[unit]);
        });
    }

    function unlock() {
        root.classList.add('unlocked');
        paintCountdown(0);
        if (statusLine) statusLine.textContent = 'The program is open.';
    }

    // A bad date would leave the countdown at its placeholder rather than
    // print NaN, and the page stays locked — the safe direction to fail
    if (Number.isNaN(openTime)) {
        if (statusLine) statusLine.textContent = 'The program opens on the day of the recital.';
    } else if (isUnlocked()) {
        unlock();
    } else {
        // Every tick recomputes from the clock instead of decrementing, so a
        // throttled background tab or a slept laptop returns to the right
        // number. The interval is cleared the moment it runs out.
        const tick = () => {
            const msLeft = openTime - Date.now();
            paintCountdown(msLeft);
            if (msLeft > 0) return;
            window.clearInterval(timer);
            unlock();
        };
        const timer = window.setInterval(tick, 1000);
        tick();
    }

    // ===== Page turns (cover → program → performer page) =====

    // Every page lands at its top, but never visibly: the jump runs either
    // before first paint or at settle, hidden behind the covering sheet
    const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Run after a sheet's turn: on the sheet's own transitionend — child
    // transitions (e.g. a button's hover) bubble up here and must not cut
    // the turn short — with a timeout fallback in case it never fires
    function afterTurn(el, settle) {
        let done = false;
        const once = (event) => {
            if (event && event.target !== el) return;
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', once);
            settle();
        };
        el.addEventListener('transitionend', once);
        setTimeout(once, 1800); // just past the 1.4s turn in css/recital.css
    }

    function openProgram() {
        if (!isUnlocked()) return;
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
        cover.classList.remove('gone');

        const settle = () => {
            jumpToTop();
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
        if (!isUnlocked()) return;
        program.classList.remove('gone');

        const settle = () => {
            jumpToTop();
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

    // Program → performer page: the program itself becomes a sheet and
    // turns forward, revealing the bio beneath. The sheet keeps showing
    // the spot the reader was at (scrollTop) while the window resets
    // beneath it, so nothing visibly jumps
    function openBioFromProgram() {
        const readingOffset = window.scrollY;
        program.classList.add('sheet');
        program.scrollTop = readingOffset;
        jumpToTop();
        bioPage.classList.add('open');
        bioPage.focus({ preventScroll: true });

        const settle = () => {
            // Reset while still rendered — scrollTop is a no-op once hidden
            program.scrollTop = 0;
            program.classList.add('gone');
        };
        if (reduceMotion) {
            program.classList.add('flipped');
            settle();
            return;
        }
        void program.offsetWidth; // commit the sheet before turning it
        program.classList.add('flipped');
        afterTurn(program, settle);
    }

    // Performer page → cover: two pages back — turn the cover back in,
    // then reset the parked program behind it
    function backToCoverFromBio() {
        cover.classList.remove('gone');

        const settle = () => {
            jumpToTop();
            bioPage.classList.remove('open');
            program.classList.remove('open', 'sheet', 'flipped', 'gone');
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

    if (coverBioButton) coverBioButton.addEventListener('click', openBioFromCover);
    if (backButton) backButton.addEventListener('click', backToProgram);
    if (coverBackButton) coverBackButton.addEventListener('click', backToCover);

    // The remaining page turns: each footer's nav, plus the performer page's
    // back button, which returns to the cover while the program is still sealed
    const navPairs = [
        ['nav-program-cover', backToCover],
        ['nav-program-bio', openBioFromProgram],
        ['back-to-cover-top', backToCoverFromBio],
        ['nav-bio-cover', backToCoverFromBio],
        ['nav-bio-program', backToProgram],
    ];
    navPairs.forEach(([id, turn]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener('click', turn);
    });

    // Direct links skip the cover, mirroring js/recital-boot.js: #gallery
    // opens the performer page, any other anchor opens the program. A program
    // anchor followed before the recital lands on the cover instead.
    const hash = window.location.hash;
    if (hash === '#gallery') {
        root.classList.add('skip-cover');
        cover.classList.add('gone');
        program.classList.add('open', 'sheet', 'flipped', 'gone');
        bioPage.classList.add('open');
    } else if (hash && isUnlocked()) {
        root.classList.add('skip-cover');
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
