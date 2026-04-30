/* ===================================
   ADVANCED HORIZONTAL SCROLL SERVICES
   GSAP ScrollTrigger Pinned Animation
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initHorizontalScroll();
            initProgressIndicator();
        } else {
            console.warn('⚠️ GSAP not loaded, using fallback');
            initFallback();
        }
    }

    /* ===================================
       GSAP HORIZONTAL SCROLL
       =================================== */
    function initHorizontalScroll() {
        gsap.registerPlugin(ScrollTrigger);

        const track = document.querySelector('.services-track');
        const cards = document.querySelectorAll('.service-card-advanced');
        const wrapper = document.querySelector('.services-horizontal-wrapper');

        if (!track || !cards.length || !wrapper) {
            console.warn('⚠️ Services elements not found');
            return;
        }

        // Calculate scroll distance
        const getScrollAmount = () => {
            const trackWidth = track.scrollWidth;
            return -(trackWidth - window.innerWidth);
        };

        // Create horizontal scroll animation
        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: () => `+=${track.scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                markers: false // Set to true for debugging
            }
        });

        // Parallax effect on cards
        cards.forEach((card, index) => {
            const icon = card.querySelector('.card-service-icon');
            const badge = card.querySelector('.card-number-badge');
            
            if (icon) {
                gsap.to(icon, {
                    y: -50,
                    scrollTrigger: {
                        trigger: card,
                        start: 'left right',
                        end: 'right left',
                        scrub: 1,
                        containerAnimation: tween
                    }
                });
            }

            if (badge) {
                gsap.to(badge, {
                    rotation: 180,
                    scrollTrigger: {
                        trigger: card,
                        start: 'left right',
                        end: 'right left',
                        scrub: 1,
                        containerAnimation: tween
                    }
                });
            }

            // Fade in cards
            gsap.from(card, {
                opacity: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: card,
                    start: 'left 80%',
                    end: 'left 50%',
                    scrub: 1,
                    containerAnimation: tween
                }
            });
        });

        // Update on resize
        ScrollTrigger.addEventListener('refreshInit', () => {
            gsap.set(track, { x: 0 });
        });

        console.log('✅ Horizontal scroll initialized');
    }

    /* ===================================
       PROGRESS INDICATOR
       =================================== */
    function initProgressIndicator() {
        const wrapper = document.querySelector('.services-horizontal-wrapper');
        const dots = document.querySelectorAll('.progress-dot');
        const cards = document.querySelectorAll('.service-card-advanced');

        if (!wrapper || !dots.length || !cards.length) return;

        const track = document.querySelector('.services-track');

        ScrollTrigger.create({
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${track.scrollWidth}`,
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const activeIndex = Math.min(
                    Math.floor(progress * cards.length),
                    cards.length - 1
                );

                dots.forEach((dot, i) => {
                    if (i === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });

        // Click to scroll
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const cardPosition = cards[index].offsetLeft;
                const scrollAmount = -cardPosition + (window.innerWidth / 2) - (cards[index].offsetWidth / 2);
                
                gsap.to('.services-track', {
                    x: scrollAmount,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            });
        });

        console.log('✅ Progress indicator initialized');
    }

    /* ===================================
       FALLBACK (NO GSAP)
       =================================== */
    function initFallback() {
        const track = document.querySelector('.services-track');
        const wrapper = document.querySelector('.services-horizontal-wrapper');

        if (!track || !wrapper) return;

        wrapper.style.overflowX = 'auto';
        wrapper.style.overflowY = 'hidden';
        track.style.display = 'flex';
        track.style.gap = '60px';

        // Mouse drag scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            wrapper.style.cursor = 'grabbing';
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        console.log('✅ Fallback scroll initialized');
    }

})();
