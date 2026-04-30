/* ===================================
   SCROLL REVEAL - CARDS VISIBLE FIX
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // FORCE CARDS VISIBLE IMMEDIATELY
        forceCardsVisible();
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ Using GSAP for scroll reveals');
            initGSAPScroll();
        } else {
            console.log('✅ Using vanilla JS for scroll reveals');
            initVanillaScroll();
        }
        
        initSmoothScroll();
    }

    /* ===================================
       FORCE CARDS VISIBLE (CRITICAL FIX)
       =================================== */
    function forceCardsVisible() {
        // ✅ UPDATED - Support both old and new card classes
        const cardSelectors = [
            '.service-card-advanced',  // New cards
            '.service-scroll-card',     // Old cards
        ];
        
        let totalCards = 0;
        
        cardSelectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            if (cards.length > 0) {
                cards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.visibility = 'visible';
                });
                totalCards += cards.length;
            }
        });
        
        // Force services section visible
        const servicesSections = [
            '.services-scroll',
            '.services-horizontal-wrapper'
        ];
        
        servicesSections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.visibility = 'visible';
            }
        });
        
        if (totalCards > 0) {
            console.log(`✅ ${totalCards} service cards forced visible`);
        }
    }

    /* ===================================
       GSAP SCROLL
       =================================== */
    function initGSAPScroll() {
        gsap.registerPlugin(ScrollTrigger);

        const hero = document.querySelector('.hero');
        const services = document.querySelector('.services-scroll, .services-horizontal-wrapper');

        if (!hero) {
            console.warn('⚠️ Hero section not found');
        }

        if (!services) {
            console.warn('⚠️ Services section not found');
        }

        // Hero fades away
        if (hero) {
            gsap.to(hero, {
                opacity: 0,
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: '+=800',
                    scrub: 1
                }
            });

            // Hero content fades
            gsap.to('.hero-wrapper', {
                opacity: 0,
                y: -100,
                scale: 0.9,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: '+=600',
                    scrub: 1.2
                }
            });
        }

        // Service cards - Support both card types
        if (services) {
            const cards = document.querySelectorAll('.service-card-advanced, .service-scroll-card');
            
            if (cards.length > 0) {
                // Cards are already visible, just add subtle entrance animation
                ScrollTrigger.create({
                    trigger: services,
                    start: 'top 70%',
                    once: true,
                    onEnter: () => {
                        cards.forEach((card, i) => {
                            setTimeout(() => {
                                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, i * 100);
                        });
                        console.log(`✅ ${cards.length} cards animated on scroll`);
                    }
                });
            }
        }

        // Projects section
        const projects = document.querySelector('.projects-featured');
        if (projects) {
            gsap.from(projects, {
                scrollTrigger: {
                    trigger: projects,
                    start: 'top 80%',
                    once: true
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        // About section
        const about = document.querySelector('.about-section, #about');
        if (about) {
            gsap.from(about, {
                scrollTrigger: {
                    trigger: about,
                    start: 'top 80%',
                    once: true
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        console.log('✅ GSAP scroll initialized');
    }

    /* ===================================
       VANILLA JS SCROLL
       =================================== */
    function initVanillaScroll() {
        const hero = document.querySelector('.hero');
        if (!hero) {
            console.warn('⚠️ Hero not found for vanilla scroll');
            return;
        }

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        function updateScroll() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            const progress = Math.min(scrollY / heroHeight, 1);

            hero.style.opacity = 1 - progress;
            hero.style.transform = `translateY(${-progress * 50}px)`;

            const wrapper = hero.querySelector('.hero-wrapper');
            if (wrapper) {
                wrapper.style.opacity = 1 - (progress * 1.2);
                wrapper.style.transform = `translateY(${-progress * 100}px) scale(${1 - progress * 0.1})`;
            }
        }

        console.log('✅ Vanilla scroll initialized');
    }

    /* ===================================
       SMOOTH SCROLL
       =================================== */
    function initSmoothScroll() {
        // Scroll indicator click
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.addEventListener('click', () => {
                const services = document.querySelector('.services-scroll, .services-horizontal-wrapper, #services');
                if (services) {
                    services.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // All anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || !href) return;

                e.preventDefault();
                
                if (href === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 80; // Account for fixed header
                    
                    window.scrollTo({ 
                        top: offsetTop - offset, 
                        behavior: 'smooth' 
                    });
                }
            });
        });

        console.log('✅ Smooth scroll initialized');
    }

    /* ===================================
       REVEAL ON SCROLL - GENERIC SECTIONS
       =================================== */
    function revealOnScroll() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
        
        console.log(`✅ ${revealElements.length} elements set for reveal`);
    }

    // Initialize reveal on scroll
    revealOnScroll();

})();
