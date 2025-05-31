// Gratuity Calculator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('gratuity-calculator-content');
    if (!container) return;

    // Create a unique ID for scoped styling
    const scopeId = 'gratuity-' + Math.random().toString(36).substr(2, 9);
    container.setAttribute('data-scope', scopeId);

    container.innerHTML = `
        <div class="gratuity-calculator-container">
            <div class="calculator-section">
                <div class="input-group">
                    <label for="bill-amount">Bill Amount</label>
                    <div class="input-with-icon">
                        <i class="fas fa-dollar-sign"></i>
                        <input type="number" id="bill-amount" min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>

                <div class="tip-section">
                    <label>Tip Percentage</label>
                    <div class="tip-buttons">
                        <button class="tip-btn" data-tip="10">10%</button>
                        <button class="tip-btn" data-tip="15">15%</button>
                        <button class="tip-btn active" data-tip="20">20%</button>
                        <button class="tip-btn" data-tip="25">25%</button>
                        <div class="custom-tip-input">
                            <input type="number" id="custom-tip" min="0" max="100" placeholder="Custom %">
                        </div>
                    </div>
                </div>

                <div class="split-section">
                    <label>Split Between</label>
                    <div class="split-control">
                        <button class="split-btn" id="decrease-split">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span id="split-number">1</span>
                        <button class="split-btn" id="increase-split">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="round-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="round-up-toggle">
                        <span class="toggle-slider"></span>
                        Round up total
                    </label>
                </div>
            </div>

            <div class="results-section">
                <div class="result-item">
                    <span class="result-label">Tip Amount</span>
                    <span class="result-value" id="tip-amount">$0.00</span>
                    <span class="per-person" id="tip-per-person">($0.00 per person)</span>
                </div>

                <div class="result-item total">
                    <span class="result-label">Total Amount</span>
                    <span class="result-value" id="total-amount">$0.00</span>
                    <span class="per-person" id="total-per-person">($0.00 per person)</span>
                </div>
            </div>
        </div>

        <style>
            [data-scope="${scopeId}"] .gratuity-calculator-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            [data-scope="${scopeId}"] .calculator-section {
                margin-bottom: 2rem;
            }

            [data-scope="${scopeId}"] .input-group {
                margin-bottom: 1.5rem;
            }

            [data-scope="${scopeId}"] .input-with-icon {
                position: relative;
                display: flex;
                align-items: center;
            }

            [data-scope="${scopeId}"] .input-with-icon i {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-color);
                opacity: 0.7;
                font-size: 1rem;
                pointer-events: none;
                z-index: 1;
            }

            [data-scope="${scopeId}"] .input-with-icon input {
                width: 100%;
                padding: 0.75rem;
                padding-left: 2.5rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1.1rem;
                line-height: 1.5;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .input-with-icon input:focus {
                border-color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .input-with-icon input:focus + i {
                color: var(--accent-color);
                opacity: 1;
            }

            [data-scope="${scopeId}"] .tip-section {
                margin-bottom: 1.5rem;
            }

            [data-scope="${scopeId}"] .tip-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            [data-scope="${scopeId}"] .tip-btn {
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .tip-btn.active {
                background: var(--accent-color);
                color: white;
                border-color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .custom-tip-input {
                position: relative;
                display: flex;
                align-items: center;
            }

            [data-scope="${scopeId}"] .custom-tip-input input {
                width: 100%;
                padding: 0.75rem;
                padding-right: 2rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .custom-tip-input span {
                position: absolute;
                right: 1rem;
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .split-section {
                margin-bottom: 1.5rem;
            }

            [data-scope="${scopeId}"] .split-control {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.5rem;
            }

            [data-scope="${scopeId}"] .split-btn {
                padding: 0.5rem 1rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .split-btn:hover {
                background: var(--accent-color);
                color: white;
                border-color: var(--accent-color);
            }

            [data-scope="${scopeId}"] #split-number {
                font-size: 1.2rem;
                font-weight: bold;
                min-width: 2rem;
                text-align: center;
            }

            [data-scope="${scopeId}"] .round-section {
                margin-bottom: 1.5rem;
            }

            [data-scope="${scopeId}"] .toggle-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            [data-scope="${scopeId}"] .toggle-slider {
                position: relative;
                display: inline-block;
                width: 3rem;
                height: 1.5rem;
                background: var(--border-color);
                border-radius: 1rem;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .toggle-slider:before {
                content: '';
                position: absolute;
                width: 1.2rem;
                height: 1.2rem;
                left: 0.15rem;
                top: 0.15rem;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] input[type="checkbox"] {
                display: none;
            }

            [data-scope="${scopeId}"] input[type="checkbox"]:checked + .toggle-slider {
                background: var(--accent-color);
            }

            [data-scope="${scopeId}"] input[type="checkbox"]:checked + .toggle-slider:before {
                transform: translateX(1.5rem);
            }

            [data-scope="${scopeId}"] .results-section {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            [data-scope="${scopeId}"] .result-item {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 1rem 0;
            }

            [data-scope="${scopeId}"] .result-item:not(:last-child) {
                border-bottom: 1px solid var(--border-color);
            }

            [data-scope="${scopeId}"] .result-label {
                color: var(--text-color-light);
                font-size: 0.9rem;
            }

            [data-scope="${scopeId}"] .result-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .per-person {
                font-size: 0.9rem;
                color: var(--text-color-light);
            }

            [data-scope="${scopeId}"] .total .result-value {
                color: var(--accent-color);
            }

            @media (max-width: 768px) {
                [data-scope="${scopeId}"] .gratuity-calculator-container {
                    padding: 1rem;
                }

                [data-scope="${scopeId}"] .tip-buttons {
                    grid-template-columns: repeat(2, 1fr);
                }

                [data-scope="${scopeId}"] .result-value {
                    font-size: 1.2rem;
                }
            }
        </style>
    `;

    // Get DOM elements
    const elements = {
        billAmount: document.getElementById('bill-amount'),
        tipButtons: document.querySelectorAll('.tip-btn'),
        customTip: document.getElementById('custom-tip'),
        splitNumber: document.getElementById('split-number'),
        decreaseSplit: document.getElementById('decrease-split'),
        increaseSplit: document.getElementById('increase-split'),
        roundUpToggle: document.getElementById('round-up-toggle'),
        tipAmount: document.getElementById('tip-amount'),
        tipPerPerson: document.getElementById('tip-per-person'),
        totalAmount: document.getElementById('total-amount'),
        totalPerPerson: document.getElementById('total-per-person')
    };

    let currentTipPercentage = 20;
    let currentSplitNumber = 1;

    // Calculate and update results
    function calculateResults() {
        const billAmount = parseFloat(elements.billAmount.value) || 0;
        const tipPercentage = currentTipPercentage;
        const splitNumber = currentSplitNumber;
        const roundUp = elements.roundUpToggle.checked;

        let tipAmount = (billAmount * tipPercentage) / 100;
        let totalAmount = billAmount + tipAmount;

        if (roundUp) {
            totalAmount = Math.ceil(totalAmount);
            tipAmount = totalAmount - billAmount;
        }

        const tipPerPerson = tipAmount / splitNumber;
        const totalPerPerson = totalAmount / splitNumber;

        // Update display
        elements.tipAmount.textContent = `$${tipAmount.toFixed(2)}`;
        elements.tipPerPerson.textContent = splitNumber > 1 ? 
            `($${tipPerPerson.toFixed(2)} per person)` : '';

        elements.totalAmount.textContent = `$${totalAmount.toFixed(2)}`;
        elements.totalPerPerson.textContent = splitNumber > 1 ? 
            `($${totalPerPerson.toFixed(2)} per person)` : '';
    }

    // Event Listeners
    elements.billAmount.addEventListener('input', calculateResults);

    elements.tipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tipButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTipPercentage = parseFloat(btn.dataset.tip);
            elements.customTip.value = '';
            calculateResults();
        });
    });

    elements.customTip.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0) {
            elements.tipButtons.forEach(btn => btn.classList.remove('active'));
            currentTipPercentage = value;
            calculateResults();
        }
    });

    elements.decreaseSplit.addEventListener('click', () => {
        if (currentSplitNumber > 1) {
            currentSplitNumber--;
            elements.splitNumber.textContent = currentSplitNumber;
            calculateResults();
        }
    });

    elements.increaseSplit.addEventListener('click', () => {
        currentSplitNumber++;
        elements.splitNumber.textContent = currentSplitNumber;
        calculateResults();
    });

    elements.roundUpToggle.addEventListener('change', calculateResults);
} 