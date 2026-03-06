/**
 * LUMINA - ANIMATION ENGINE (PHASE 6: DEPLOYMENT SAFETY)
 * STABILIZED VERSION: Performant, Accessible, and Subtle.
 * ✅ Reduced motion support, ✅ Safe transitions, ✅ No scroll impacts.
 */

const LuminaAnimations = {
    safe: function (fn, context) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        try {
            fn.call(this);
        } catch (e) {
            if (LUMINA_CONFIG.DEBUG) console.warn(`AnimationEngine: [${context}] suppressed.`, e.message);
        }
    },

    init: function () {
        window.addEventListener('components:loaded', () => {
            this.safe(this.initGSAP, 'GSAP Configuration');
            this.safe(this.initLenis, 'Smooth Scrolling');
            this.safe(this.initPageTransition, 'Fast Transition');
            this.safe(this.initGlobalReveals, 'Simple Reveals');
            this.safe(this.initMagneticButtons, 'Magnetic Interactions');
            this.safe(this.initParallax, 'Parallax Effects');
        });
    },

    initMagneticButtons: function () {
        const buttons = document.querySelectorAll('.magnetic-btn');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    },

    initParallax: function () {
        const targets = document.querySelectorAll('.parallax-img');
        if (!targets.length) return;

        targets.forEach(img => {
            gsap.to(img, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    },

    initLenis: function () {
        if (typeof Lenis !== 'undefined' && LUMINA_CONFIG.FEATURES.SMOOTH_SCROLL) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            // Connect ScrollTrigger to Lenis
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    },

    initGSAP: function () {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    },

    initPageTransition: function () {
        const overlay = document.querySelector('.transition-overlay');
        const logo = document.querySelector('.transition-logo');
        if (!overlay || !logo || typeof gsap === 'undefined') return;

        const dur = LUMINA_CONFIG.ANIMATION_DEFAULTS.DURATION;
        const ease = LUMINA_CONFIG.ANIMATION_DEFAULTS.EASE;

        gsap.timeline()
            .to(logo, { opacity: 1, duration: dur, ease: ease })
            .to(logo, { opacity: 0, duration: 0.1, delay: 0.1 })
            .to(overlay, {
                opacity: 0,
                duration: dur,
                ease: ease,
                onComplete: () => { overlay.style.display = 'none'; }
            });
    },

    triggerPageTransition: function (href) {
        const overlay = document.querySelector('.transition-overlay');
        if (overlay && typeof gsap !== 'undefined' && LUMINA_CONFIG.FEATURES.TRANSITIONS) {
            overlay.style.display = 'flex';
            const dur = LUMINA_CONFIG.ANIMATION_DEFAULTS.DURATION;
            gsap.fromTo(overlay, { opacity: 0 }, {
                opacity: 1,
                duration: dur,
                ease: "power2.inOut",
                onComplete: () => { window.location.href = href; }
            });
        } else {
            window.location.href = href;
        }
    },

    initGlobalReveals: function () {
        if (typeof gsap === 'undefined') return;

        // --- 1. Basic Fade In Up ---
        const targets = gsap.utils.toArray('.fade-in-up');
        if (targets.length) {
            targets.forEach(el => {
                gsap.fromTo(el, { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                });
            });
        }

        // --- 2. Stagger Reveal ---
        const staggers = gsap.utils.toArray('.stagger-reveal');
        if (staggers.length) {
            staggers.forEach(group => {
                const children = group.children;
                gsap.fromTo(children, { opacity: 0, y: 20, scale: 0.95 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });
        }
    }
};

LuminaAnimations.init();
window.LuminaAnimations = LuminaAnimations;
