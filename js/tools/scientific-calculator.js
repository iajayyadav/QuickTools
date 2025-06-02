// Scientific Calculator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('scientific-calculator-content');
    if (!container) return;

    // Create a unique scope ID for styles
    const scopeId = 'calc-' + Math.random().toString(36).substr(2, 9);
    container.setAttribute('data-scope', scopeId);

    container.innerHTML = `
        <div class="calculator">
            <div class="calculator-header">
                <div class="mode-switch">
                    <button class="mode-btn active" data-mode="rad">RAD</button>
                    <button class="mode-btn" data-mode="deg">DEG</button>
                </div>
                <button class="history-btn" title="Show History">
                    <i class="fas fa-history"></i>
                </button>
            </div>

            <div class="display">
                <div class="memory-indicator"></div>
                <div class="expression"></div>
                <div class="result">0</div>
            </div>

            <div class="history-panel" style="display: none;">
                <h3>History <button class="clear-history-btn" title="Clear History"><i class="fas fa-trash"></i></button></h3>
                <div class="history-list"></div>
            </div>

            <div class="memory-buttons">
                <button class="btn memory" data-action="MC" title="Memory Clear">MC</button>
                <button class="btn memory" data-action="MR" title="Memory Recall">MR</button>
                <button class="btn memory" data-action="M+" title="Memory Add">M+</button>
                <button class="btn memory" data-action="M-" title="Memory Subtract">M−</button>
                <button class="btn memory" data-action="MS" title="Memory Store">MS</button>
            </div>

            <div class="keypad">
                <!-- Scientific Functions -->
                <button class="btn function" data-action="sin" title="Sine">sin</button>
                <button class="btn function" data-action="cos" title="Cosine">cos</button>
                <button class="btn function" data-action="tan" title="Tangent">tan</button>
                <button class="btn operator" data-action="(" title="Open Parenthesis">(</button>
                <button class="btn operator" data-action=")" title="Close Parenthesis">)</button>

                <button class="btn function" data-action="log" title="Logarithm base 10">log</button>
                <button class="btn function" data-action="ln" title="Natural Logarithm">ln</button>
                <button class="btn function" data-action="sqrt" title="Square Root">√</button>
                <button class="btn operator" data-action="^" title="Power">^</button>
                <button class="btn operator" data-action="%" title="Percentage">%</button>

                <button class="btn function" data-action="asin" title="Arc Sine">sin⁻¹</button>
                <button class="btn function" data-action="acos" title="Arc Cosine">cos⁻¹</button>
                <button class="btn function" data-action="atan" title="Arc Tangent">tan⁻¹</button>
                <button class="btn function" data-action="abs" title="Absolute Value">|x|</button>
                <button class="btn function" data-action="fact" title="Factorial">n!</button>

                <!-- Numbers and Basic Operators -->
                <button class="btn number" data-action="7">7</button>
                <button class="btn number" data-action="8">8</button>
                <button class="btn number" data-action="9">9</button>
                <button class="btn operator" data-action="/" title="Divide">÷</button>
                <button class="btn clear" data-action="C" title="Clear All">C</button>

                <button class="btn number" data-action="4">4</button>
                <button class="btn number" data-action="5">5</button>
                <button class="btn number" data-action="6">6</button>
                <button class="btn operator" data-action="*" title="Multiply">×</button>
                <button class="btn clear" data-action="CE" title="Clear Entry">CE</button>

                <button class="btn number" data-action="1">1</button>
                <button class="btn number" data-action="2">2</button>
                <button class="btn number" data-action="3">3</button>
                <button class="btn operator" data-action="-" title="Subtract">−</button>
                <button class="btn function" data-action="pi" title="Pi (π)">π</button>

                <button class="btn number" data-action="0">0</button>
                <button class="btn number" data-action=".">.</button>
                <button class="btn function" data-action="e" title="Euler's Number">e</button>
                <button class="btn operator" data-action="+" title="Add">+</button>
                <button class="btn equals" data-action="=" title="Calculate">=</button>
            </div>
        </div>

        <style>
            [data-scope="${scopeId}"] .calculator {
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                padding: 1.5rem;
                box-shadow: var(--soft-box-shadow);
                max-width: 500px;
                margin: 0 auto;
            }

            [data-scope="${scopeId}"] .calculator-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            [data-scope="${scopeId}"] .mode-switch {
                display: flex;
                gap: 0.5rem;
                background: var(--bg-color);
                padding: 0.25rem;
                border-radius: var(--border-radius-lg);
            }

            [data-scope="${scopeId}"] .mode-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: var(--border-radius-lg);
                background: transparent;
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            [data-scope="${scopeId}"] .mode-btn.active {
                background: var(--accent-color);
                color: white;
            }

            [data-scope="${scopeId}"] .history-btn {
                background: none;
                border: none;
                color: var(--text-color);
                cursor: pointer;
                padding: 0.5rem;
                font-size: 1.2rem;
                transition: all 0.2s ease;
            }

            [data-scope="${scopeId}"] .history-btn:hover {
                color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .display {
                background: var(--bg-color);
                padding: 1rem;
                border-radius: var(--border-radius-lg);
                margin-bottom: 1rem;
                text-align: right;
                min-height: 100px;
                position: relative;
            }

            [data-scope="${scopeId}"] .memory-indicator {
                position: absolute;
                top: 0.5rem;
                left: 0.5rem;
                font-size: 0.8rem;
                color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .expression {
                font-size: 0.9rem;
                color: var(--text-muted);
                min-height: 1.5rem;
                word-wrap: break-word;
                margin-bottom: 0.5rem;
            }

            [data-scope="${scopeId}"] .result {
                font-size: 2rem;
                font-weight: bold;
                word-wrap: break-word;
            }

            [data-scope="${scopeId}"] .history-panel {
                background: var(--bg-color);
                border-radius: var(--border-radius-lg);
                margin-bottom: 1rem;
                padding: 1rem;
                max-height: 200px;
                overflow-y: auto;
            }

            [data-scope="${scopeId}"] .history-panel h3 {
                margin: 0 0 0.5rem 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            [data-scope="${scopeId}"] .clear-history-btn {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0.25rem;
                transition: all 0.2s ease;
            }

            [data-scope="${scopeId}"] .clear-history-btn:hover {
                color: var(--error-color);
            }

            [data-scope="${scopeId}"] .history-item {
                padding: 0.5rem;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            [data-scope="${scopeId}"] .history-item:hover {
                background: var(--tool-card-bg);
            }

            [data-scope="${scopeId}"] .memory-buttons {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            [data-scope="${scopeId}"] .memory {
                font-size: 0.9rem;
                background: var(--bg-color);
                color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .keypad {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 0.5rem;
            }

            [data-scope="${scopeId}"] .btn {
                padding: 1rem;
                border: none;
                border-radius: var(--border-radius-lg);
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.2s ease;
                background: var(--bg-color);
                color: var(--text-color);
                position: relative;
            }

            [data-scope="${scopeId}"] .btn:hover {
                transform: scale(0.95);
                opacity: 0.9;
            }

            [data-scope="${scopeId}"] .btn:active {
                transform: scale(0.9);
            }

            [data-scope="${scopeId}"] .btn[title]:hover::after {
                content: attr(title);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 0.25rem 0.5rem;
                background: var(--text-color);
                color: var(--bg-color);
                font-size: 0.8rem;
                border-radius: var(--border-radius-lg);
                white-space: nowrap;
                z-index: 1000;
            }

            [data-scope="${scopeId}"] .number {
                background: var(--bg-color);
            }

            [data-scope="${scopeId}"] .operator {
                background: var(--accent-color);
                color: white;
            }

            [data-scope="${scopeId}"] .function {
                background: var(--tool-card-bg);
                border: 1px solid var(--border-color);
            }

            [data-scope="${scopeId}"] .equals {
                background: var(--success-color);
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .clear {
                background: var(--error-color);
                color: var(--text-color);
            }

            @media (max-width: 480px) {
                [data-scope="${scopeId}"] .btn {
                    padding: 0.8rem;
                    font-size: 1rem;
                }

                [data-scope="${scopeId}"] .memory {
                    font-size: 0.8rem;
                    padding: 0.5rem;
                }
            }
        </style>
    `;

    // Calculator state
    let expression = '';
    let result = '0';
    let lastResult = null;
    let memory = 0;
    let history = [];
    let isRadianMode = true;

    // DOM elements
    const expressionDisplay = container.querySelector('.expression');
    const resultDisplay = container.querySelector('.result');
    const memoryIndicator = container.querySelector('.memory-indicator');
    const historyPanel = container.querySelector('.history-panel');
    const historyList = container.querySelector('.history-list');
    const keypad = container.querySelector('.keypad');
    const modeBtns = container.querySelectorAll('.mode-btn');

    // Helper functions
    function updateDisplay() {
        expressionDisplay.textContent = expression;
        resultDisplay.textContent = result;
        memoryIndicator.textContent = memory !== 0 ? 'M' : '';
    }

    function addToHistory(expr, res) {
        if (expr && res !== 'Error') {
            history.unshift({ expression: expr, result: res });
            if (history.length > 10) history.pop();
            updateHistoryDisplay();
        }
    }

    function updateHistoryDisplay() {
        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-expr="${item.expression}">
                <div>${item.expression}</div>
                <div style="color: var(--accent-color);">${item.result}</div>
            </div>
        `).join('');
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    function balanceParentheses(expr) {
        let openCount = (expr.match(/\(/g) || []).length;
        let closeCount = (expr.match(/\)/g) || []).length;
        return expr + ')'.repeat(openCount - closeCount);
    }

    function evaluateExpression(expr) {
        try {
            // Balance parentheses before evaluation
            expr = balanceParentheses(expr);

            // Handle implicit multiplication
            expr = expr.replace(/(\d+|[π\)])([\(π]|sin|cos|tan|asin|acos|atan|log|ln|sqrt|abs)/g, '$1*$2');
            expr = expr.replace(/(\d+)([π])/g, '$1*$2');

            // Replace mathematical constants
            expr = expr.replace(/π/g, 'Math.PI');
            expr = expr.replace(/e/g, 'Math.E');

            // Handle factorial
            expr = expr.replace(/(\d+)!/g, (match, n) => factorial(parseInt(n)));

            // Replace mathematical functions
            const angle = isRadianMode ? '' : '* Math.PI / 180';
            expr = expr.replace(/sin\(/g, `Math.sin(${angle}`);
            expr = expr.replace(/cos\(/g, `Math.cos(${angle}`);
            expr = expr.replace(/tan\(/g, `Math.tan(${angle}`);
            expr = expr.replace(/asin\(/g, `Math.asin(${angle}`);
            expr = expr.replace(/acos\(/g, `Math.acos(${angle}`);
            expr = expr.replace(/atan\(/g, `Math.atan(${angle}`);
            expr = expr.replace(/log/g, 'Math.log10');
            expr = expr.replace(/ln/g, 'Math.log');
            expr = expr.replace(/sqrt/g, 'Math.sqrt');
            expr = expr.replace(/abs/g, 'Math.abs');

            // Replace ^ with ** for exponentiation
            expr = expr.replace(/\^/g, '**');

            // Evaluate and format result
            const evaluated = Function('"use strict";return (' + expr + ')')();
            return Number.isFinite(evaluated) ? 
                   Number(evaluated.toPrecision(10)).toString() : 
                   'Error';
        } catch (error) {
            console.log('Evaluation error:', error, 'Expression:', expr);
            return 'Error';
        }
    }

    // Event handlers
    container.querySelector('.history-btn').addEventListener('click', () => {
        historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
    });

    container.querySelector('.clear-history-btn').addEventListener('click', () => {
        history = [];
        updateHistoryDisplay();
        showToast('History cleared');
    });

    historyList.addEventListener('click', (e) => {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            expression = historyItem.dataset.expr;
            result = evaluateExpression(expression);
            updateDisplay();
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            isRadianMode = btn.dataset.mode === 'rad';
            if (expression) {
                result = evaluateExpression(expression);
                updateDisplay();
            }
        });
    });

    keypad.addEventListener('click', (e) => {
        const button = e.target.closest('.btn');
        if (!button) return;

        const action = button.dataset.action;

        if (result === 'Error' && !['C', 'CE'].includes(action)) {
            return;
        }

        switch (action) {
            case 'C':
                expression = '';
                result = '0';
                lastResult = null;
                break;

            case 'CE':
                if (expression.length > 0) {
                    expression = expression.slice(0, -1);
                    result = expression ? evaluateExpression(expression) : '0';
                }
                break;

            case '=':
                if (expression) {
                    lastResult = result;
                    // Update expression with balanced parentheses
                    expression = balanceParentheses(expression);
                    result = evaluateExpression(expression);
                    addToHistory(expression, result);
                    if (result !== 'Error') {
                        expression = result;
                    }
                }
                break;

            case 'MC':
                memory = 0;
                showToast('Memory cleared');
                break;

            case 'MR':
                if (memory !== 0) {
                    expression = memory.toString();
                    result = expression;
                }
                break;

            case 'M+':
                if (result !== 'Error') {
                    memory += parseFloat(result);
                    showToast('Added to memory');
                }
                break;

            case 'M-':
                if (result !== 'Error') {
                    memory -= parseFloat(result);
                    showToast('Subtracted from memory');
                }
                break;

            case 'MS':
                if (result !== 'Error') {
                    memory = parseFloat(result);
                    showToast('Stored in memory');
                }
                break;

            case 'sin':
            case 'cos':
            case 'tan':
            case 'asin':
            case 'acos':
            case 'atan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'abs':
                expression += action + '(';
                break;

            case 'fact':
                if (result !== 'Error' && !isNaN(result)) {
                    expression += '!';
                }
                break;

            case 'pi':
                expression += 'π';
                break;

            case 'e':
                expression += 'e';
                break;

            default:
                expression += action;
                if (expression) {
                    const newResult = evaluateExpression(expression);
                    if (newResult !== 'Error') {
                        result = newResult;
                    }
                }
        }

        updateDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!container.closest('.tool-view').classList.contains('active')) return;

        const key = e.key;
        const validKeys = /[0-9.+\-*/%()=]|Enter|Backspace|Delete|c/i;
        
        if (validKeys.test(key)) {
            e.preventDefault();
            
            if (key === 'Enter') {
                // Handle Enter key the same way as '=' button
                if (expression) {
                    expression = balanceParentheses(expression);
                    result = evaluateExpression(expression);
                    addToHistory(expression, result);
                    if (result !== 'Error') {
                        expression = result;
                    }
                    updateDisplay();
                }
            } else if (key === 'Backspace' || key === 'Delete') {
                keypad.querySelector('[data-action="CE"]').click();
            } else if (key.toLowerCase() === 'c') {
                keypad.querySelector('[data-action="C"]').click();
            } else {
                const button = keypad.querySelector(`[data-action="${key}"]`);
                if (button) button.click();
            }
        }
    });

    // Initialize display
    updateDisplay();
} 