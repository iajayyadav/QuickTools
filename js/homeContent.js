// homeContent.js

export function createHomeContent() {
    const content = `
        <section class="info-section">
            <div class="info-content">
                <h2>Why Choose QuickTools Hub?</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>🚀 Fast & Efficient</h3>
                        <p>All tools run directly in your browser with no uploads to external servers, ensuring quick results and maximum privacy.</p>
                    </div>
                    <div class="feature-card">
                        <h3>🔒 Privacy First</h3>
                        <p>Your data never leaves your device. We use client-side processing for all operations, keeping your information secure.</p>
                    </div>
                    <div class="feature-card">
                        <h3>💯 Free Forever</h3>
                        <p>All tools are completely free to use with no hidden fees, subscriptions, or premium features.</p>
                    </div>
                    <div class="feature-card">
                        <h3>🎨 Modern Interface</h3>
                        <p>Clean, intuitive design with dark mode support and responsive layout for all devices.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="info-section">
            <div class="info-content">
                <h2>Tool Categories</h2>
                <div class="category-list">
                    <div class="category-item">
                        <h4>File Tools</h4>
                        <p>Convert, compress, and manipulate various file formats</p>
                    </div>
                    <div class="category-item">
                        <h4>Text Tools</h4>
                        <p>Word counting, formatting, and text manipulation</p>
                    </div>
                    <div class="category-item">
                        <h4>Calculators</h4>
                        <p>Financial, mathematical, and unit conversions</p>
                    </div>
                    <div class="category-item">
                        <h4>Generators</h4>
                        <p>Create QR codes, passwords, and more</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="info-section stats-section">
            <div class="container">
                <h2>QuickTools Hub in Numbers</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">
                            <span class="counter" data-target="20">0</span>+
                        </div>
                        <div class="stat-label">Free Tools</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">
                            <span class="counter" data-target="0">0</span>
                        </div>
                        <div class="stat-label">Ads</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">
                            <span class="counter" data-target="100">0</span>%
                        </div>
                        <div class="stat-label">Free</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">
                            <span class="counter" data-target="24">0</span>/7
                        </div>
                        <div class="stat-label">Available</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="info-section">
            <div class="info-content">
                <h2>How It Works</h2>
                <p>QuickTools Hub leverages modern web technologies to provide powerful utility tools that run directly in your browser. There's no need to install software or create accounts - simply choose a tool and start using it immediately.</p>
                
                <p>All processing happens on your device, which means:</p>
                <ul style="margin-left: 2rem; margin-bottom: 2rem; color: var(--text-color); line-height: 1.6;">
                    <li>Faster results - no waiting for server processing</li>
                    <li>Enhanced privacy - your files never leave your device</li>
                    <li>Offline capability for many tools</li>
                    <li>No usage limits or restrictions</li>
                </ul>

                <h2>Start Using QuickTools Hub Today</h2>
                <p>Whether you're a developer, content creator, student, or professional, QuickTools Hub has the utilities you need to be more productive. All tools are free, require no registration, and are available 24/7. Choose from our growing collection of tools and streamline your workflow today.</p>
            </div>
        </section>
    `;

    const homeContainer = document.createElement('div');
    homeContainer.id = 'home-content';
    homeContainer.innerHTML = content;
    return homeContainer;
}

export function initHomeContent() {
    // Add fade-in animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe all info sections
    document.querySelectorAll('.info-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Add hover effects for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--hover-box-shadow)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--soft-box-shadow)';
        });
    });

    // Initialize counters
    const counters = document.querySelectorAll('.counter');
    let started = false;

    function startCounting() {
        if (started) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // Animation duration in milliseconds
            const steps = 50; // Number of steps
            const stepDuration = duration / steps;
            let current = 0;
            
            const increment = target / steps;
            counter.closest('.stat-item').classList.add('animate');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.round(current);
                }
            }, stepDuration);
        });
        
        started = true;
    }

    // Start animation when stats section comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting();
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // Start animation when 30% of the section is visible
    });

    // Observe the stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
} 