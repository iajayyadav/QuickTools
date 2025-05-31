// Calorie Calculator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('calorie-calculator-content');
    if (!container) return;

    container.innerHTML = `
        <div class="calculator-container">
            <div class="input-section">
                <h3>Personal Information</h3>
                <div class="input-group">
                    <label for="age">Age</label>
                    <input type="number" id="age" placeholder="e.g., 25" min="15" max="120">
                </div>
                
                <div class="input-group">
                    <label>Gender</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="gender" value="male" checked>
                            Male
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="gender" value="female">
                            Female
                        </label>
                    </div>
                </div>

                <div class="input-group">
                    <label for="weight">Weight (kg)</label>
                    <input type="number" id="weight" placeholder="e.g., 70" min="30" max="300" step="0.1">
                </div>

                <div class="input-group">
                    <label for="height">Height (cm)</label>
                    <input type="number" id="height" placeholder="e.g., 170" min="100" max="250">
                </div>

                <div class="input-group">
                    <label for="activity">Activity Level</label>
                    <select id="activity">
                        <option value="1.2">Sedentary (little or no exercise)</option>
                        <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Extra active (very hard exercise & physical job)</option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="goal">Weight Goal</label>
                    <select id="goal">
                        <option value="maintain">Maintain weight</option>
                        <option value="lose">Lose weight</option>
                        <option value="gain">Gain weight</option>
                    </select>
                </div>
            </div>

            <div class="results-section">
                <h3>Daily Calorie Needs</h3>
                <div class="result-card">
                    <div class="result-item">
                        <span class="result-label">Basal Metabolic Rate (BMR)</span>
                        <span class="result-value" id="bmr">0 kcal</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Maintenance Calories</span>
                        <span class="result-value" id="maintenance">0 kcal</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Recommended Daily Calories</span>
                        <span class="result-value" id="recommended">0 kcal</span>
                    </div>
                </div>

                <div class="macros-section">
                    <h4>Recommended Macronutrients</h4>
                    <div class="macros-grid">
                        <div class="macro-item">
                            <span class="macro-label">Protein</span>
                            <span class="macro-value" id="protein">0g</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-label">Carbs</span>
                            <span class="macro-value" id="carbs">0g</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-label">Fat</span>
                            <span class="macro-value" id="fat">0g</span>
                        </div>
                    </div>
                </div>

                <div class="info-box">
                    <h4><i class="fas fa-info-circle"></i> How it works</h4>
                    <p>This calculator estimates your daily calorie needs based on:</p>
                    <ul>
                        <li>Basal Metabolic Rate (BMR)</li>
                        <li>Activity level</li>
                        <li>Weight goals</li>
                    </ul>
                    <p class="info-note">Note: These are estimates. Consult a healthcare professional for personalized advice.</p>
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

            .radio-group {
                display: flex;
                gap: 1.5rem;
            }

            .radio-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            input[type="number"], select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                transition: all 0.3s ease;
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

            .result-label {
                color: var(--text-color);
                font-weight: 500;
            }

            .result-value {
                color: var(--accent-color);
                font-weight: 600;
                font-size: 1.2rem;
            }

            .macros-section {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .macros-section h4 {
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .macros-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
            }

            .macro-item {
                text-align: center;
                padding: 1rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--border-color);
            }

            .macro-label {
                display: block;
                color: var(--text-color);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .macro-value {
                display: block;
                color: var(--accent-color);
                font-weight: 600;
                font-size: 1.1rem;
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

            .info-note {
                margin-top: 1rem;
                font-size: 0.9rem;
                color: var(--text-color);
                opacity: 0.8;
                font-style: italic;
            }
        </style>
    `;

    // Get all input elements
    const inputs = {
        age: document.getElementById('age'),
        weight: document.getElementById('weight'),
        height: document.getElementById('height'),
        activity: document.getElementById('activity'),
        goal: document.getElementById('goal')
    };

    // Get all result elements
    const results = {
        bmr: document.getElementById('bmr'),
        maintenance: document.getElementById('maintenance'),
        recommended: document.getElementById('recommended'),
        protein: document.getElementById('protein'),
        carbs: document.getElementById('carbs'),
        fat: document.getElementById('fat')
    };

    // Calculate BMR using Mifflin-St Jeor Equation
    function calculateBMR(weight, height, age, gender) {
        if (!weight || !height || !age) return 0;
        
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;
        
        return Math.round(bmr);
    }

    // Calculate maintenance calories
    function calculateMaintenance(bmr, activityLevel) {
        return Math.round(bmr * activityLevel);
    }

    // Calculate recommended calories based on goal
    function calculateRecommended(maintenance, goal) {
        switch(goal) {
            case 'lose':
                return Math.round(maintenance - 500); // 500 calorie deficit
            case 'gain':
                return Math.round(maintenance + 500); // 500 calorie surplus
            default:
                return maintenance;
        }
    }

    // Calculate macronutrients
    function calculateMacros(calories) {
        // Protein: 30%, Carbs: 40%, Fat: 30%
        const protein = Math.round((calories * 0.30) / 4); // 4 calories per gram of protein
        const carbs = Math.round((calories * 0.40) / 4);   // 4 calories per gram of carbs
        const fat = Math.round((calories * 0.30) / 9);     // 9 calories per gram of fat

        return { protein, carbs, fat };
    }

    // Update calculations
    function updateCalculations() {
        const age = parseFloat(inputs.age.value);
        const weight = parseFloat(inputs.weight.value);
        const height = parseFloat(inputs.height.value);
        const activity = parseFloat(inputs.activity.value);
        const goal = inputs.goal.value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        if (!age || !weight || !height) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Calculate values
        const bmr = calculateBMR(weight, height, age, gender);
        const maintenance = calculateMaintenance(bmr, activity);
        const recommended = calculateRecommended(maintenance, goal);
        const macros = calculateMacros(recommended);

        // Update display
        results.bmr.textContent = `${bmr.toLocaleString()} kcal`;
        results.maintenance.textContent = `${maintenance.toLocaleString()} kcal`;
        results.recommended.textContent = `${recommended.toLocaleString()} kcal`;
        results.protein.textContent = `${macros.protein}g`;
        results.carbs.textContent = `${macros.carbs}g`;
        results.fat.textContent = `${macros.fat}g`;
    }

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    // Add event listener to radio buttons
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', updateCalculations);
    });
} 