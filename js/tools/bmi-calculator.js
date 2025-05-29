// bmi-calculator.js
import { showToast } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('bmi-calculator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="bmi-weight">Weight (kg):</label>
            <input type="number" id="bmi-weight" placeholder="e.g., 70" min="0">
        </div>
        <div class="form-group">
            <label for="bmi-height">Height (cm):</label>
            <input type="number" id="bmi-height" placeholder="e.g., 175" min="0">
        </div>
        <button id="bmi-calculate-btn" class="btn">Calculate BMI</button>
        <div class="output-area" id="bmi-result" style="margin-top:1rem;">
            Your BMI will be displayed here.
        </div>
    `;

    const weightInput = document.getElementById('bmi-weight');
    const heightInput = document.getElementById('bmi-height');
    const calculateBtn = document.getElementById('bmi-calculate-btn');
    const resultDiv = document.getElementById('bmi-result');

    calculateBtn.addEventListener('click', () => {
        const weight = parseFloat(weightInput.value);
        const heightCm = parseFloat(heightInput.value);

        if (isNaN(weight) || weight <= 0 || isNaN(heightCm) || heightCm <= 0) {
            showToast('Please enter valid positive weight and height.', 'error');
            resultDiv.innerHTML = '<p>Please enter valid positive weight and height.</p>';
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        const bmiRounded = bmi.toFixed(2);

        let category = '', color = '';
        if (bmi < 18.5) { category = 'Underweight'; color = '#3498db';}
        else if (bmi < 24.9) { category = 'Normal weight'; color = '#2ecc71'; }
        else if (bmi < 29.9) { category = 'Overweight'; color = '#f1c40f'; }
        else { category = 'Obesity'; color = '#e74c3c'; }

        resultDiv.innerHTML = `
            <p><strong>Your BMI:</strong> <span style="font-size:1.2em; color:${color};">${bmiRounded}</span></p>
            <p><strong>Category:</strong> <span style="color:${color};">${category}</span></p>
        `;
    });
} 