/* ===================================
   CONTACT FORM HANDLER
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initContactForm();
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');

        if (!form) {
            console.warn('⚠️ Contact form not found');
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate form
            if (!validateForm(data)) {
                showStatus('Please fill in all required fields correctly', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('.submit-btn-gradient');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'SENDING...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success
                showStatus('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
                form.reset();
                
                // Reset button
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);

            }, 2000);

            console.log('📧 Form submitted:', data);
        });

        function validateForm(data) {
            // Check required fields
            if (!data.name || !data.email || !data.subject || !data.message) {
                return false;
            }
            
            // Validate email format
            if (!isValidEmail(data.email)) {
                showStatus('Please enter a valid email address', 'error');
                return false;
            }

            return true;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showStatus(message, type) {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
            formStatus.style.display = 'block';
        }

        console.log('✅ Contact form initialized');
    }

})();
