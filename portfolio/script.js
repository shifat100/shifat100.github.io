document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElem = document.getElementById('currentYear');
    if (currentYearElem) {
        currentYearElem.textContent = new Date().getFullYear();
    }

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };
    scrollToTopBtn.addEventListener('click', function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    // Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav ul li a');

    function changeLinkState() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100 is offset for header height
        
        navLinks.forEach((link) => link.classList.remove('active'));
        // Check if the corresponding link exists before trying to add 'active' class
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    // Initial call to set active link on page load (if not at top)
    changeLinkState(); 
    window.addEventListener('scroll', changeLinkState);


    // Optional: Simple Starry background (more dynamic than CSS only)
    // This is a very basic version. For complex effects, use libraries like particles.js
    const starContainer = document.getElementById('star-container');
    if (starContainer) {
        const numStars = 100; // Adjust number of stars
        for (let i = 0; i < numStars; i++) {
            let star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = Math.random() * 2 + 'px'; // Star size
            star.style.height = star.style.width;
            star.style.backgroundColor = 'white';
            star.style.borderRadius = '50%';
            star.style.opacity = Math.random();
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            // Simple parallax effect
            star.style.setProperty('--parallax-speed', Math.random() * 0.5 + 0.1);
            starContainer.appendChild(star);
        }

        // Parallax scroll for JS stars
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const stars = starContainer.children;
            for (let star of stars) {
                const speed = parseFloat(star.style.getPropertyValue('--parallax-speed'));
                const yPos = - (scrolled * speed);
                star.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

});