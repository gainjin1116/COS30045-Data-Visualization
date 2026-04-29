// ============================================
// CONFIGURATION & GLOBAL VARIABLES
// ============================================

const ELECTRICITY_RATE = 0.30;
let tvData = [];
let displayTypes = new Set();
let currentPage = 'home';

// TV Storyboard state
let tvPowered = false;
let currentStory = null;
let currentSlide = 0;
let autoSlideTimer = null;
const AUTO_SLIDE_INTERVAL = 6000;

// Storyboard data
const storyboardData = {
    1: {
        prefix: 'storyboard1st',
        chapter: 'Chapter 1',
        title: 'The Technology Overview',
        slides: [
            {
                img: 'storyboard1st_1.jpg',
                title: "Overwhelmed by Choices",
                desc: "The user is overwhelmed by over 1,000 search results for TVs and wonders which technology (LCD, LED, OLED) is the standard in Australia.",
                tags: []
            },
            {
                img: 'storyboard1st_2.jpg',
                title: "Simplifying the Search",
                desc: "The user clicks on the 'Market Frequency' tab on the dashboard to simplify their search.",
                tags: []
            },
            {
                img: 'storyboard1st_3.jpg',
                title: "Market Dominance Revealed",
                desc: "A Pie Chart appears, showing that LCD(LED) technology dominates the market share at over 80%.",
                tags: []
            },
            {
                img: 'storyboard1st_4.jpg',
                title: "Exploring the Premium Tier",
                desc: "The user hovers over the OLED section to see that it represents a small, premium portion of available models.",
                tags: []
            },
            {
                img: 'storyboard1st_5.jpg',
                title: "Identifying the Standard",
                desc: "The user realizes that while OLED is advanced, LCD(LED) is the most frequent and accessible choice.",
                tags: []
            },
            {
                img: 'storyboard1st_6.jpg',
                title: "Data-Driven Decision",
                desc: "With the data-driven insight, the user narrows their search to LCD(LED) models to find the best value.",
                tags: []
            }
        ]
    },
    2: {
        prefix: 'storyboard2nd',
        chapter: 'Chapter 2',
        title: 'The Brand Leaderboard',
        slides: [
            {
                img: 'storyboard2nd_1.jpg',
                title: "Seeking Maximum Variety",
                desc: "The user wants to find the brand that offers the most variety to ensure they have the most features to choose from.",
                tags: []
            },
            {
                img: 'storyboard2nd_2.jpg',
                title: "Navigating to Rankings",
                desc: "The user navigates to the 'Brand Rankings' chart on the analytics site.",
                tags: []
            },
            {
                img: 'storyboard2nd_3.jpg',
                title: "The Volume Leaders",
                desc: "A Bar Chart displays the model counts, showing Samsung Electronics and LG as the clear leaders in volume.",
                tags: []
            },
            {
                img: 'storyboard2nd_4.jpg',
                title: "Deep Dive into Samsung",
                desc: "The user taps on the 'Samsung' bar and sees they offer 731 different models in the current dataset.",
                tags: []
            },
            {
                img: 'storyboard2nd_5.jpg',
                title: "Comparing the Competition",
                desc: "The user compares the top leaders against smaller brands like Kogan to see the difference in availability.",
                tags: []
            },
            {
                img: 'storyboard2nd_6.jpg',
                title: "Confident in the Choice",
                desc: "The user decides to shop for a Samsung TV, feeling confident that they will find a model that fits their specific needs.",
                tags: []
            }
        ]
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

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
                case 'Screen_Size_inches': tv.size = parseInt(value); break;
                case 'Power_Consumption_Watts': tv.powerWatts = parseInt(value); break;
                case 'Standby_Power_Watts': tv.standbyWatts = parseFloat(value); break;
                case 'Annual_Energy_Consumption_kWh': tv.annualKWh = parseInt(value); break;
                case 'Brand': tv.brand = value; break;
                case 'Model': tv.model = value; break;
                case 'Display_Type': tv.displayType = value; break;
                case 'Energy_Star_Certified': tv.energyStar = value; break;
            }
        });
        
        data.push(tv);
    }
    return data;
}

function getStarRating(annualKWh) {
    if (annualKWh <= 100) return "★★★★★★";
    if (annualKWh <= 120) return "★★★★★";
    if (annualKWh <= 180) return "★★★★";
    if (annualKWh <= 250) return "★★★";
    if (annualKWh <= 350) return "★★";
    return "★";
}

