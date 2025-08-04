document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .blog-card, .stat');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Blog carousel functionality
    const blogCarousel = document.querySelector('.blog-carousel');
    const leftNav = document.querySelector('.carousel-nav-left');
    const rightNav = document.querySelector('.carousel-nav-right');

    if (blogCarousel && leftNav && rightNav) {
        const scrollAmount = 380; // Card width + gap

        leftNav.addEventListener('click', () => {
            blogCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightNav.addEventListener('click', () => {
            blogCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update navigation button states
        function updateNavButtons() {
            const scrollLeft = blogCarousel.scrollLeft;
            const maxScroll = blogCarousel.scrollWidth - blogCarousel.clientWidth;

            leftNav.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
            leftNav.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';
            
            rightNav.style.opacity = scrollLeft >= maxScroll - 1 ? '0.3' : '1';
            rightNav.style.pointerEvents = scrollLeft >= maxScroll - 1 ? 'none' : 'auto';
        }

        blogCarousel.addEventListener('scroll', updateNavButtons);
        updateNavButtons(); // Initial state
    }

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }

    // Trigger counter animations when stats section is in view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace('+', ''));
                    if (number && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, number);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const communitySection = document.querySelector('.community');
    if (communitySection) {
        statsObserver.observe(communitySection);
    }

    // Form handling (if forms are added later)
    function handleFormSubmit(formSelector, successMessage) {
        const form = document.querySelector(formSelector);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Here you would typically send the form data to a server
                alert(successMessage);
                form.reset();
            });
        }
    }

    // Utility function to detect if user is on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Add touch events for mobile
    if (isMobile()) {
        document.querySelectorAll('.feature-card, .blog-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Preload critical images
    function preloadImages() {
        const imageUrls = [
            'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    preloadImages();

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Lazy loading for images (when added)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
});