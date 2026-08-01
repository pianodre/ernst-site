/**
 * Dylan Ernst Piano Studio
 * Hero 3D — pinned scroll story with the grand piano model.
 *
 * The hero pins on screen while the user scrolls through the track;
 * scroll progress drives the camera along keyframed poses and
 * cross-fades the text phases. Falls back to the static hero when
 * WebGL is unavailable, the model fails to load, or the user prefers
 * reduced motion.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ===== Config — tweak the whole animation from here =====

const MODEL_URL = 'content/models/grand-piano.glb';
const MAX_PIXEL_RATIO = 1.75;
const PROGRESS_SMOOTHING = 6; // higher = snappier camera catch-up

// Camera poses along the scroll (progress 0 → 1). Positions are in
// normalized model units (piano's largest dimension = 2).
// Everything freezes from HOLD_START to 1 — a short still beat so the
// story feels finished before the page releases into About.
const HOLD_START = 0.93;

// The piano stops rotating at the overhead pose (third keyframe) so the
// final zoom-out is pure vertical motion — no rotate-then-zoom kink.
const YAW_END = 0.74;

const CAMERA_KEYFRAMES = [
    { at: 0.0, pos: [2.4, 1.1, 3.1], look: [0, 0.55, 0] },   // 3/4 front, wide — piano low in frame
    { at: 0.36, pos: [-2.0, 0.6, 1.6], look: [0, 0.3, 0] },  // keyboard side, close
    { at: 0.74, pos: [0.7, 2.6, 1.0], look: [0, 0.1, 0] },   // high over the open lid
    { at: HOLD_START, pos: [0.7, 3.9, 1.0], look: [0, 0.1, 0] }, // straight up — zoom out to finish
    { at: 1.0, pos: [0.7, 3.9, 1.0], look: [0, 0.1, 0] }     // hold — no motion until release
];

// Slow yaw applied to the piano itself for extra parallax (radians).
const MODEL_YAW = { from: -0.35, to: 0.64 };

// Text phase visibility windows: fully visible between `in` and `out`,
// fading over `fade` of progress on each side.
const TEXT_PHASES = [
    { selector: '.hero-phase-1', in: 0.0, out: 0.16, fade: 0.075 },
    { selector: '.hero-phase-2', in: 0.31, out: 0.43, fade: 0.075 },
    { selector: '.hero-phase-3', in: 0.59, out: 1.01, fade: 0.075 }
];

// ===== Setup =====

const hero = document.querySelector('.hero');
const track = document.querySelector('.hero-track');
const stage = document.querySelector('.hero-stage');
const canvas = document.querySelector('.hero-canvas');
const scrollHint = document.querySelector('.hero-scroll');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function supportsWebGL() {
    try {
        const test = document.createElement('canvas');
        return !!(test.getContext('webgl2') || test.getContext('webgl'));
    } catch (e) {
        return false;
    }
}

// Static hero (one screen, photo background, no pin) when 3D can't run.
function useStaticHero() {
    hero.classList.add('hero-static');
    hero.classList.remove('hero-3d');
}

if (!hero || !track || !stage || !canvas || !supportsWebGL()) {
    if (hero) useStaticHero();
} else {
    initHero3D();
}

function initHero3D() {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);

    // Neutral studio reflections — a glossy black piano is all reflections.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff2dd, 1.4);
    keyLight.position.set(3, 5, 2);
    scene.add(keyLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const pivot = new THREE.Group();
    scene.add(pivot);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(MODEL_URL, (gltf) => {
        preparePiano(gltf.scene);
        pivot.add(gltf.scene);
        hero.classList.add('hero-3d');
        start();
    }, undefined, (error) => {
        console.error('Hero 3D: failed to load piano model', error);
        useStaticHero();
    });

    // Center the piano at the origin and normalize its size so the
    // camera keyframes work regardless of the model's native scale.
    function preparePiano(model) {
        model.traverse((node) => {
            if (!node.isMesh) return;
            const material = node.material;
            // Sketchfab exports everything as double-sided BLEND, which
            // breaks depth sorting — only the logo decal needs blending.
            if (material && !/logo/i.test(material.name)) {
                material.transparent = false;
                material.depthWrite = true;
                material.side = THREE.FrontSide;
            }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2 / Math.max(size.x, size.y, size.z);

        model.scale.setScalar(scale);
        model.position.set(
            -center.x * scale,
            -box.min.y * scale - 0.5, // rest slightly below stage center
            -center.z * scale
        );
    }

    // ===== Scroll-driven animation =====

    let targetProgress = 0;
    let currentProgress = -1; // force first render
    let heroVisible = true;
    let lastTime = performance.now();

    function readScrollProgress() {
        const range = track.offsetHeight - stage.offsetHeight;
        if (range <= 0) return 0;
        const scrolled = -track.getBoundingClientRect().top;
        return Math.min(1, Math.max(0, scrolled / range));
    }

    function resize() {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        currentProgress = -1; // re-render at current pose
    }

    function poseCamera(progress) {
        // Find the keyframe segment containing `progress` and ease across it.
        let a = CAMERA_KEYFRAMES[0];
        let b = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
        for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
            if (progress >= CAMERA_KEYFRAMES[i].at && progress <= CAMERA_KEYFRAMES[i + 1].at) {
                a = CAMERA_KEYFRAMES[i];
                b = CAMERA_KEYFRAMES[i + 1];
                break;
            }
        }
        const span = b.at - a.at || 1;
        const t = Math.min(1, Math.max(0, (progress - a.at) / span));
        const eased = t * t * (3 - 2 * t); // smoothstep

        camera.position.set(
            a.pos[0] + (b.pos[0] - a.pos[0]) * eased,
            a.pos[1] + (b.pos[1] - a.pos[1]) * eased,
            a.pos[2] + (b.pos[2] - a.pos[2]) * eased
        );
        camera.lookAt(
            a.look[0] + (b.look[0] - a.look[0]) * eased,
            a.look[1] + (b.look[1] - a.look[1]) * eased,
            a.look[2] + (b.look[2] - a.look[2]) * eased
        );

        const yawT = Math.min(1, progress / YAW_END);
        const yawEased = yawT * yawT * (3 - 2 * yawT); // ease out so the rotation lands gently
        pivot.rotation.y = MODEL_YAW.from + (MODEL_YAW.to - MODEL_YAW.from) * yawEased;
    }

    const phaseElements = TEXT_PHASES.map((phase) => ({
        ...phase,
        el: stage.querySelector(phase.selector)
    })).filter((phase) => phase.el);

    function updateText(progress) {
        phaseElements.forEach((phase) => {
            const fadeIn = phase.in <= 0 ? 1
                : Math.min(1, Math.max(0, (progress - phase.in) / phase.fade + 1));
            const fadeOut = Math.min(1, Math.max(0, (phase.out - progress) / phase.fade + 1));
            const opacity = Math.min(fadeIn, fadeOut);

            phase.el.style.opacity = opacity.toFixed(3);
            phase.el.style.transform = `translateY(${(1 - opacity) * 24}px)`;
            phase.el.classList.toggle('is-active', opacity > 0.5);
            phase.el.setAttribute('aria-hidden', opacity <= 0.01 ? 'true' : 'false');
        });

        if (scrollHint) {
            scrollHint.classList.toggle('is-hidden', progress > 0.03);
        }
    }

    function frame(now) {
        requestAnimationFrame(frame);
        if (!heroVisible) return;

        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        targetProgress = readScrollProgress();
        const delta = targetProgress - currentProgress;
        if (Math.abs(delta) < 0.0005) return; // settled — skip the render

        currentProgress = currentProgress < 0
            ? targetProgress
            : currentProgress + delta * Math.min(1, PROGRESS_SMOOTHING * dt);

        poseCamera(currentProgress);
        updateText(currentProgress);
        renderer.render(scene, camera);
    }

    function start() {
        resize();

        if (prefersReducedMotion) {
            // Single static frame at the opening pose — no pin, no motion.
            useStaticHero();
            hero.classList.add('hero-3d'); // keep the canvas visible
            poseCamera(0);
            renderer.render(scene, camera);
            return;
        }

        window.addEventListener('resize', resize);

        // Don't render while the hero is scrolled out of view.
        new IntersectionObserver((entries) => {
            heroVisible = entries[0].isIntersecting;
            if (heroVisible) currentProgress = -1;
        }).observe(track);

        requestAnimationFrame(frame);
    }
}