function calculateAnnualCost(annualKWh) {
    return (annualKWh * ELECTRICITY_RATE).toFixed(2);
}

// ============================================
// NAVIGATION & PAGE MANAGEMENT
// ============================================

function navigateTo(page) {
    if (currentPage === 'storyboard' && page !== 'storyboard') {
        turnOffTV();
    }
    
    currentPage = page;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });
    
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(page);
    if (targetSection) targetSection.classList.add('active');
    
    if (page === 'televisions' && tvData.length === 0) loadCSVData();
    
    window.scrollTo(0, 0);
}

function setupNavigation() {
    const logo = document.getElementById('logo');
    if (logo) logo.addEventListener('click', () => navigateTo('home'));
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
    });
    
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) navigateTo(initialHash);
}

// ============================================
// MOBILE MENU
// ============================================

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (mobileToggle && navMenu && authButtons) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-visible');
            authButtons.classList.toggle('mobile-visible');
            const icon = this.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('mobile-visible');
            authButtons.classList.remove('mobile-visible');
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

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
}

// ============================================
// INTERACTIVE TV STORYBOARD SYSTEM
// ============================================

function initTVStoryboard() {
    const powerBtn = document.getElementById('powerBtn');
    const game1Btn = document.getElementById('game1Btn');
    const game2Btn = document.getElementById('game2Btn');
    const backBtn = document.getElementById('backBtn');
    const menuCard1 = document.getElementById('menuCard1');
    const menuCard2 = document.getElementById('menuCard2');
    const slidePrev = document.getElementById('slidePrev');
    const slideNext = document.getElementById('slideNext');
    const slideExit = document.getElementById('slideExit');
    
    updateMenuClock();
    setInterval(updateMenuClock, 30000);
    
    if (powerBtn) {
        powerBtn.addEventListener('click', function() {
            if (tvPowered) {
                turnOffTV();
            } else {
                turnOnTV();
            }
        });
    }
    
    if (game1Btn) game1Btn.addEventListener('click', () => openStory(1));
    if (game2Btn) game2Btn.addEventListener('click', () => openStory(2));
    
    if (menuCard1) menuCard1.addEventListener('click', () => openStory(1));
    if (menuCard2) menuCard2.addEventListener('click', () => openStory(2));
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentStory !== null) {
                exitSlideshow();
            } else if (tvPowered) {
                turnOffTV();
            }
        });
    }
    
    if (slidePrev) slidePrev.addEventListener('click', () => navigateSlide(-1));
    if (slideNext) slideNext.addEventListener('click', () => navigateSlide(1));
    if (slideExit) slideExit.addEventListener('click', () => exitSlideshow());
    
    document.addEventListener('keydown', function(e) {
        if (currentPage !== 'storyboard') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentStory !== null) navigateSlide(-1);
                break;
            case 'ArrowRight':
                if (currentStory !== null) navigateSlide(1);
                break;
            case 'Escape':
                if (currentStory !== null) exitSlideshow();
                else if (tvPowered) turnOffTV();
                break;
            case 'Enter':
                if (!tvPowered) turnOnTV();
                break;
        }
    });
    
    setupDpad();
}

function setupDpad() {
    const dpadUp = document.querySelector('.dpad-up');
    const dpadDown = document.querySelector('.dpad-down');
    const dpadLeft = document.querySelector('.dpad-left');
    const dpadRight = document.querySelector('.dpad-right');
    const dpadCenter = document.querySelector('.dpad-center');
    
    if (dpadCenter) dpadCenter.addEventListener('click', () => {
        if (!tvPowered) turnOnTV();
    });
    if (dpadLeft) dpadLeft.addEventListener('click', () => { if (currentStory !== null) navigateSlide(-1); });
    if (dpadRight) dpadRight.addEventListener('click', () => { if (currentStory !== null) navigateSlide(1); });
    if (dpadUp) dpadUp.addEventListener('click', () => {
        if (tvPowered && currentStory === null) openStory(1);
    });
    if (dpadDown) dpadDown.addEventListener('click', () => {
        if (tvPowered && currentStory === null) openStory(2);
    });
}

function updateMenuClock() {
    const menuTime = document.getElementById('menuTime');
    if (menuTime) {
        const now = new Date();
        menuTime.textContent = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    }
}

function setRemoteEnabled(enabled) {
    const btns = document.querySelectorAll('.remote-btn:not(.power-btn), .dpad-btn');
    btns.forEach(btn => { btn.disabled = !enabled; });
}

