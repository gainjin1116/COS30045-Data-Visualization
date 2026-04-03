// GenAI: DOM content loaded event handler for initializing features
document.addEventListener('DOMContentLoaded', function() {
    // GenAI: Logo click handler - navigates to home page
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
    
    // GenAI: Mobile menu toggle functionality
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileToggle && navMenu && authButtons) {
        mobileToggle.addEventListener('click', function() {
            // Toggle mobile-visible class on navMenu
            navMenu.classList.toggle('mobile-visible');
            authButtons.classList.toggle('mobile-visible');
            
            // Toggle icon between hamburger and times
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // GenAI: Search expandable functionality for energy tips
    const searchToggle = document.getElementById('searchToggle');
    const searchExpandable = document.getElementById('searchExpandable');
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('searchInput');
    
    if (searchToggle && searchExpandable) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            searchExpandable.classList.toggle('expanded');
            if (searchExpandable.classList.contains('expanded')) {
                setTimeout(() => searchInput?.focus(), 300);
            }
        });
        
        // GenAI: Close search when clicking outside (desktop only)
        document.addEventListener('click', function(event) {
            if (window.innerWidth > 768 && searchWrapper && !searchWrapper.contains(event.target)) {
                searchExpandable.classList.remove('expanded');
            }
        });
        
        // GenAI: Handle search submission with energy-saving context
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    e.preventDefault();
                    alert(`🔍 Searching: "${searchInput.value}" - Explore our energy-saving TVs and tips!`);
                    searchExpandable.classList.remove('expanded');
                    searchInput.value = '';
                }
            });
        }
    }
    
    // Animate numbers on scroll - Energy Impact Stats
    const impactCards = document.querySelectorAll('.impact-card h3');
    
    function animateNumbers() {
        impactCards.forEach(card => {
            const text = card.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9+]/g, '');
            
            if (number && !card.hasAttribute('data-animated')) {
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        card.textContent = number.toLocaleString() + suffix;
                        clearInterval(timer);
                        card.setAttribute('data-animated', 'true');
                    } else {
                        card.textContent = Math.floor(current).toLocaleString() + suffix;
                    }
                }, 20);
            }
        });
    }
    
    // GenAI: Check if impact section is in view using Intersection Observer
    const impactSection = document.querySelector('.energy-impact');
    if (impactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(impactSection);
    }
    
    // GenAI: Window resize handler - reset mobile menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Remove mobile-visible classes and reset icons
            if (navMenu) navMenu.classList.remove('mobile-visible');
            if (authButtons) authButtons.classList.remove('mobile-visible');
            
            const icon = document.querySelector('.mobile-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});