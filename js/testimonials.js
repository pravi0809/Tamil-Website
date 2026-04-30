/* ===================================
   TESTIMONIALS EXPANDING ACCORDION
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initTestimonialAccordion();
    }

    function initTestimonialAccordion() {
        const testimonials = document.querySelectorAll('.testimonial');
        
        if (testimonials.length === 0) {
            console.warn('⚠️ No testimonials found');
            return;
        }

        // Set ARIA attributes
        testimonials.forEach(function(testimonial, index) {
            const contentId = 'testimonial-' + index;
            testimonial.setAttribute('aria-expanded', 'false');
            testimonial.setAttribute('aria-controls', contentId);
            
            const content = testimonial.querySelector('.testim-content');
            if (content) {
                content.setAttribute('id', contentId);
            }
        });

        // Expand first testimonial on load
        const firstTestimonial = testimonials[0];
        firstTestimonial.classList.add('expanded');
        firstTestimonial.setAttribute('aria-expanded', 'true');

        // Expand testimonial function
        function expandTestimonial(element) {
            // Collapse all others
            testimonials.forEach(function(testimonial) {
                if (testimonial !== element) {
                    testimonial.classList.remove('expanded');
                    testimonial.setAttribute('aria-expanded', 'false');
                }
            });

            // Expand selected one
            element.classList.add('expanded');
            element.setAttribute('aria-expanded', 'true');
        }

        // Click handler
        testimonials.forEach(function(testimonial) {
            testimonial.addEventListener('click', function() {
                expandTestimonial(this);
            });

            // Keyboard accessibility (Enter or Space)
            testimonial.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    expandTestimonial(this);
                }
            });
        });

        console.log('✅ Testimonials accordion initialized');
    }

})();
