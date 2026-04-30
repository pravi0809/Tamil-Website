/* ===================================
   PARALLAX.JS - Mouse & Scroll Parallax
   OPTIMIZED FOR PERFORMANCE 2026
   =================================== */

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallax);
    } else {
        initParallax();
    }

    function initParallax() {
        if (prefersReducedMotion) {
            console.log('⚠️ Parallax disabled - user prefers reduced motion');
            return;
        }

        initMouseParallax();
        initTiltEffect();
        initIconFollow();
        initScrollParallax();
        
        console.log('✅ Parallax effects initialized');
    }

    /* ===================================
       MOUSE PARALLAX FOR CHARACTERS
       =================================== */
    function initMouseParallax() {
        const characters = document.querySelectorAll('.character');
        const hero = document.querySelector('.hero-section, .hero');

        if (!hero || characters.length === 0) {
            console.warn('No hero section or characters found');
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isAnimating = false;

        // Track mouse position with throttle
        let lastMoveTime = 0;
        hero.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime < 16) return; // ~60fps throttle
            lastMoveTime = now;

            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
            mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;

            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animate);
            }
        });

        // Reset on mouse leave
        hero.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });

        // Smooth animation loop with RAF
        function animate() {
            // Smooth interpolation (ease out)
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            // Apply transforms with GPU acceleration
            characters.forEach((character, index) => {
                const speed = (index + 1) * 20; // Different speed for layering
                const x = currentX * speed;
                const y = currentY * speed;
                
                // Use translate3d for GPU acceleration
                character.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });

            // Continue animation if still moving
            if (Math.abs(currentX - mouseX) > 0.001 || Math.abs(currentY - mouseY) > 0.001) {
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
            }
        }

        console.log(`✅ Mouse parallax initialized for ${characters.length} characters`);
    }

    /* ===================================
       TILT EFFECT FOR CARDS
       =================================== */
    function initTiltEffect() {
        const cards = document.querySelectorAll('.service-card, .project-card, .service-scroll-card');

        if (cards.length === 0) return;

        // Only enable on non-touch devices
        if (isTouchDevice()) {
            console.log('⚠️ Tilt effect disabled on touch device');
            return;
        }

        cards.forEach(card => {
            let tiltTimeout;

            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform';
            });

            card.addEventListener('mousemove', (e) => {
                clearTimeout(tiltTimeout);
                handleTilt(e);
            });

            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
                resetTilt(card);
            });
        });

        function handleTilt(e) {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Reduced intensity for smoother effect
            const rotateX = ((y - centerY) / centerY) * 8; // Max 8deg
            const rotateY = ((centerX - x) / centerX) * 8;
            
            // Use translate3d for GPU acceleration
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translate3d(0, -2px, 0) 
                scale(1.02)
            `;

            // Optional: Move gradient with cursor
            const visualBg = card.querySelector('.visual-bg');
            if (visualBg) {
                const gradientX = (x / rect.width) * 100;
                const gradientY = (y / rect.height) * 100;
                visualBg.style.backgroundPosition = `${gradientX}% ${gradientY}%`;
            }
        }

        function resetTilt(card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translate3d(0, 0, 0) scale(1)';
            
            const visualBg = card.querySelector('.visual-bg');
            if (visualBg) {
                visualBg.style.backgroundPosition = 'center';
            }
        }

        console.log(`✅ Tilt effect initialized for ${cards.length} cards`);
    }

    /* ===================================
       FLOATING ICONS MOUSE FOLLOW
       =================================== */
    function initIconFollow() {
        const icons = document.querySelectorAll('.floating-icon, .float-element');
        
        if (icons.length === 0) return;

        let mouseX = 0;
        let mouseY = 0;
        let animationId;

        // Throttled mouse tracking
        let lastTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < 16) return;
            lastTime = now;

            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!animationId) {
                animationId = requestAnimationFrame(updateIcons);
            }
        });

        function updateIcons() {
            icons.forEach((icon, index) => {
                const speed = (index + 1) * 0.3;
                const x = (mouseX * speed) / 100;
                const y = (mouseY * speed) / 100;
                
                // Use translate3d for performance
                icon.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });

            animationId = null;
        }

        console.log(`✅ Icon follow initialized for ${icons.length} icons`);
    }

    /* ===================================
       SCROLL PARALLAX (GSAP ENHANCED)
       =================================== */
    function initScrollParallax() {
        // Only if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded - using fallback scroll parallax');
            initFallbackScrollParallax();
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            
            gsap.to(element, {
                yPercent: speed * 100,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        });

        console.log(`✅ Scroll parallax initialized for ${parallaxElements.length} elements`);
    }

    /* ===================================
       FALLBACK SCROLL PARALLAX (NO GSAP)
       =================================== */
    function initFallbackScrollParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                
                // Only animate visible elements
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        }

        console.log(`✅ Fallback scroll parallax initialized`);
    }

    /* ===================================
       UTILITY: DETECT TOUCH DEVICE
       =================================== */
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    /* ===================================
       CLEANUP ON PAGE UNLOAD
       =================================== */
    window.addEventListener('beforeunload', () => {
        // Remove event listeners to prevent memory leaks
        document.removeEventListener('mousemove', () => {});
    });

})();
