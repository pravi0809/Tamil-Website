/* ===================================
   PROJECTS SLIDER - INITIALIZATION
   Mobile + Desktop Support
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    let projectsSlider = null;

    function init() {
        setTimeout(() => {
            initProjectsSlider();
            initHoverEffect();
        }, 100);
    }

    /* ===================================
       SWIPER SLIDER INITIALIZATION
       =================================== */
    function initProjectsSlider() {
        if (typeof Swiper === 'undefined') {
            console.error('❌ Swiper library not loaded');
            return;
        }

        const sliderElement = document.querySelector('.projects-slider');
        if (!sliderElement) {
            console.error('❌ Projects slider element not found');
            return;
        }

        const isMobile = window.innerWidth <= 768;

        // ✅ Mobile-friendly Swiper config
        projectsSlider = new Swiper('.projects-slider', {
            // Core settings
            effect: isMobile ? 'slide' : 'coverflow',
            grabCursor: true,
            loop: true,
            centeredSlides: true,
            
            // Keyboard
            keyboard: {
                enabled: true,
            },
            
            // Slides
            slidesPerView: isMobile ? 1.2 : 'auto',
            spaceBetween: isMobile ? 20 : 0,
            speed: 400,
            
            // Coverflow effect (desktop only)
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 3,
                slideShadows: false
            },
            
            // Touch settings
            simulateTouch: true,
            touchRatio: 1,
            touchAngle: 45,
            threshold: 10,
            
            // Breakpoints
            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 15,
                    effect: 'slide'
                },
                480: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                    effect: 'slide'
                },
                640: {
                    slidesPerView: 1.3,
                    spaceBetween: 25,
                    effect: 'slide'
                },
                769: {
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    effect: 'coverflow'
                }
            },
            
            // Navigation
            navigation: {
                nextEl: '.projects-slider-next',
                prevEl: '.projects-slider-prev'
            },
            
            // Pagination
            pagination: {
                el: '.projects-slider__pagination',
                clickable: true,
                dynamicBullets: isMobile,
                dynamicMainBullets: 3
            },
            
            // Events
            on: {
                init: function() {
                    console.log('✅ Projects slider initialized');
                    console.log('📱 Mode:', isMobile ? 'Mobile' : 'Desktop');
                    setTimeout(() => {
                        setActiveItem();
                        if (!isMobile) {
                            updateBackground();
                        }
                    }, 100);
                },
                slideChange: function() {
                    const items = document.querySelectorAll('.projects__item');
                    items.forEach(item => item.classList.remove('active'));
                },
                slideChangeTransitionEnd: function() {
                    setActiveItem();
                    if (window.innerWidth > 768) {
                        updateBackground();
                    }
                },
                touchEnd: function() {
                    setTimeout(() => {
                        setActiveItem();
                        if (window.innerWidth > 768) {
                            updateBackground();
                        }
                    }, 50);
                }
            }
        });

        console.log('✅ Projects slider ready');
    }

    /* ===================================
       SET ACTIVE ITEM
       =================================== */
    function setActiveItem() {
        const items = document.querySelectorAll('.projects__item');
        items.forEach(item => item.classList.remove('active'));
        
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const activeItem = activeSlide.querySelector('.projects__item');
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
    }

    /* ===================================
       HOVER EFFECT FOR DESKTOP ONLY
       =================================== */
    function initHoverEffect() {
        if (window.innerWidth <= 768) {
            console.log('ℹ️ Hover effect disabled on mobile');
            return;
        }

        const bg = document.querySelector('.projects-item-bg');
        const items = document.querySelectorAll('.projects__item');

        if (!bg || items.length === 0) {
            console.warn('⚠️ Background or items not found');
            return;
        }

        items.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                const rect = this.getBoundingClientRect();
                
                bg.classList.add('active');
                items.forEach(el => el.classList.remove('active'));
                this.classList.add('active');

                bg.style.width = rect.width + 'px';
                bg.style.height = rect.height + 'px';
                bg.style.transform = 'translateX(' + rect.left + 'px) translateY(' + rect.top + 'px)';
            });

            item.addEventListener('mouseleave', function() {
                const parentSlide = this.closest('.swiper-slide');
                if (!parentSlide || !parentSlide.classList.contains('swiper-slide-active')) {
                    bg.classList.remove('active');
                    this.classList.remove('active');
                }
            });
        });

        console.log('✅ Hover effect initialized (desktop)');
    }

    /* ===================================
       UPDATE BACKGROUND POSITION
       =================================== */
    function updateBackground() {
        if (window.innerWidth <= 768) return;

        const bg = document.querySelector('.projects-item-bg');
        const activeSlide = document.querySelector('.swiper-slide-active');
        
        if (!bg || !activeSlide) return;

        const sliderItem = activeSlide.querySelector('.projects__item');
        if (!sliderItem) return;

        const rect = sliderItem.getBoundingClientRect();
        
        bg.classList.add('active');
        bg.style.width = rect.width + 'px';
        bg.style.height = rect.height + 'px';
        bg.style.transform = 'translateX(' + rect.left + 'px) translateY(' + rect.top + 'px)';
    }

    /* ===================================
       HANDLE RESIZE
       =================================== */
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (projectsSlider) {
                projectsSlider.update();
            }
            
            if (window.innerWidth > 768) {
                updateBackground();
            }
        }, 250);
    });

})();
