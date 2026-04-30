/* ===================================
   NAVBAR & MOBILE MENU FUNCTIONALITY
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initNavbar();
        initMobileMenu();
        initActiveLinks();
    }

    /* ===================================
       NAVBAR SCROLL EFFECT
       =================================== */
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        console.log('✅ Navbar scroll effect initialized');
    }

    /* ===================================
       MOBILE MENU
       =================================== */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const body = document.body;

        if (!menuToggle || !mobileMenu) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        body.appendChild(overlay);

        // Toggle menu
        menuToggle.addEventListener('click', function() {
            toggleMenu();
        });

        // Close on overlay click
        overlay.addEventListener('click', function() {
            closeMenu();
        });

        // Close on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        function toggleMenu() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }

        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        console.log('✅ Mobile menu initialized');
    }

    /* ===================================
       ACTIVE LINK NAVIGATION
       =================================== */
    function initActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        // Desktop links
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                this.classList.add('active');
            });
        });

        // Mobile links
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileNavLinks.forEach(function(l) { l.classList.remove('active'); });
                this.classList.add('active');
            });
        });

        console.log('✅ Active link navigation initialized');
    }

})();
