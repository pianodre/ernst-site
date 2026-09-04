/**
 * Dylan Ernst Piano Studio
 * Recital page — pre-paint boot. Loaded synchronously in <head> so the gate
 * and anchor state are settled before the first frame and the cover never
 * flashes. The recital date lives here because both this file and
 * js/recital.js need it; it is the single place to change it.
 */

(function () {
    'use strict';

    // Both written in Pacific Time (-07:00, PDT on this date) so they mean the
    // same thing from any timezone the page is opened in.
    //   START — the recital itself, the time printed on the cover.
    //   OPENS — when the program unlocks: midnight that morning, so it is
    //           readable all day rather than only from the downbeat.
    var START = new Date('2026-10-11T17:00:00-07:00');
    var OPENS = new Date('2026-10-11T00:00:00-07:00');

    var root = document.documentElement;
    var unlocked = Date.now() >= OPENS.getTime();

    // Namespaced so js/recital.js reads the same config without a second copy
    window.RECITAL = { start: START, opens: OPENS };

    root.classList.add('js');
    if (unlocked) root.classList.add('unlocked');

    // Direct links skip the cover, but only to a page that is actually open:
    // the performer page always, the program only once the recital has begun
    var hash = window.location.hash;
    if (hash === '#gallery' || (unlocked && hash)) root.classList.add('skip-cover');
}());