function turnOnTV() {
    tvPowered = true;
    
    const screenOff = document.getElementById('screenOff');
    const screenMenu = document.getElementById('screenMenu');
    const tvLed = document.getElementById('tvLed');
    const remoteIndicator = document.querySelector('.remote-indicator');
    
    if (tvLed) tvLed.classList.add('on');
    if (remoteIndicator) remoteIndicator.classList.add('on');
    
    setRemoteEnabled(true);
    
    setTimeout(() => {
        if (screenOff) screenOff.classList.add('hidden');
    }, 100);
    
    setTimeout(() => {
        if (screenMenu) screenMenu.classList.add('visible');
    }, 400);
}

function turnOffTV() {
    tvPowered = false;
    currentStory = null;
    currentSlide = 0;
    clearAutoSlide();
    
    const screenOff = document.getElementById('screenOff');
    const screenMenu = document.getElementById('screenMenu');
    const screenSlideshow = document.getElementById('screenSlideshow');
    const tvLed = document.getElementById('tvLed');
    const remoteIndicator = document.querySelector('.remote-indicator');
    const game1Btn = document.getElementById('game1Btn');
    const game2Btn = document.getElementById('game2Btn');
    const menuCard1 = document.getElementById('menuCard1');
    const menuCard2 = document.getElementById('menuCard2');
    
    if (tvLed) tvLed.classList.remove('on');
    if (remoteIndicator) remoteIndicator.classList.remove('on');
    
    setRemoteEnabled(false);
    
    if (game1Btn) game1Btn.classList.add('active-game');
    if (game2Btn) game2Btn.classList.remove('active-game');
    if (menuCard1) menuCard1.classList.remove('selected');
    if (menuCard2) menuCard2.classList.remove('selected');
    
    if (screenSlideshow) screenSlideshow.classList.remove('visible');
    if (screenMenu) screenMenu.classList.remove('visible');
    
    setTimeout(() => {
        if (screenOff) screenOff.classList.remove('hidden');
    }, 300);
}

function openStory(storyId) {
    if (!tvPowered) return;
    
    currentStory = storyId;
    currentSlide = 0;
    
    const story = storyboardData[storyId];
    if (!story) return;
    
    const game1Btn = document.getElementById('game1Btn');
    const game2Btn = document.getElementById('game2Btn');
    const menuCard1 = document.getElementById('menuCard1');
    const menuCard2 = document.getElementById('menuCard2');
    
    if (game1Btn) game1Btn.classList.toggle('active-game', storyId === 1);
    if (game2Btn) game2Btn.classList.toggle('active-game', storyId === 2);
    if (menuCard1) menuCard1.classList.toggle('selected', storyId === 1);
    if (menuCard2) menuCard2.classList.toggle('selected', storyId === 2);
    
    buildSlideshow(story);
    
    const screenMenu = document.getElementById('screenMenu');
    const screenSlideshow = document.getElementById('screenSlideshow');
    
    if (screenMenu) screenMenu.classList.remove('visible');
    
    setTimeout(() => {
        if (screenSlideshow) screenSlideshow.classList.add('visible');
        showSlide(0);
        startAutoSlide();
    }, 350);
}

function buildSlideshow(story) {
    const container = document.getElementById('slideshowCinematic');
    const dotsContainer = document.getElementById('slideDots');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    story.slides.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = 'cinematic-slide';
        if (index === 0) slideEl.classList.add('active');
        
        slideEl.innerHTML = `
            <div class="cinematic-slide-bg" style="background-image: url('images/${slide.img}')"></div>
            <div class="cinematic-slide-content">
                <div class="cinematic-chapter">${story.chapter} — Slide ${index + 1}</div>
                <h2 class="cinematic-title">${slide.title}</h2>
                <p class="cinematic-desc">${slide.desc}</p>
                <div class="cinematic-tags">
                    ${slide.tags.map(tag => `<span class="cinematic-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(slideEl);
    });
    
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        story.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.cinematic-slide');
    const dots = document.querySelectorAll('.progress-dot');
    const counter = document.getElementById('slideCounter');
    
    if (index < 0 || index >= slides.length) return;
    
    currentSlide = index;
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'done');
        if (i === index) {
            dot.classList.add('active');
            dot.style.animation = 'none';
            dot.offsetHeight; 
            dot.style.animation = '';
        } else if (i < index) {
            dot.classList.add('done');
        }
    });
    
    if (counter) {
        counter.textContent = `${index + 1} / ${slides.length}`;
    }
}

