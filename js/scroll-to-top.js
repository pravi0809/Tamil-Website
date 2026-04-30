/* ===================================
   CUSTOM ROCKET SCROLL TO TOP
   SLOWER + HERO SECTION DETECTION
   =================================== */

(function() {
    'use strict';

    console.log('🚀 Custom Rocket loaded');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const rocket = document.getElementById('scrollTopBtn');
        
        if (!rocket) {
            console.error('❌ Rocket not found!');
            return;
        }

        console.log('✅ Custom rocket ready!');

        let isLaunching = false;
        let heroHeight = 0;

        // Detect Hero Section height
        function getHeroHeight() {
            // Try multiple possible hero section selectors
            const heroSelectors = [
                '#hero',
                '.hero',
                '.hero-section',
                'section.hero',
                'header.hero',
                '.banner',
                '#banner'
            ];

            for (let selector of heroSelectors) {
                const heroElement = document.querySelector(selector);
                if (heroElement) {
                    heroHeight = heroElement.offsetHeight;
                    console.log(`✅ Hero section found: ${selector}, Height: ${heroHeight}px`);
                    return;
                }
            }

            // Fallback: Use viewport height if no hero found
            heroHeight = window.innerHeight;
            console.log(`⚠️ No hero section found, using viewport height: ${heroHeight}px`);
        }

        // Get hero height on load
        getHeroHeight();

        // Recalculate on window resize
        window.addEventListener('resize', getHeroHeight);

        // Show/hide on scroll - ONLY after hero section
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show rocket only when scrolled past hero section
            if (scrollTop > heroHeight && !isLaunching) {
                rocket.classList.add('visible');
            } else if (scrollTop <= heroHeight && !isLaunching) {
                rocket.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', handleScroll);

        // Launch rocket STRAIGHT UP - SLOWER
        rocket.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isLaunching) return;
            
            isLaunching = true;
            console.log('🚀 LAUNCHING STRAIGHT UP (SLOW MODE)!');
            
            // Add launching animation
            rocket.classList.add('launching');
            rocket.classList.remove('visible');
            
            // Scroll to top SLOWER
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
            
            // Reset after SLOWER animation (2.5 seconds)
            setTimeout(function() {
                rocket.classList.remove('launching');
                isLaunching = false;
                handleScroll();
            }, 2500);
        });

        // Initial check
        handleScroll();

        console.log('✅ Custom rocket initialized! 🚀');
        console.log(`📏 Rocket will appear after scrolling ${heroHeight}px`);
    }

})();
