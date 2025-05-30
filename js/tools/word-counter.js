export function init() {
    const contentDiv = document.getElementById('word-counter-content');
    if (!contentDiv) return;

    const styles = {
        container: `
            background: var(--tool-card-bg);
            padding: 2rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--soft-box-shadow);
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
        `,
        textarea: `
            width: 100%;
            min-height: 200px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--accent-color);
            border-radius: var(--border-radius-lg);
            background: var(--tool-card-bg);
            color: var(--text-color);
            font-size: 1em;
            line-height: 1.5;
            resize: vertical;
            transition: border-color 0.2s ease;
        `,
        statsGrid: `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        `,
        statCard: `
            background: rgba(0, 184, 148, 0.05);
            padding: 1rem;
            border-radius: var(--border-radius-lg);
            text-align: center;
        `,
        statValue: `
            font-size: 2em;
            font-weight: bold;
            color: var(--accent-color);
            margin-bottom: 0.5rem;
            font-family: monospace;
        `,
        statLabel: `
            color: var(--text-color);
            font-size: 0.9em;
            opacity: 0.8;
        `,
        detailsSection: `
            margin-top: 2rem;
            padding: 1rem;
            border-radius: var(--border-radius-lg);
            background: rgba(0, 184, 148, 0.05);
        `,
        detailsTitle: `
            color: var(--text-color);
            font-size: 1.1em;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(0, 184, 148, 0.2);
        `,
        detailsGrid: `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        `,
        detailItem: `
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            color: var(--text-color);
            font-size: 0.9em;
        `,
        clearButton: `
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: var(--border-radius-lg);
            cursor: pointer;
            font-size: 1em;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-left: auto;
        `
    };

    contentDiv.innerHTML = `
        <div style="${styles.container}">
            <textarea 
                id="text-input" 
                placeholder="Type or paste your text here..." 
                style="${styles.textarea}"
            ></textarea>
            <div style="${styles.statsGrid}">
                <div style="${styles.statCard}">
                    <div style="${styles.statValue}" id="word-count">0</div>
                    <div style="${styles.statLabel}">Words</div>
                </div>
                <div style="${styles.statCard}">
                    <div style="${styles.statValue}" id="char-count">0</div>
                    <div style="${styles.statLabel}">Characters</div>
                </div>
                <div style="${styles.statCard}">
                    <div style="${styles.statValue}" id="char-no-spaces">0</div>
                    <div style="${styles.statLabel}">Characters (no spaces)</div>
                </div>
                <div style="${styles.statCard}">
                    <div style="${styles.statValue}" id="reading-time">0m 0s</div>
                    <div style="${styles.statLabel}">Reading Time</div>
                </div>
            </div>
            <button id="clear-btn" style="${styles.clearButton}">
                <span class="icon">🗑️</span> Clear Text
            </button>
            <div style="${styles.detailsSection}">
                <div style="${styles.detailsTitle}">Detailed Statistics</div>
                <div style="${styles.detailsGrid}">
                    <div style="${styles.detailItem}">
                        <span>Sentences:</span>
                        <span id="sentence-count">0</span>
                    </div>
                    <div style="${styles.detailItem}">
                        <span>Paragraphs:</span>
                        <span id="paragraph-count">0</span>
                    </div>
                    <div style="${styles.detailItem}">
                        <span>Avg. Word Length:</span>
                        <span id="avg-word-length">0</span>
                    </div>
                    <div style="${styles.detailItem}">
                        <span>Unique Words:</span>
                        <span id="unique-words">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const charNoSpaces = document.getElementById('char-no-spaces');
    const readingTime = document.getElementById('reading-time');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const avgWordLength = document.getElementById('avg-word-length');
    const uniqueWords = document.getElementById('unique-words');
    const clearBtn = document.getElementById('clear-btn');

    function getWordCount(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function getUniqueWords(text) {
        const words = text.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
        return new Set(words).size;
    }

    function getSentenceCount(text) {
        return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    }

    function getParagraphCount(text) {
        return text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
    }

    function getAverageWordLength(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        if (words.length === 0) return 0;
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        return (totalLength / words.length).toFixed(1);
    }

    function calculateReadingTime(wordCount) {
        const wordsPerMinute = 200;
        const minutes = Math.floor(wordCount / wordsPerMinute);
        const seconds = Math.round((wordCount % wordsPerMinute) / (wordsPerMinute / 60));
        return `${minutes}m ${seconds}s`;
    }

    function updateStats() {
        const text = textInput.value;
        const words = getWordCount(text);
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;

        wordCount.textContent = words;
        charCount.textContent = chars;
        charNoSpaces.textContent = charsNoSpaces;
        readingTime.textContent = calculateReadingTime(words);
        sentenceCount.textContent = getSentenceCount(text);
        paragraphCount.textContent = getParagraphCount(text);
        avgWordLength.textContent = getAverageWordLength(text);
        uniqueWords.textContent = getUniqueWords(text);
    }

    // Event listeners
    textInput.addEventListener('input', updateStats);
    
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateStats();
    });

    // Initialize with empty state
    updateStats();
} 