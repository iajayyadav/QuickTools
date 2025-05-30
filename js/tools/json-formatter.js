export function init() {
    const contentDiv = document.getElementById('json-formatter-content');
    if (!contentDiv) return;

    const styles = {
        container: `
            background: var(--tool-card-bg);
            padding: 2rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--soft-box-shadow);
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
        `,
        editorContainer: `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 1.5rem;
            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        `,
        controlsSection: `
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        `,
        textarea: `
            width: 100%;
            min-height: 400px;
            padding: 1rem;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.5;
            border: 1px solid var(--accent-color);
            border-radius: var(--border-radius-lg);
            background: var(--tool-card-bg);
            color: var(--text-color);
            resize: vertical;
            tab-size: 4;
        `,
        button: `
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: var(--border-radius-lg);
            font-size: 1em;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `,
        primaryBtn: `
            background: var(--accent-color);
            color: white;
        `,
        secondaryBtn: `
            background: rgba(0, 184, 148, 0.1);
            color: var(--accent-color);
        `,
        errorMessage: `
            color: #e74c3c;
            padding: 1rem;
            margin: 1rem 0;
            background: rgba(231, 76, 60, 0.1);
            border-radius: var(--border-radius-lg);
            display: none;
        `,
        select: `
            padding: 0.8rem;
            border: 1px solid var(--accent-color);
            border-radius: var(--border-radius-lg);
            background: var(--tool-card-bg);
            color: var(--text-color);
            font-size: 1em;
            cursor: pointer;
        `,
        label: `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-color);
        `,
        seoContent: `
            margin-bottom: 2rem;
            color: var(--text-color);
            line-height: 1.6;
        `,
        heading: `
            color: var(--text-color);
            margin-bottom: 1rem;
            font-size: 1.5em;
        `,
        subheading: `
            color: var(--text-color);
            margin: 1rem 0;
            font-size: 1.2em;
        `,
        paragraph: `
            margin-bottom: 1rem;
            color: var(--text-color);
            line-height: 1.6;
        `,
        featureList: `
            list-style: disc;
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        `,
        featureItem: `
            margin-bottom: 0.5rem;
            color: var(--text-color);
        `
    };

    contentDiv.innerHTML = `
        <div style="${styles.container}">
            <div style="${styles.seoContent}">
                <h1 style="${styles.heading}">JSON Formatter and Validator</h1>
                <p style="${styles.paragraph}">
                    Transform your raw JSON data into a clean, readable format with our powerful JSON formatter tool. 
                    Whether you're a developer debugging API responses, working with configuration files, or just need 
                    to make your JSON data more readable, this tool has you covered.
                </p>
                
                <h2 style="${styles.subheading}">Key Features</h2>
                <ul style="${styles.featureList}">
                    <li style="${styles.featureItem}">Format JSON with customizable indentation (2 spaces, 4 spaces, or tabs)</li>
                    <li style="${styles.featureItem}">Minify JSON by removing unnecessary whitespace</li>
                    <li style="${styles.featureItem}">Sort object keys alphabetically for better organization</li>
                    <li style="${styles.featureItem}">Validate JSON syntax and get clear error messages</li>
                    <li style="${styles.featureItem}">Copy formatted JSON to clipboard with one click</li>
                </ul>

                <h2 style="${styles.subheading}">How to Use</h2>
                <p style="${styles.paragraph}">
                    Simply paste your JSON into the input area on the left. Choose your preferred formatting options 
                    from the controls above. Click "Format JSON" to beautify your code, or "Minify" to compress it. 
                    The formatted result will appear in the right panel. Use keyboard shortcuts like Ctrl+Enter 
                    (Cmd+Enter on Mac) to format quickly.
                </p>

                <h2 style="${styles.subheading}">Pro Tips</h2>
                <p style="${styles.paragraph}">
                    Double-click the input area when empty to load a sample JSON. This helps you quickly understand 
                    the tool's capabilities. The "Sort Keys" option is particularly useful when comparing different 
                    JSON objects or creating consistent configurations.
                </p>
            </div>

            <div style="${styles.controlsSection}">
                <button id="formatBtn" style="${styles.button}${styles.primaryBtn}">
                    <span class="icon">🔄</span> Format JSON
                </button>
                <button id="minifyBtn" style="${styles.button}${styles.secondaryBtn}">
                    <span class="icon">📦</span> Minify
                </button>
                <button id="copyBtn" style="${styles.button}${styles.secondaryBtn}">
                    <span class="icon">📋</span> Copy
                </button>
                <button id="clearBtn" style="${styles.button}${styles.secondaryBtn}">
                    <span class="icon">🗑️</span> Clear
                </button>
                <select id="indentSelect" style="${styles.select}">
                    <option value="2">2 spaces</option>
                    <option value="4" selected>4 spaces</option>
                    <option value="tab">Tab</option>
                </select>
                <label style="${styles.label}">
                    <input type="checkbox" id="sortCheckbox"> Sort Keys
                </label>
            </div>
            
            <div style="${styles.editorContainer}">
                <div>
                    <textarea 
                        id="inputJson" 
                        placeholder="Paste your JSON here..."
                        style="${styles.textarea}"
                        spellcheck="false"
                        aria-label="Input JSON"
                    ></textarea>
                </div>
                <div>
                    <textarea 
                        id="outputJson" 
                        readonly 
                        placeholder="Formatted JSON will appear here..."
                        style="${styles.textarea}"
                        spellcheck="false"
                        aria-label="Formatted JSON Output"
                    ></textarea>
                </div>
            </div>
            
            <div id="errorMsg" style="${styles.errorMessage}"></div>

            <div style="${styles.seoContent}">
                <h2 style="${styles.subheading}">About JSON Formatting</h2>
                <p style="${styles.paragraph}">
                    JSON (JavaScript Object Notation) is a lightweight data interchange format that's easy for humans 
                    to read and write and easy for machines to parse and generate. However, when working with 
                    minified or poorly formatted JSON, it can be challenging to understand the structure and 
                    relationships between data elements.
                </p>
                <p style="${styles.paragraph}">
                    Our JSON formatter helps solve this problem by automatically formatting your JSON with proper 
                    indentation and line breaks. It also validates your JSON to ensure it follows the correct syntax, 
                    helping you catch and fix errors quickly. Whether you're debugging API responses, configuring 
                    applications, or learning about JSON structure, this tool makes your JSON data clear and 
                    manageable.
                </p>
            </div>
        </div>
    `;

    const inputJson = document.getElementById('inputJson');
    const outputJson = document.getElementById('outputJson');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const errorMsg = document.getElementById('errorMsg');
    const indentSelect = document.getElementById('indentSelect');
    const sortCheckbox = document.getElementById('sortCheckbox');

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        outputJson.value = '';
    }

    function hideError() {
        errorMsg.style.display = 'none';
    }

    function getIndentation() {
        const value = indentSelect.value;
        return value === 'tab' ? '\t' : ' '.repeat(parseInt(value));
    }

    function formatJSON(minify = false) {
        hideError();
        const input = inputJson.value.trim();
        
        if (!input) {
            showError('Please enter JSON to format');
            return;
        }

        try {
            let parsed = JSON.parse(input);
            
            if (sortCheckbox.checked) {
                parsed = sortObjectKeys(parsed);
            }

            outputJson.value = minify 
                ? JSON.stringify(parsed)
                : JSON.stringify(parsed, null, getIndentation());
                
        } catch (error) {
            showError(`Invalid JSON: ${error.message}`);
        }
    }

    function sortObjectKeys(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        }

        return Object.keys(obj)
            .sort()
            .reduce((sorted, key) => {
                sorted[key] = sortObjectKeys(obj[key]);
                return sorted;
            }, {});
    }

    async function copyToClipboard() {
        const textToCopy = outputJson.value;
        if (!textToCopy) {
            showError('Nothing to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="icon">✅</span> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            showError('Failed to copy to clipboard');
        }
    }

    function clearAll() {
        inputJson.value = '';
        outputJson.value = '';
        hideError();
    }

    // Event Listeners
    formatBtn.addEventListener('click', () => formatJSON(false));
    minifyBtn.addEventListener('click', () => formatJSON(true));
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);
    
    // Add sample JSON on double click of input
    inputJson.addEventListener('dblclick', () => {
        if (!inputJson.value) {
            inputJson.value = JSON.stringify({
                name: "JSON Formatter",
                version: 1.0,
                features: ["format", "minify", "sort keys"],
                settings: {
                    indentation: "configurable",
                    sortKeys: true
                },
                nested: {
                    objects: {
                        work: "perfectly",
                        arrays: [1, 2, 3]
                    }
                }
            }, null, 2);
        }
    });

    // Format on Ctrl+Enter or Cmd+Enter
    inputJson.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            formatJSON(false);
        }
    });

    // Return cleanup function
    return () => {
        // Cleanup event listeners if needed
    };
} 