function navigateSlide(direction) {
    const slides = document.querySelectorAll('.cinematic-slide');
    if (slides.length === 0) return;
    
    let newIndex = currentSlide + direction;
    
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;
    
    showSlide(newIndex);
    resetAutoSlide();
}

function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function exitSlideshow() {
    if (currentStory === null) return;
    
    clearAutoSlide();
    currentStory = null;
    currentSlide = 0;
    
    const screenMenu = document.getElementById('screenMenu');
    const screenSlideshow = document.getElementById('screenSlideshow');
    const game1Btn = document.getElementById('game1Btn');
    const game2Btn = document.getElementById('game2Btn');
    const menuCard1 = document.getElementById('menuCard1');
    const menuCard2 = document.getElementById('menuCard2');
    
    if (game1Btn) game1Btn.classList.add('active-game');
    if (game2Btn) game2Btn.classList.remove('active-game');
    if (menuCard1) menuCard1.classList.remove('selected');
    if (menuCard2) menuCard2.classList.remove('selected');
    
    if (screenSlideshow) screenSlideshow.classList.remove('visible');
    
    setTimeout(() => {
        if (screenMenu) screenMenu.classList.add('visible');
    }, 350);
}

function startAutoSlide() {
    clearAutoSlide();
    autoSlideTimer = setInterval(() => {
        navigateSlide(1);
    }, AUTO_SLIDE_INTERVAL);
}

function resetAutoSlide() {
    clearAutoSlide();
    startAutoSlide();
}

function clearAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
}

// ============================================
// TELEVISIONS PAGE - TV DATA & TABLE
// ============================================

function renderTable() {
    const searchInput = document.getElementById('tvSearchInput');
    const energyFilter = document.getElementById('energyFilter');
    const displayFilter = document.getElementById('displayFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const energyValue = energyFilter ? energyFilter.value : 'all';
    const displayValue = displayFilter ? displayFilter.value : 'all';
    
    const filteredData = tvData.filter(tv => {
        const matchesSearch = tv.brand.toLowerCase().includes(searchTerm) || tv.model.toLowerCase().includes(searchTerm);
        const matchesEnergy = energyValue === 'all' || tv.energyStar === energyValue;
        const matchesDisplay = displayValue === 'all' || tv.displayType === displayValue;
        return matchesSearch && matchesEnergy && matchesDisplay;
    });
    
    const tvCountSpan = document.getElementById('tvCount');
    if (tvCountSpan) tvCountSpan.textContent = filteredData.length;
    
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
        
        html += `<tr>
            <td><strong>${tv.brand}</strong></td>
            <td>${tv.model}</td>
            <td>${tv.size}"</td>
            <td>${tv.displayType}</td>
            <td>${tv.powerWatts} W</td>
            <td>${tv.standbyWatts} W</td>
            <td>${tv.annualKWh} kWh<br><span class="star-rating">${starRating}</span></td>
            <td>${energyStarBadge}</td>
            <td class="cost-highlight">$${annualCost}/year</td>
        </tr>`;
    });
    tableBody.innerHTML = html;
}

async function loadCSVData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const filterSidebar = document.getElementById('filterSidebar');
    const tableContainer = document.getElementById('tableContainer');
    const costNote = document.getElementById('costNote');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        loadingIndicator.style.display = 'block';
        const response = await fetch('data/tv.csv');
        if (!response.ok) throw new Error('Failed to load CSV file');
        
        const csvText = await response.text();
        tvData = parseCSV(csvText);
        
        tvData.forEach(tv => { if (tv.displayType) displayTypes.add(tv.displayType); });
        
        const displayFilter = document.getElementById('displayFilter');
        if (displayFilter) {
            displayTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                displayFilter.appendChild(option);
            });
        }
        
        filterSidebar.style.display = 'block';
        tableContainer.style.display = 'block';
        costNote.style.display = 'flex';
        loadingIndicator.style.display = 'none';
        renderTable();
        
    } catch (error) {
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'flex';
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="9" class="no-results">Failed to load TV data. Please ensure data/tv.csv exists.</td></tr>';
        }
    }
}

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

function setupAboutAnimations() {
    const impactCards = document.querySelectorAll('.impact-card h3');
    
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

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupMobileMenu();
    setupSearch();
    setupTelevisionsFilters();
    setupAboutAnimations();
    initTVStoryboard();
});