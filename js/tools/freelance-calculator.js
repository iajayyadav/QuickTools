// Freelance Calculator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('freelance-calculator-content');
    if (!container) return;

    container.innerHTML = `
        <div class="calculator-container">
            <div class="input-section">
                <h3>Income Goals</h3>
                <div class="input-group">
                    <label for="monthlyGoal">Monthly Income Goal</label>
                    <div class="input-wrapper">
                       
                        <input type="number" id="monthlyGoal" placeholder="e.g., 5000" min="0" step="100">
                    </div>
                </div>
                
                <div class="input-group">
                    <label for="workingDays">Working Days per Month</label>
                    <input type="number" id="workingDays" placeholder="e.g., 22" min="1" max="31" value="22">
                </div>
                
                <div class="input-group">
                    <label for="workingHours">Working Hours per Day</label>
                    <input type="number" id="workingHours" placeholder="e.g., 8" min="1" max="24" value="8">
                </div>

                <div class="input-group">
                    <label for="vacationDays">Vacation Days per Year</label>
                    <input type="number" id="vacationDays" placeholder="e.g., 15" min="0" max="365" value="15">
                </div>

                <div class="input-group">
                    <label for="expenses">Monthly Business Expenses ($)</label>
                    <div class="input-wrapper">
                       
                        <input type="number" id="expenses" placeholder="e.g., 500" min="0" step="50" value="0">
                    </div>
                </div>
            </div>

            <div class="results-section">
                <h3>Your Rates</h3>
                <div class="result-card">
                    <div class="result-item">
                        <span class="result-label">Required Daily Rate</span>
                        <span class="result-value" id="dailyRate">$0.00</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Required Hourly Rate</span>
                        <span class="result-value" id="hourlyRate">$0.00</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Annual Income (Before Tax)</span>
                        <span class="result-value" id="annualIncome">$0.00</span>
                    </div>
                </div>

                <div class="info-box">
                    <h4><i class="fas fa-info-circle"></i> How it works</h4>
                    <p>This calculator helps you determine your ideal freelance rates based on your income goals and working schedule. It accounts for:</p>
                    <ul>
                        <li>Your desired monthly income</li>
                        <li>Working days and hours</li>
                        <li>Vacation time</li>
                        <li>Business expenses</li>
                    </ul>
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

            input {
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

            input:focus {
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
                margin-top: 0.5rem;
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
        </style>
    `;

    // Get all input elements
    const inputs = {
        monthlyGoal: document.getElementById('monthlyGoal'),
        workingDays: document.getElementById('workingDays'),
        workingHours: document.getElementById('workingHours'),
        vacationDays: document.getElementById('vacationDays'),
        expenses: document.getElementById('expenses')
    };

    // Get all result elements
    const results = {
        dailyRate: document.getElementById('dailyRate'),
        hourlyRate: document.getElementById('hourlyRate'),
        annualIncome: document.getElementById('annualIncome')
    };

    // Calculate rates function
    function calculateRates() {
        // Get input values
        const monthlyGoal = parseFloat(inputs.monthlyGoal.value) || 0;
        const workingDays = parseFloat(inputs.workingDays.value) || 22;
        const workingHours = parseFloat(inputs.workingHours.value) || 8;
        const vacationDays = parseFloat(inputs.vacationDays.value) || 15;
        const expenses = parseFloat(inputs.expenses.value) || 0;

        // Calculate working days per year (accounting for vacation)
        const workingDaysPerYear = (workingDays * 12) - vacationDays;
        
        // Calculate required annual income (including expenses)
        const requiredAnnualIncome = (monthlyGoal * 12) + (expenses * 12);
        
        // Calculate daily and hourly rates
        const dailyRate = requiredAnnualIncome / workingDaysPerYear;
        const hourlyRate = dailyRate / workingHours;

        // Update results
        results.dailyRate.textContent = formatCurrency(dailyRate);
        results.hourlyRate.textContent = formatCurrency(hourlyRate);
        results.annualIncome.textContent = formatCurrency(requiredAnnualIncome);
    }

    // Format currency function
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateRates);
    });

    // Initial calculation
    calculateRates();
} 