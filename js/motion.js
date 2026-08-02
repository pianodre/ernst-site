/**
 * Dylan Ernst Piano Studio
 * Scroll motion — parallax drift and count-up stats.
 * Everything here is decorative: with reduced motion (or no JS) the
 * page renders complete and static.
 */

// Parallax drift never exceeds this, so elements stay inside their section
var PARALLAX_MAX_PX = 8;

document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ===== Count-up numbers (.stats-band) =====

    function animateCount(el) {
        // The first run replaces the element's markup with plain text, so
        // remember the original value to re-count from on later passes
        if (!el.dataset.countTarget) el.dataset.countTarget = el.textContent.trim();
        const raw = el.dataset.countTarget;
        const target = parseFloat(raw);
        if (isNaN(target)) return;
        const decimals = raw.includes('.') ? 1 : 0;
        const duration = 1200;
        const start = performance.now();

        // Cancel any in-flight count so re-entries don't fight over textContent
        if (el._countRaf) cancelAnimationFrame(el._countRaf);

        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals);
            el._countRaf = t < 1 ? requestAnimationFrame(tick) : null;
        }
        el._countRaf = requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll('[data-countup]');
    if (counters.length && 'IntersectionObserver' in window) {
        // Kept observing (not one-shot) so the numbers re-count each time
        // the stats band scrolls back into view
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCount(entry.target);
            });
        }, { threshold: 0.6 });
        counters.forEach((el) => countObserver.observe(el));
    }

    // ===== Parallax drift ([data-parallax="speed"]) =====
    // Offset is measured from the parent so the element's own transform
    // doesn't feed back into the next frame's position.

    const items = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
        el,
        speed: parseFloat(el.dataset.parallax) || 0.08,
        visible: false
    }));
    if (!items.length) return;

    if ('IntersectionObserver' in window) {
        const visObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const item = items.find((i) => i.el === entry.target);
                if (item) item.visible = entry.isIntersecting;
            });
            requestTick();
        }, { rootMargin: '80px' });
        items.forEach((item) => visObserver.observe(item.el));
    } else {
        items.forEach((item) => { item.visible = true; });
    }

    let ticking = false;

    function requestTick() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    function update() {
        ticking = false;
        const viewportMid = window.innerHeight / 2;
        items.forEach((item) => {
            if (!item.visible) return;
            const anchor = item.el.parentElement || item.el;
            const rect = anchor.getBoundingClientRect();
            const raw = (rect.top + rect.height / 2 - viewportMid) * -item.speed;
            const offset = Math.max(-PARALLAX_MAX_PX, Math.min(PARALLAX_MAX_PX, raw));
            item.el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
        });
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    requestTick();
});
