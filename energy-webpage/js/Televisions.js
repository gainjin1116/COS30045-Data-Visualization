// Electricity rate in AUD per kWh
const ELECTRICITY_RATE = 0.30;

// Global variables
let tvData = [];
let displayTypes = new Set();

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const tv = {};
        
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            
            if (header === 'Screen_Size_inches') {
                tv.size = parseInt(value);
            } else if (header === 'Power_Consumption_Watts') {
                tv.powerWatts = parseInt(value);
            } else if (header === 'Standby_Power_Watts') {
                tv.standbyWatts = parseFloat(value);
            } else if (header === 'Annual_Energy_Consumption_kWh') {
                tv.annualKWh = parseInt(value);
            } else if (header === 'Brand') {
                tv.brand = value;
            } else if (header === 'Model') {
                tv.model = value;
            } else if (header === 'Display_Type') {
                tv.displayType = value;
            } else if (header === 'Energy_Star_Certified') {
                tv.energyStar = value;
            }
        });
        
        data.push(tv);
    }
    
    return data;
}

// Get star rating based on annual energy consumption
function getStarRating(annualKWh) {
    if (annualKWh <= 100) return "★★★★★★";
    if (annualKWh <= 120) return "★★★★★";
    if (annualKWh <= 180) return "★★★★";
    if (annualKWh <= 250) return "★★★";
    if (annualKWh <= 350) return "★★";
    return "★";
}

// Calculate annual cost
function calculateAnnualCost(annualKWh) {
    return (annualKWh * ELECTRICITY_RATE).toFixed(2);
}

// Render the table
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
    
    // Update TV count
    const tvCountSpan = document.getElementById('tvCount');
    if (tvCountSpan) {
        tvCountSpan.textContent = filteredData.length;
    }
    
    // Get table body
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    // Show no results message
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="no-results">No televisions found matching your criteria.</td></tr>';
        return;
    }
    
    // Generate table rows
    let html = '';
    
    for (let i = 0; i < filteredData.length; i++) {
        const tv = filteredData[i];
        const annualCost = calculateAnnualCost(tv.annualKWh);
        const starRating = getStarRating(tv.annualKWh);
        
        let energyStarBadge = '';
        if (tv.energyStar === 'Yes') {
            energyStarBadge = '<span class="energy-star-badge"><i class="fas fa-certificate"></i> Certified</span>';
        } else {
            energyStarBadge = '<span class="non-certified">Not Certified</span>';
        }
        
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
    }
    
    tableBody.innerHTML = html;
}

// Load CSV data from file
async function loadCSVData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const filterSidebar = document.getElementById('filterSidebar');
    const tableContainer = document.getElementById('tableContainer');
    const costNote = document.getElementById('costNote');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        // Fetch CSV file
        const response = await fetch('data/tv.csv');
        
        if (!response.ok) {
            throw new Error('Failed to load CSV file');
        }
        
        const csvText = await response.text();
        
        // Parse CSV data
        tvData = parseCSV(csvText);
        
        // Collect unique display types for filter
        for (let i = 0; i < tvData.length; i++) {
            const tv = tvData[i];
            if (tv.displayType) {
                displayTypes.add(tv.displayType);
            }
        }
        
        // Populate display type filter
        const displayFilter = document.getElementById('displayFilter');
        if (displayFilter) {
            const typesArray = Array.from(displayTypes);
            for (let i = 0; i < typesArray.length; i++) {
                const option = document.createElement('option');
                option.value = typesArray[i];
                option.textContent = typesArray[i];
                displayFilter.appendChild(option);
            }
        }
        
        // Show UI elements
        filterSidebar.style.display = 'block';
        tableContainer.style.display = 'block';
        costNote.style.display = 'flex';
        loadingIndicator.style.display = 'none';
        
        // Render table
        renderTable();
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        
        // Hide loading, show error
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'flex';
        
        // Show error in table
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="9" class="no-results">Failed to load TV data. Please ensure data/tv.csv exists.</td></tr>';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter controls
    const searchInput = document.getElementById('tvSearchInput');
    const energyFilter = document.getElementById('energyFilter');
    const displayFilter = document.getElementById('displayFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', renderTable);
    }
    
    if (energyFilter) {
        energyFilter.addEventListener('change', renderTable);
    }
    
    if (displayFilter) {
        displayFilter.addEventListener('change', renderTable);
    }
    
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
            if (navMenu) {
                if (navMenu.style.display === 'flex') {
                    navMenu.style.display = 'none';
                } else {
                    navMenu.style.display = 'flex';
                }
            }
            
            if (authButtons) {
                if (authButtons.style.display === 'flex') {
                    authButtons.style.display = 'none';
                } else {
                    authButtons.style.display = 'flex';
                }
            }
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Mobile styles
            if (window.innerWidth <= 768 && navMenu && navMenu.style.display === 'flex') {
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
                
                if (authButtons) {
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
            }
        });
    }
    
    // Header search functionality
    const searchToggle = document.getElementById('searchToggle');
    const searchExpandable = document.getElementById('searchExpandable');
    const searchWrapper = document.getElementById('searchWrapper');
    const headerSearchInput = document.getElementById('searchInput');
    
    if (searchToggle && searchExpandable && searchWrapper) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (searchExpandable.classList.contains('expanded')) {
                searchExpandable.classList.remove('expanded');
                searchWrapper.classList.remove('search-expanded');
            } else {
                searchExpandable.classList.add('expanded');
                searchWrapper.classList.add('search-expanded');
                
                setTimeout(function() {
                    if (headerSearchInput) {
                        headerSearchInput.focus();
                    }
                }, 300);
            }
        });
        
        // Close search on click outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth > 768) {
                if (!searchWrapper.contains(event.target) && searchExpandable.classList.contains('expanded')) {
                    searchExpandable.classList.remove('expanded');
                    searchWrapper.classList.remove('search-expanded');
                }
            }
        });
        
        // Handle search input
        if (headerSearchInput) {
            headerSearchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && headerSearchInput.value.trim() !== '') {
                    e.preventDefault();
                    alert('Searching for: ' + headerSearchInput.value);
                    searchExpandable.classList.remove('expanded');
                    searchWrapper.classList.remove('search-expanded');
                    headerSearchInput.value = '';
                }
            });
        }
    }
    
    // Window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'row';
                navMenu.style.position = 'static';
                navMenu.style.backgroundColor = 'transparent';
                navMenu.style.padding = '0';
                navMenu.style.boxShadow = 'none';
            }
            
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.style.flexDirection = 'row';
                authButtons.style.position = 'static';
                authButtons.style.backgroundColor = 'transparent';
                authButtons.style.padding = '0';
                authButtons.style.boxShadow = 'none';
            }
            
            const icon = document.querySelector('.mobile-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        } else {
            if (navMenu) {
                navMenu.style.display = 'none';
            }
            if (authButtons) {
                authButtons.style.display = 'none';
            }
        }
    });
    
    // Initial mobile setup
    if (window.innerWidth <= 768) {
        if (navMenu) {
            navMenu.style.display = 'none';
        }
        if (authButtons) {
            authButtons.style.display = 'none';
        }
    }
}

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadCSVData();
});