document.addEventListener('DOMContentLoaded', function() {
    // Logo click handler
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'Home.html';
        });
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = navMenu.style.display === 'flex';
            navMenu.style.display = isOpen ? 'none' : 'flex';
            authButtons.style.display = isOpen ? 'none' : 'flex';
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            if (!isOpen && window.innerWidth <= 768) {
                navMenu.style.cssText = 'flex-direction:column; position:absolute; top:100%; left:0; right:0; background:white; padding:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); gap:15px; z-index:1000;';
                authButtons.style.cssText = 'flex-direction:column; position:absolute; top:calc(100% + 180px); left:0; right:0; background:white; padding:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); gap:15px; z-index:1000;';
            }
        });
    }
    
    // Search functionality
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
        
        document.addEventListener('click', function(event) {
            if (window.innerWidth > 768 && searchWrapper && !searchWrapper.contains(event.target)) {
                searchExpandable.classList.remove('expanded');
            }
        });
        
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    e.preventDefault();
                    alert(`🔍 Searching: "${searchInput.value}" - Find energy-saving TVs on our Televisions page!`);
                    searchExpandable.classList.remove('expanded');
                    searchInput.value = '';
                }
            });
        }
    }
    
    // Window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.style.cssText = '';
            if (authButtons) authButtons.style.cssText = '';
            const icon = document.querySelector('.mobile-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        } else {
            if (navMenu && !navMenu.style.display) navMenu.style.display = 'none';
            if (authButtons && !authButtons.style.display) authButtons.style.display = 'none';
        }
    });
    
    // Initial setup
    if (window.innerWidth <= 768) {
        if (navMenu) navMenu.style.display = 'none';
        if (authButtons) authButtons.style.display = 'none';
    }
});