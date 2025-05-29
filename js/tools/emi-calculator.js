import { showToast } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('emi-calculator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="emi-principal">Loan Amount (P):</label>
            <input type="number" id="emi-principal" placeholder="e.g., 100000" min="0">
        </div>
        <div class="form-group">
            <label for="emi-rate">Annual Interest Rate (% R):</label>
            <input type="number" id="emi-rate" placeholder="e.g., 10" min="0" step="0.01">
        </div>
        <div class="form-group">
            <label for="emi-tenure">Loan Tenure (Years T):</label>
            <input type="number" id="emi-tenure" placeholder="e.g., 5" min="0">
        </div>
        <button id="emi-calculate-btn" class="btn">Calculate EMI</button>
        <div class="output-area" id="emi-result" style="margin-top:1rem;">
            Results will be displayed here.
        </div>
    `;

    const principalInput = document.getElementById('emi-principal');
    const rateInput = document.getElementById('emi-rate');
    const tenureInput = document.getElementById('emi-tenure');
    const calculateBtn = document.getElementById('emi-calculate-btn');
    const resultDiv = document.getElementById('emi-result');

    calculateBtn.addEventListener('click', () => {
        const P = parseFloat(principalInput.value);
        const annualRate = parseFloat(rateInput.value);
        const tenureYears = parseFloat(tenureInput.value);

        if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(tenureYears) || tenureYears <= 0) {
            showToast('Please enter valid loan details.', 'error');
            resultDiv.innerHTML = '<p>Invalid input. Ensure all fields are positive numbers.</p>';
            return;
        }

        const r = (annualRate / 12) / 100; // Monthly interest rate
        const n = tenureYears * 12; // Number of months
        
        if (r === 0) { // If interest rate is 0
            const emi = P / n;
            resultDiv.innerHTML = `
                <p><strong>Monthly EMI:</strong> ${emi.toFixed(2)}</p>
                <p><strong>Total Interest Payable:</strong> 0.00</p>
                <p><strong>Total Payment (Principal + Interest):</strong> ${P.toFixed(2)}</p>
            `;
            return;
        }

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        resultDiv.innerHTML = `
            <p><strong>Monthly EMI:</strong> ${emi.toFixed(2)}</p>
            <p><strong>Total Interest Payable:</strong> ${totalInterest.toFixed(2)}</p>
            <p><strong>Total Payment (Principal + Interest):</strong> ${totalPayment.toFixed(2)}</p>
        `;
    });
} 