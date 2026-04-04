// ============================================
// CONFIGURATION & GLOBAL VARIABLES
// ============================================

// GenAI: Electricity rate in AUD per kWh
const ELECTRICITY_RATE = 0.30;
let tvData = [];
let displayTypes = new Set();
let currentPage = 'home';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// GenAI: Parse CSV data into JavaScript objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const tv = {};
        
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            
            switch(header) {
                case 'Screen_Size_inches':
                    tv.size = parseInt(value);
                    break;
                case 'Power_Consumption_Watts':
                    tv.powerWatts = parseInt(value);
                    break;
                case 'Standby_Power_Watts':
                    tv.standbyWatts = parseFloat(value);
                    break;
                case 'Annual_Energy_Consumption_kWh':
                    tv.annualKWh = parseInt(value);
                    break;
                case 'Brand':
                    tv.brand = value;
                    break;
                case 'Model':
                    tv.model = value;
                    break;
                case 'Display_Type':
                    tv.displayType = value;
                    break;
                case 'Energy_Star_Certified':
                    tv.energyStar = value;
                    break;
            }
        });
        
        data.push(tv);
    }
    
    return data;
}

// GenAI: Get star rating based on annual energy consumption
function getStarRating(annualKWh) {
    if (annualKWh <= 100) return "★★★★★★";
    if (annualKWh <= 120) return "★★★★★";
    if (annualKWh <= 180) return "★★★★";
    if (annualKWh <= 250) return "★★★";
    if (annualKWh <= 350) return "★★";
    return "★";
}

// GenAI: Calculate annual cost based on electricity rate
function calculateAnnualCost(annualKWh) {
    return (annualKWh * ELECTRICITY_RATE).toFixed(2);
}

// ============================================
// NAVIGATION & PAGE MANAGEMENT
// ============================================

function navigateTo(page) {
    currentPage = page;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Show/hide sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load TV data if navigating to televisions page
    if (page === 'televisions' && tvData.length === 0) {
        loadCSVData();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// GenAI: Setup navigation event handlers
function setupNavigation() {
    // GenAI: Logo click handler - navigates to home page
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => navigateTo('home'));
    }
    
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
    });
    
    // Check initial hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        navigateTo(initialHash);
    }
}

// ============================================
// MOBILE MENU
// ============================================

// GenAI: Mobile menu toggle functionality - Previously got issue (Fix by GenAI)
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (mobileToggle && navMenu && authButtons) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-visible');
            authButtons.classList.toggle('mobile-visible');
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // GenAI: Window resize handler - reset mobile menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('mobile-visible');
            authButtons.classList.remove('mobile-visible');
            
            const icon = document.querySelector('.mobile-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

// GenAI: Search expandable functionality for energy tips
function setupSearch() {
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
                    alert(`🔍 Searching: "${searchInput.value}" - Find energy-saving TVs on our Televisions page!`);
                    searchExpandable.classList.remove('expanded');
                    searchInput.value = '';
                }
            });
        }
    }
}

// ============================================
// TELEVISIONS PAGE - TV DATA & TABLE
// ============================================

// GenAI: Render the TV table with current filters
function renderTable() {
    const searchInput = document.getElementById('tvSearchInput');
    const energyFilter = document.getElementById('energyFilter');
    const displayFilter = document.getElementById('displayFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const energyValue = energyFilter ? energyFilter.value : 'all';
    const displayValue = displayFilter ? displayFilter.value : 'all';
    
    // Filter data
    const filteredData = tvData.filter(tv => {
        const matchesSearch = tv.brand.toLowerCase().includes(searchTerm) || 
                              tv.model.toLowerCase().includes(searchTerm);
        const matchesEnergy = energyValue === 'all' || tv.energyStar === energyValue;
        const matchesDisplay = displayValue === 'all' || tv.displayType === displayValue;
        
        return matchesSearch && matchesEnergy && matchesDisplay;
    });
    
    // Update count
    const tvCountSpan = document.getElementById('tvCount');
    if (tvCountSpan) {
        tvCountSpan.textContent = filteredData.length;
    }
    
    // Render table
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="no-results">No televisions found matching your criteria.</td></tr>';
        return;
    }
    
    let html = '';
    
    filteredData.forEach(tv => {
        const annualCost = calculateAnnualCost(tv.annualKWh);
        const starRating = getStarRating(tv.annualKWh);
        
        const energyStarBadge = tv.energyStar === 'Yes' 
            ? '<span class="energy-star-badge"><i class="fas fa-certificate"></i> Certified</span>'
            : '<span class="non-certified">Not Certified</span>';
        
        html += `
            <tr>
                <td><strong>${tv.brand}</strong></td>
                <td>${tv.model}</td>
                <td>${tv.size}"</td>
                <td>${tv.displayType}</td>
                <td>${tv.powerWatts} W</td>
                <td>${tv.standbyWatts} W</td>
                <td>
                    ${tv.annualKWh} kWh<br>
                    <span class="star-rating">${starRating}</span>
                </td>
                <td>${energyStarBadge}</td>
                <td class="cost-highlight">$${annualCost}/year</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// GenAI: Load CSV data from file
async function loadCSVData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const filterSidebar = document.getElementById('filterSidebar');
    const tableContainer = document.getElementById('tableContainer');
    const costNote = document.getElementById('costNote');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        loadingIndicator.style.display = 'block';
        
        const response = await fetch('data/tv.csv');
        
        if (!response.ok) {
            throw new Error('Failed to load CSV file');
        }
        
        const csvText = await response.text();
        tvData = parseCSV(csvText);
        
        // Collect display types
        tvData.forEach(tv => {
            if (tv.displayType) {
                displayTypes.add(tv.displayType);
            }
        });
        
        // Populate filter
        const displayFilter = document.getElementById('displayFilter');
        if (displayFilter) {
            displayTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                displayFilter.appendChild(option);
            });
        }
        
        // Show UI
        filterSidebar.style.display = 'block';
        tableContainer.style.display = 'block';
        costNote.style.display = 'flex';
        loadingIndicator.style.display = 'none';
        
        renderTable();
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'flex';
        
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="9" class="no-results">Failed to load TV data. Please ensure data/tv.csv exists.</td></tr>';
        }
    }
}

// GenAI: Setup event listeners for filters
function setupTelevisionsFilters() {
    const searchInput = document.getElementById('tvSearchInput');
    const energyFilter = document.getElementById('energyFilter');
    const displayFilter = document.getElementById('displayFilter');
    
    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (energyFilter) energyFilter.addEventListener('change', renderTable);
    if (displayFilter) displayFilter.addEventListener('change', renderTable);
}

// ============================================
// ABOUT PAGE - ANIMATIONS
// ============================================

// GenAI: Setup animations for About page statistics
function setupAboutAnimations() {
    const impactCards = document.querySelectorAll('.impact-card h3');
    
    // GenAI: Animate numbers on scroll - Energy Impact Stats
    function animateNumbers() {
        impactCards.forEach(card => {
            if (card.hasAttribute('data-animated')) return;
            
            const text = card.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            if (!number) return;
            
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
}

// ============================================
// INITIALIZATION
// ============================================

// GenAI: Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupMobileMenu();
    setupSearch();
    setupTelevisionsFilters();
    setupAboutAnimations();
});