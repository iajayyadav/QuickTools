// DOM Elements
const toolsGrid = document.querySelector('.tools-grid');
const toolContent = document.getElementById('tool-content');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Create tool cards
function createToolCards() {
    toolsGrid.innerHTML = tools.map(tool => `
        <div class="tool-card" data-tool-id="${tool.id}">
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <button class="btn btn-primary">Open Tool</button>
        </div>
    `).join('');

    // Add click handlers to tool cards
    toolsGrid.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const toolId = card.dataset.toolId;
            loadTool(toolId);
        });
    });
}

// Load specific tool
function loadTool(toolId) {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    // Update UI
    toolsGrid.style.display = 'none';
    toolContent.style.display = 'block';
    toolContent.innerHTML = tool.template;

    // Execute tool's script
    if (typeof tool.script === 'function') {
        tool.script();
    }

    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-primary';
    backButton.textContent = 'Back to Tools';
    backButton.style.marginBottom = '1rem';
    backButton.addEventListener('click', showToolsGrid);
    toolContent.insertBefore(backButton, toolContent.firstChild);

    // Scroll to top
    window.scrollTo(0, 0);
}

// Show tools grid
function showToolsGrid() {
    toolContent.style.display = 'none';
    toolsGrid.style.display = 'grid';
}

// Initialize the application
function init() {
    createToolCards();

    // Handle direct links to tools
    const hash = window.location.hash.slice(1);
    if (hash) {
        loadTool(hash);
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1);
        if (newHash) {
            loadTool(newHash);
        } else {
            showToolsGrid();
        }
    });
}

// Start the application
init(); 