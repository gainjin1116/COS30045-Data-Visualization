document.addEventListener('DOMContentLoaded', function() {
    // Logo click handler
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    const secondaryNav = document.querySelector('.secondary-nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            authButtons.style.display = authButtons.style.display === 'flex' ? 'none' : 'flex';
            secondaryNav.style.display = secondaryNav.style.display === 'block' ? 'none' : 'block';
            
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            if (window.innerWidth <= 768 && navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.backgroundColor = 'white';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navMenu.style.gap = '15px';
                navMenu.style.zIndex = '1000';
                
                authButtons.style.flexDirection = 'column';
                authButtons.style.position = 'absolute';
                authButtons.style.top = 'calc(100% + 180px)';
                authButtons.style.left = '0';
                authButtons.style.right = '0';
                authButtons.style.backgroundColor = 'white';
                authButtons.style.padding = '20px';
                authButtons.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                authButtons.style.gap = '15px';
                authButtons.style.zIndex = '1000';
            }
        });
    }
    
    // Search functionality
    const searchToggle = document.getElementById('searchToggle');
    const searchExpandable = document.getElementById('searchExpandable');
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('searchInput');
    
    if (searchToggle && searchExpandable && searchWrapper) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (searchExpandable.classList.contains('expanded')) {
                searchExpandable.classList.remove('expanded');
                searchWrapper.classList.remove('search-expanded');
            } else {
                searchExpandable.classList.add('expanded');
                searchWrapper.classList.add('search-expanded');
                setTimeout(() => {
                    if (searchInput) searchInput.focus();
                }, 300);
            }
        });
        
        document.addEventListener('click', function(event) {
            if (window.innerWidth > 768) {
                if (!searchWrapper.contains(event.target) && searchExpandable.classList.contains('expanded')) {
                    searchExpandable.classList.remove('expanded');
                    searchWrapper.classList.remove('search-expanded');
                }
            }
        });
        
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                    e.preventDefault();
                    alert(`Searching for: ${searchInput.value}`);
                    searchExpandable.classList.remove('expanded');
                    searchWrapper.classList.remove('search-expanded');
                    searchInput.value = '';
                }
            });
        }
    }
    
    // Window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'row';
            navMenu.style.position = 'static';
            navMenu.style.backgroundColor = 'transparent';
            navMenu.style.padding = '0';
            navMenu.style.boxShadow = 'none';
            
            authButtons.style.display = 'flex';
            authButtons.style.flexDirection = 'row';
            authButtons.style.position = 'static';
            authButtons.style.backgroundColor = 'transparent';
            authButtons.style.padding = '0';
            authButtons.style.boxShadow = 'none';
            
            secondaryNav.style.display = 'block';
            
            const icon = document.querySelector('.mobile-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        } else {
            navMenu.style.display = 'none';
            authButtons.style.display = 'none';
            secondaryNav.style.display = 'none';
        }
    });
    
    // Initial setup
    if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
        authButtons.style.display = 'none';
        secondaryNav.style.display = 'none';
    }
});