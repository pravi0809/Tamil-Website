/* ===================================
   SCROLL TO TOP BUTTON
   =================================== */

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const progressCircle = document.querySelector('.progress-ring-circle');
        
        if (!scrollTopBtn || !progressCircle) {
            console.warn('⚠️ Scroll to top button not found');
            return;
        }

        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            setProgress(scrollPercent);
            
            if (scrollTop > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });

        console.log('✅ Scroll to top button initialized');
    }

})();
