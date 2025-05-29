import { showToast } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('age-calculator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="ac-dob">Date of Birth:</label>
            <input type="date" id="ac-dob" max="${new Date().toISOString().split("T")[0]}">
        </div>
        <button id="ac-calculate-btn" class="btn">Calculate Age</button>
        <div class="output-area" id="ac-result" style="margin-top:1rem;">
            Your age will be displayed here.
        </div>
    `;

    const dobInput = document.getElementById('ac-dob');
    const calculateBtn = document.getElementById('ac-calculate-btn');
    const resultDiv = document.getElementById('ac-result');

    calculateBtn.addEventListener('click', () => {
        const dobString = dobInput.value;
        if (!dobString) {
            showToast('Please enter your date of birth.', 'error');
            resultDiv.innerHTML = 'Please enter your date of birth.';
            return;
        }

        const dob = new Date(dobString);
        const today = new Date();

        if (dob > today) {
            showToast('Date of birth cannot be in the future.', 'error');
            resultDiv.innerHTML = 'Date of birth cannot be in the future.';
            return;
        }

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); 
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        
        resultDiv.innerHTML = `
            <p><strong>Age:</strong> ${years} years, ${months} months, and ${days} days</p>
        `;
    });
} 