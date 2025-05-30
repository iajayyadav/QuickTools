// Function to load HTML components
import { initNav } from './nav.js';

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;

        // Initialize navigation after loading header
        if (elementId === 'main-header') {
            initNav();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { // Mobile view
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-item');
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Don't prevent default for external page links
            if (href.endsWith('.html')) {
                return;
            }

            // Handle tool links
            if (href.includes('#') && !href.endsWith('#')) {
                e.preventDefault();
                if (!isHomePage) {
                    window.location.href = href;
                } else {
                    const toolId = href.split('#')[1];
                    window.location.hash = toolId;
                }
            }

            // Handle home link
            if (href === '/') {
                if (isHomePage) {
                    e.preventDefault();
                    window.location.hash = '';
                    window.scrollTo(0, 0);
                }
            }
        });
    });
}

// Function to set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Function to update active navigation link
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-item');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        // Match exact paths for pages
        if (href === currentPath || 
            (currentPath === '/' && href === '/') ||
            (href.endsWith('.html') && currentPath.endsWith(href))) {
            link.classList.add('active');
        }
        
        // Match hash for tools
        if (currentHash && href.endsWith(currentHash)) {
            link.classList.add('active');
            const parentDropdown = link.closest('.nav-dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.nav-link').classList.add('active');
            }
        }
    });
}

// Initialize components
export async function initializeComponents() {
    // Determine the correct path based on current location
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const componentPath = isInPagesDir ? '../components' : 'components';
    
    // Load navbar and footer
    await loadComponent('main-header', `${componentPath}/nav.html`);
    await loadComponent('main-footer', `${componentPath}/footer.html`);
    
    // Set current year
    setCurrentYear();
    
    // Update active navigation
    updateActiveNavLink();
    
    // Add navigation event listeners
    window.addEventListener('hashchange', updateActiveNavLink);
    window.addEventListener('popstate', updateActiveNavLink);
} 