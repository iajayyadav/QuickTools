// sip-calculator.js
import { showToast } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('sip-calculator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="sip-monthly">Monthly Investment:</label>
            <input type="number" id="sip-monthly" placeholder="e.g., 5000" min="0">
        </div>
        <div class="form-group">
            <label for="sip-rate">Expected Annual Return Rate (%):</label>
            <input type="number" id="sip-rate" placeholder="e.g., 12" min="0" step="0.01">
        </div>
        <div class="form-group">
            <label for="sip-period">Investment Period (Years):</label>
            <input type="number" id="sip-period" placeholder="e.g., 10" min="0">
        </div>
        <button id="sip-calculate-btn" class="btn">Calculate Future Value</button>
        <div class="output-area" id="sip-result" style="margin-top:1rem;">
            Results will be displayed here.
        </div>
    `;

    const monthlyInput = document.getElementById('sip-monthly');
    const rateInput = document.getElementById('sip-rate');
    const periodInput = document.getElementById('sip-period');
    const calculateBtn = document.getElementById('sip-calculate-btn');
    const resultDiv = document.getElementById('sip-result');
    
    calculateBtn.addEventListener('click', () => {
        const M = parseFloat(monthlyInput.value); 
        const annualReturnRate = parseFloat(rateInput.value);
        const T = parseFloat(periodInput.value); 

        if (isNaN(M) || M <= 0 || isNaN(annualReturnRate) || annualReturnRate < 0 || isNaN(T) || T <= 0) {
            showToast('Please enter valid SIP details.', 'error');
            resultDiv.innerHTML = '<p>Invalid input. Ensure all fields are positive numbers (rate can be 0).</p>';
            return;
        }

        const i = (annualReturnRate / 100) / 12; // Monthly interest rate
        const n = T * 12; // Number of months

        let fv;
        if (i === 0) { // If rate is 0
            fv = M * n;
        } else {
            fv = M * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        }
        
        const totalInvested = M * n;
        const wealthGained = fv - totalInvested;

        resultDiv.innerHTML = `
            <p><strong>Total Invested Amount:</strong> ${totalInvested.toFixed(2)}</p>
            <p><strong>Estimated Returns (Wealth Gained):</strong> ${wealthGained.toFixed(2)}</p>
            <p><strong>Future Value (Maturity Amount):</strong> ${fv.toFixed(2)}</p>
        `;
    });
} 