// GST Calculator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('gst-calculator-content');
    if (!container) return;

    container.innerHTML = `
        <div class="calculator-container">
            <div class="input-section">
                <h3>GST Calculator</h3>
                <div class="input-group">
                    <label for="amount">Original Amount</label>
                    <div class="input-wrapper">
                        <span class="currency-symbol">₹</span>
                        <input type="number" id="amount" placeholder="e.g., 1000" min="0" step="0.01">
                    </div>
                </div>

                <div class="input-group">
                    <label for="gst-rate">GST Rate (%)</label>
                    <select id="gst-rate">
                        <option value="0">0% (GST exempt)</option>
                        <option value="3">3% (Special rate)</option>
                        <option value="5">5% (Basic necessities)</option>
                        <option value="12">12% (Standard rate)</option>
                        <option value="18" selected>18% (Standard rate)</option>
                        <option value="28">28% (Luxury items)</option>
                        <option value="custom">Custom rate</option>
                    </select>
                </div>

                <div class="input-group" id="custom-rate-group" style="display: none;">
                    <label for="custom-rate">Custom GST Rate (%)</label>
                    <input type="number" id="custom-rate" placeholder="Enter custom rate" min="0" max="100" step="0.1">
                </div>

                <div class="input-group">
                    <label for="calculation-type">Calculation Type</label>
                    <select id="calculation-type">
                        <option value="exclusive">GST Exclusive (Add GST to amount)</option>
                        <option value="inclusive">GST Inclusive (Extract GST from amount)</option>
                    </select>
                </div>
            </div>

            <div class="results-section">
                <h3>Calculation Results</h3>
                <div class="result-card">
                    <div class="result-item">
                        <span class="result-label">Original Amount</span>
                        <span class="result-value" id="original-amount">₹0.00</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">CGST Amount</span>
                        <span class="result-value" id="cgst-amount">₹0.00</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">SGST Amount</span>
                        <span class="result-value" id="sgst-amount">₹0.00</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total GST Amount</span>
                        <span class="result-value" id="total-gst">₹0.00</span>
                    </div>
                    <div class="result-item total-amount">
                        <span class="result-label">Final Amount</span>
                        <span class="result-value" id="final-amount">₹0.00</span>
                    </div>
                </div>

                <div class="info-box">
                    <h4><i class="fas fa-info-circle"></i> About GST Calculation</h4>
                    <p>This calculator helps you:</p>
                    <ul>
                        <li>Calculate GST for different tax rates</li>
                        <li>Split GST into CGST and SGST components</li>
                        <li>Calculate inclusive and exclusive GST</li>
                    </ul>
                    <div class="calculation-note" id="calculation-note"></div>
                </div>
            </div>
        </div>

        <style>
            .calculator-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            @media (max-width: 768px) {
                .calculator-container {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
            }

            .input-section, .results-section {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .input-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .input-group label {
                color: var(--text-color);
                font-weight: 500;
            }

            .input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .currency-symbol {
                position: absolute;
                left: 1rem;
                color: var(--text-color);
                opacity: 0.7;
            }

            input[type="number"], select {
                width: 100%;
                padding: 0.75rem;
                padding-left: 2rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            select {
                padding-left: 0.75rem;
            }

            input[type="number"]:focus, select:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            .result-card {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .result-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                border-bottom: 1px solid var(--border-color);
            }

            .result-item:last-child {
                border-bottom: none;
            }

            .result-item.total-amount {
                margin-top: 0.5rem;
                padding-top: 1.5rem;
                border-top: 2px solid var(--accent-color);
            }

            .result-label {
                color: var(--text-color);
                font-weight: 500;
            }

            .result-value {
                color: var(--accent-color);
                font-weight: 600;
                font-size: 1.2rem;
            }

            .info-box {
                margin-top: 1.5rem;
                padding: 1.5rem;
                background: var(--bg-color);
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .info-box h4 {
                color: var(--accent-color);
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .info-box ul {
                list-style: none;
                padding-left: 1.5rem;
                margin: 0.5rem 0;
            }

            .info-box ul li {
                margin-bottom: 0.5rem;
                position: relative;
            }

            .info-box ul li::before {
                content: "•";
                color: var(--accent-color);
                position: absolute;
                left: -1.5rem;
            }

            .calculation-note {
                margin-top: 1rem;
                padding: 1rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                font-size: 0.9rem;
                color: var(--text-color);
                opacity: 0.9;
            }
        </style>
    `;

    // Get all input elements
    const inputs = {
        amount: document.getElementById('amount'),
        gstRate: document.getElementById('gst-rate'),
        customRate: document.getElementById('custom-rate'),
        calculationType: document.getElementById('calculation-type')
    };

    // Get all result elements
    const results = {
        originalAmount: document.getElementById('original-amount'),
        cgstAmount: document.getElementById('cgst-amount'),
        sgstAmount: document.getElementById('sgst-amount'),
        totalGst: document.getElementById('total-gst'),
        finalAmount: document.getElementById('final-amount'),
        calculationNote: document.getElementById('calculation-note')
    };

    const customRateGroup = document.getElementById('custom-rate-group');

    // Format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Calculate GST
    function calculateGST() {
        const amount = parseFloat(inputs.amount.value) || 0;
        let gstRate = inputs.gstRate.value === 'custom' 
            ? parseFloat(inputs.customRate.value) 
            : parseFloat(inputs.gstRate.value);
        const isExclusive = inputs.calculationType.value === 'exclusive';

        if (isNaN(gstRate) || gstRate < 0 || gstRate > 100) {
            showToast('Please enter a valid GST rate between 0 and 100', 'error');
            return;
        }

        let originalAmount, gstAmount, finalAmount;

        if (isExclusive) {
            originalAmount = amount;
            gstAmount = (originalAmount * gstRate) / 100;
            finalAmount = originalAmount + gstAmount;
            
            results.calculationNote.innerHTML = `
                <strong>Calculation Method:</strong><br>
                GST Amount = Original Amount × GST Rate<br>
                ${formatCurrency(gstAmount)} = ${formatCurrency(originalAmount)} × ${gstRate}%
            `;
        } else {
            finalAmount = amount;
            originalAmount = (finalAmount * 100) / (100 + gstRate);
            gstAmount = finalAmount - originalAmount;
            
            results.calculationNote.innerHTML = `
                <strong>Calculation Method:</strong><br>
                Original Amount = Final Amount × (100 ÷ (100 + GST Rate))<br>
                ${formatCurrency(originalAmount)} = ${formatCurrency(finalAmount)} × (100 ÷ ${100 + gstRate})
            `;
        }

        const cgstAmount = gstAmount / 2;
        const sgstAmount = gstAmount / 2;

        // Update results
        results.originalAmount.textContent = formatCurrency(originalAmount);
        results.cgstAmount.textContent = formatCurrency(cgstAmount);
        results.sgstAmount.textContent = formatCurrency(sgstAmount);
        results.totalGst.textContent = formatCurrency(gstAmount);
        results.finalAmount.textContent = formatCurrency(finalAmount);
    }

    // Event listeners
    inputs.gstRate.addEventListener('change', () => {
        customRateGroup.style.display = inputs.gstRate.value === 'custom' ? 'block' : 'none';
        calculateGST();
    });

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateGST);
    });

    // Initial calculation
    calculateGST();
} 