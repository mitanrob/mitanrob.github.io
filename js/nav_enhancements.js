// Navigation Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    
    // Add loading animation delay to navigation links
    navLinks.forEach((link, index) => {
        link.style.setProperty('--index', index);
    });
    
    // Header scroll effect
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Debounced scroll handling for performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavigation();
        }, 10);
    });
    
    // Update active navigation based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Check if current scroll position is within this section
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                mobileMenuLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                const activeMobileLink = document.querySelector(`#mobile-menu a[href="#${sectionId}"]`);
                
                if (activeLink) activeLink.classList.add('active');
                if (activeMobileLink) activeMobileLink.classList.add('active');
            }
        });
    }
    
    // Smooth scroll with offset for fixed header
    function smoothScrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Enhanced click handlers for navigation links
    [...navLinks, ...mobileMenuLinks].forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                smoothScrollToSection(href);
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('#mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
        
        // Add hover sound effect (optional - can be removed if not desired)
        link.addEventListener('mouseenter', function() {
            // Add a subtle scale effect on hover
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Initialize active navigation on page load
    setTimeout(updateActiveNavigation, 100);
    
    // Handle page visibility change to maintain smooth animations
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateActiveNavigation();
        }
    });
    
    // Add intersection observer for smoother active state updates
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: `-${header.offsetHeight}px 0px -60% 0px`,
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    [...navLinks, ...mobileMenuLinks].forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section links
                    const activeNavLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                    const activeMobileLink = document.querySelector(`#mobile-menu a[href="#${sectionId}"]`);
                    
                    if (activeNavLink) activeNavLink.classList.add('active');
                    if (activeMobileLink) activeMobileLink.classList.add('active');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
});
