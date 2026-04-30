/* =================================
   MAIN.JS - Core Website Functionality
   ================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize all components
  initSmoothScroll();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initFormValidation();
  
  console.log('ImageX Creation website loaded successfully! ✨');
});

/* =================================
   SMOOTH SCROLL INITIALIZATION (Lenis)
   ================================= */
function initSmoothScroll() {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Animation frame loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.5
        });
      }
    });
  });

  // Expose lenis globally for other scripts
  window.lenis = lenis;
}

/* =================================
   NAVBAR SCROLL BEHAVIOR
   ================================= */
function initNavbar() {
  const navbar = document.querySelector('.glass-navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class after 50px
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active navigation based on scroll position
    updateActiveNav();

    lastScroll = currentScroll;
  });
}

/* =================================
   UPDATE ACTIVE NAVIGATION LINK
   ================================= */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  let currentSection = '';
  const scrollPosition = window.pageYOffset + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
    // Home page special case
    if (currentSection === 'hero' && link.getAttribute('href') === '/') {
      link.classList.add('active');
    }
  });
}

/* =================================
   MOBILE MENU TOGGLE
   ================================= */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (!menuToggle || !navLinks) return;

  // Toggle menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking overlay
  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
      body.style.overflow = '';
    }
  });
}

/* =================================
   SCROLL ANIMATIONS (Intersection Observer)
   ================================= */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with scroll-appear class
  document.querySelectorAll('.scroll-appear').forEach(el => {
    observer.observe(el);
  });

  // Observe elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* =================================
   FORM VALIDATION & SUBMISSION
   ================================= */
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Allow form to submit naturally to Formspree or your backend
      // Add custom validation if needed
      
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--color-cherry-red)';
          
          // Reset border color after 3 seconds
          setTimeout(() => {
            input.style.borderColor = '';
          }, 3000);
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });

    // Reset validation styling on input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', function() {
        this.style.borderColor = '';
      });
    });
  });
}

/* =================================
   UTILITY FUNCTIONS
   ================================= */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
