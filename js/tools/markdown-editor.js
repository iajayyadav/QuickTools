// Markdown Editor Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('markdown-editor-content');
    if (!container) return;

    // Load required external libraries
    const markdownitScript = document.createElement('script');
    markdownitScript.src = 'https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/dist/markdown-it.min.js';
    document.head.appendChild(markdownitScript);

    const highlightScript = document.createElement('script');
    highlightScript.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js';
    document.head.appendChild(highlightScript);

    const highlightCSS = document.createElement('link');
    highlightCSS.rel = 'stylesheet';
    highlightCSS.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/github.min.css';
    document.head.appendChild(highlightCSS);

    container.innerHTML = `
        <div class="markdown-editor-container">
            <div class="toolbar">
                <div class="toolbar-group">
                    <button class="tool-btn" title="Bold" data-format="bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button class="tool-btn" title="Italic" data-format="italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button class="tool-btn" title="Strikethrough" data-format="strikethrough">
                        <i class="fas fa-strikethrough"></i>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="tool-btn" title="Heading 1" data-format="h1">
                        <i class="fas fa-heading"></i>1
                    </button>
                    <button class="tool-btn" title="Heading 2" data-format="h2">
                        <i class="fas fa-heading"></i>2
                    </button>
                    <button class="tool-btn" title="Heading 3" data-format="h3">
                        <i class="fas fa-heading"></i>3
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="tool-btn" title="Bulleted List" data-format="ul">
                        <i class="fas fa-list-ul"></i>
                    </button>
                    <button class="tool-btn" title="Numbered List" data-format="ol">
                        <i class="fas fa-list-ol"></i>
                    </button>
                    <button class="tool-btn" title="Task List" data-format="task">
                        <i class="fas fa-tasks"></i>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="tool-btn" title="Link" data-format="link">
                        <i class="fas fa-link"></i>
                    </button>
                    <button class="tool-btn" title="Image" data-format="image">
                        <i class="fas fa-image"></i>
                    </button>
                    <button class="tool-btn" title="Code Block" data-format="code">
                        <i class="fas fa-code"></i>
                    </button>
                    <button class="tool-btn" title="Quote" data-format="quote">
                        <i class="fas fa-quote-right"></i>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="tool-btn" title="Table" data-format="table">
                        <i class="fas fa-table"></i>
                    </button>
                    <button class="tool-btn" title="Horizontal Rule" data-format="hr">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>

            <div class="editor-wrapper">
                <div class="editor-section">
                    <div class="section-header">
                        <h3>Editor</h3>
                        <div class="actions">
                            <button id="copyMarkdown" class="action-btn" title="Copy Markdown">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button id="clearEditor" class="action-btn" title="Clear Editor">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button id="togglePreview" class="action-btn" title="Toggle Preview">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <textarea id="markdownInput" placeholder="Type your markdown here..."></textarea>
                </div>

                <div class="preview-section">
                    <div class="section-header">
                        <h3>Preview</h3>
                        <div class="actions">
                            <button id="copyHtml" class="action-btn" title="Copy HTML">
                                <i class="fas fa-code"></i>
                            </button>
                        </div>
                    </div>
                    <div id="markdownPreview" class="markdown-preview"></div>
                </div>
            </div>

            <div class="help-section">
                <h3><i class="fas fa-question-circle"></i> Markdown Cheat Sheet</h3>
                <div class="cheat-sheet-grid">
                    <div class="cheat-item">
                        <code># Heading 1</code>
                        <span>Creates a top-level heading</span>
                    </div>
                    <div class="cheat-item">
                        <code>**Bold Text**</code>
                        <span>Makes text bold</span>
                    </div>
                    <div class="cheat-item">
                        <code>*Italic Text*</code>
                        <span>Makes text italic</span>
                    </div>
                    <div class="cheat-item">
                        <code>[Link](url)</code>
                        <span>Creates a hyperlink</span>
                    </div>
                    <div class="cheat-item">
                        <code>![Alt Text](image-url)</code>
                        <span>Embeds an image</span>
                    </div>
                    <div class="cheat-item">
                        <code>\`Code\`</code>
                        <span>Inline code</span>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .markdown-editor-container {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .toolbar {
                background: var(--tool-card-bg);
                padding: 1rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .toolbar-group {
                display: flex;
                gap: 0.5rem;
                padding-right: 1rem;
                border-right: 1px solid var(--border-color);
            }

            .toolbar-group:last-child {
                border-right: none;
                padding-right: 0;
            }

            .tool-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .tool-btn:hover {
                background: var(--accent-color);
                color: white;
                transform: translateY(-2px);
            }

            .editor-wrapper {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                min-height: 500px;
            }

            .editor-section, .preview-section {
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
                display: flex;
                flex-direction: column;
            }

            .section-header {
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .section-header h3 {
                color: var(--text-color);
                font-size: 1.1rem;
            }

            .actions {
                display: flex;
                gap: 0.5rem;
            }

            .action-btn {
                padding: 0.5rem;
                border: none;
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
            }

            .action-btn:hover {
                background: var(--accent-color);
                color: white;
            }

            .action-btn.active {
                background: var(--accent-color);
                color: white;
            }

            #markdownInput {
                flex: 1;
                padding: 1rem;
                border: none;
                background: var(--bg-color);
                color: var(--text-color);
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
                font-size: 0.95rem;
                line-height: 1.6;
                resize: none;
            }

            #markdownInput:focus {
                outline: none;
            }

            .markdown-preview {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                background: var(--bg-color);
                color: var(--text-color);
            }

            .markdown-preview h1,
            .markdown-preview h2,
            .markdown-preview h3 {
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .markdown-preview p {
                margin-bottom: 1rem;
                line-height: 1.6;
            }

            .markdown-preview code {
                background: var(--border-color);
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-family: monospace;
            }

            .markdown-preview pre {
                background: var(--border-color);
                padding: 1rem;
                border-radius: var(--border-radius-lg);
                overflow-x: auto;
                margin-bottom: 1rem;
            }

            .markdown-preview blockquote {
                border-left: 4px solid var(--accent-color);
                padding-left: 1rem;
                margin: 1rem 0;
                color: var(--text-color);
                opacity: 0.8;
            }

            .help-section {
                background: var(--tool-card-bg);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
            }

            .help-section h3 {
                color: var(--accent-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .cheat-sheet-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
            }

            .cheat-item {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .cheat-item code {
                background: var(--bg-color);
                padding: 0.5rem;
                border-radius: var(--border-radius-lg);
                font-family: monospace;
                color: var(--text-color);
            }

            .cheat-item span {
                color: var(--text-color);
                font-size: 0.9rem;
                opacity: 0.8;
            }

            @media (max-width: 768px) {
                .editor-wrapper {
                    grid-template-columns: 1fr;
                }

                .toolbar {
                    padding: 0.75rem;
                }

                .toolbar-group {
                    padding-right: 0.75rem;
                }

                .preview-section {
                    display: flex;
                }
            }
        </style>
    `;

    // Wait for external libraries to load
    markdownitScript.onload = () => {
        highlightScript.onload = () => {
            initializeEditor();
        };
    };

    function initializeEditor() {
        const md = window.markdownit({
            html: true,
            linkify: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (__) {}
                }
                return ''; // use external default escaping
            }
        });

        const input = document.getElementById('markdownInput');
        const preview = document.getElementById('markdownPreview');
        const copyMarkdownBtn = document.getElementById('copyMarkdown');
        const copyHtmlBtn = document.getElementById('copyHtml');
        const clearEditorBtn = document.getElementById('clearEditor');
        const togglePreviewBtn = document.getElementById('togglePreview');
        const toolButtons = document.querySelectorAll('.tool-btn');

        // Initialize with sample content
        input.value = `# Welcome to Markdown Editor

This is a **powerful** markdown editor with *live preview*.

## Features
- Real-time preview
- Syntax highlighting
- Common markdown controls
- HTML export

### Try it out!
1. Write some markdown
2. See the live preview
3. Export as HTML

> This is a blockquote

\`\`\`javascript
// This is a code block
function hello() {
    console.log("Hello, World!");
}
\`\`\`
`;

        // Update preview function
        function updatePreview() {
            const markdown = input.value;
            const html = md.render(markdown);
            preview.innerHTML = html;
            // Apply syntax highlighting to code blocks
            preview.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        // Format selection function
        function formatText(format) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            let formatted = '';

            switch(format) {
                case 'bold':
                    formatted = `**${text.substring(start, end)}**`;
                    break;
                case 'italic':
                    formatted = `*${text.substring(start, end)}*`;
                    break;
                case 'strikethrough':
                    formatted = `~~${text.substring(start, end)}~~`;
                    break;
                case 'h1':
                    formatted = `# ${text.substring(start, end)}`;
                    break;
                case 'h2':
                    formatted = `## ${text.substring(start, end)}`;
                    break;
                case 'h3':
                    formatted = `### ${text.substring(start, end)}`;
                    break;
                case 'ul':
                    formatted = `- ${text.substring(start, end)}`;
                    break;
                case 'ol':
                    formatted = `1. ${text.substring(start, end)}`;
                    break;
                case 'task':
                    formatted = `- [ ] ${text.substring(start, end)}`;
                    break;
                case 'link':
                    formatted = `[${text.substring(start, end)}](url)`;
                    break;
                case 'image':
                    formatted = `![${text.substring(start, end)}](image-url)`;
                    break;
                case 'code':
                    formatted = `\`\`\`\n${text.substring(start, end)}\n\`\`\``;
                    break;
                case 'quote':
                    formatted = `> ${text.substring(start, end)}`;
                    break;
                case 'table':
                    formatted = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
                    break;
                case 'hr':
                    formatted = `\n---\n`;
                    break;
            }

            input.value = text.substring(0, start) + formatted + text.substring(end);
            updatePreview();
        }

        // Event listeners
        input.addEventListener('input', updatePreview);
        
        toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                formatText(button.dataset.format);
            });
        });

        copyMarkdownBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(input.value)
                .then(() => showToast('Markdown copied to clipboard!', 'success'))
                .catch(() => showToast('Failed to copy markdown', 'error'));
        });

        copyHtmlBtn.addEventListener('click', () => {
            const html = md.render(input.value);
            navigator.clipboard.writeText(html)
                .then(() => showToast('HTML copied to clipboard!', 'success'))
                .catch(() => showToast('Failed to copy HTML', 'error'));
        });

        clearEditorBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the editor?')) {
                input.value = '';
                updatePreview();
            }
        });

        togglePreviewBtn.addEventListener('click', () => {
            const previewSection = document.querySelector('.preview-section');
            const editorSection = document.querySelector('.editor-section');
            const editorWrapper = document.querySelector('.editor-wrapper');
            const isHidden = previewSection.style.display === 'none';

            if (isHidden) {
                previewSection.style.display = 'flex';
                editorWrapper.style.gridTemplateColumns = '1fr 1fr';
                editorSection.style.gridColumn = 'auto';
                togglePreviewBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                togglePreviewBtn.title = 'Hide Preview';
                togglePreviewBtn.classList.add('active');
            } else {
                previewSection.style.display = 'none';
                editorWrapper.style.gridTemplateColumns = '1fr';
                editorSection.style.gridColumn = '1 / -1';
                togglePreviewBtn.innerHTML = '<i class="fas fa-eye"></i>';
                togglePreviewBtn.title = 'Show Preview';
                togglePreviewBtn.classList.remove('active');
            }

            // Trigger resize event to update editor layout
            window.dispatchEvent(new Event('resize'));
        });

        // Initial preview
        updatePreview();
    }
} 