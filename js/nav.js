// Navigation functionality
export function initNav() {
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const themeToggle = document.getElementById('theme-toggle');
    
    let lastScrollY = window.scrollY;
    let isScrollingUp = false;

    // Handle scroll-based header visibility
    function handleScroll() {
        const currentScrollY = window.scrollY;
        isScrollingUp = currentScrollY < lastScrollY;

        // Show/hide header based on scroll direction
        if (currentScrollY > 100) {
            if (isScrollingUp) {
                header.classList.remove('header-hidden');
            } else {
                header.classList.add('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = nav.classList.contains('active');
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? '' : 'hidden';
        
        // Close all dropdowns when closing menu
        if (!isActive) {
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    }

    // Handle dropdowns
    function setupDropdowns() {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const content = dropdown.querySelector('.nav-dropdown-content');

            // Toggle dropdown on click (mobile)
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown && other.classList.contains('active')) {
                            other.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                }
            });

            // Handle hover interactions (desktop)
            if (window.innerWidth > 768) {
                let hoverTimeout;

                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimeout);
                    dropdowns.forEach(other => other.classList.remove('active'));
                    dropdown.classList.add('active');
                });

                dropdown.addEventListener('mouseleave', () => {
                    hoverTimeout = setTimeout(() => {
                        dropdown.classList.remove('active');
                    }, 200);
                });
            }
        });
    }

    // Handle theme toggle
    function setupThemeToggle() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let isDarkMode = localStorage.getItem('darkMode') === 'true' || prefersDark;

        function updateTheme() {
            document.documentElement.classList.toggle('dark-mode', isDarkMode);
            const themeIcon = themeToggle.querySelector('.theme-icon i');
            themeIcon.classList.remove('fa-sun', 'fa-moon');
            themeIcon.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
            localStorage.setItem('darkMode', isDarkMode);
        }

        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            updateTheme();
        });

        // Initial theme setup
        updateTheme();
    }

    // Close mobile menu when clicking outside
    function handleOutsideClick(e) {
        if (window.innerWidth <= 768) {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    }

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            setupDropdowns();
        }
    }

    // Update active navigation state
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        document.querySelectorAll('.nav-link, .nav-dropdown-item').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === currentPath || 
                (currentPath === '/' && href === '/') ||
                (href.endsWith('.html') && currentPath.endsWith(href)) ||
                (currentHash && href.endsWith(currentHash))) {
                
                link.classList.add('active');
                
                // If it's a dropdown item, also activate its parent
                const parentDropdown = link.closest('.nav-dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('.nav-link').classList.add('active');
                }
            }
        });
    }

    // Initialize
    function init() {
        // Set up event listeners
        hamburger.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        window.addEventListener('hashchange', updateActiveNav);
        window.addEventListener('popstate', updateActiveNav);

        // Initial setup
        setupDropdowns();
        setupThemeToggle();
        updateActiveNav();
    }

    // Start initialization
    init();
} 