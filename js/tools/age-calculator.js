import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('age-calculator-content');
    if (!container) return;

    container.innerHTML = `
        <div class="age-calculator-container">
            <div class="calculator-section">
                <div class="date-inputs">
                    <div class="birth-date">
                        <h3><i class="fas fa-birthday-cake"></i> Birth Date</h3>
                        <div class="date-picker">
                            <input type="date" id="birthDate" max="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <div class="calculation-date">
                        <h3><i class="fas fa-calendar-alt"></i> Calculation Date</h3>
                        <div class="date-picker">
                            <input type="date" id="calculationDate" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                </div>

                <div class="results-section">
                    <div class="main-age">
                        <h3>Your Age</h3>
                        <div class="age-display" id="mainAge">
                            <span class="years">-- years</span>
                            <span class="months">-- months</span>
                            <span class="days">-- days</span>
                        </div>
                    </div>

                    <div class="detailed-breakdown">
                        <h3>Detailed Breakdown</h3>
                        <div class="breakdown-grid">
                            <div class="breakdown-item">
                                <span class="label">Total Years</span>
                                <span class="value" id="totalYears">--</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="label">Total Months</span>
                                <span class="value" id="totalMonths">--</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="label">Total Weeks</span>
                                <span class="value" id="totalWeeks">--</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="label">Total Days</span>
                                <span class="value" id="totalDays">--</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="label">Total Hours</span>
                                <span class="value" id="totalHours">--</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="label">Next Birthday</span>
                                <span class="value" id="nextBirthday">--</span>
                            </div>
                        </div>
                    </div>

                    <div class="zodiac-info">
                        <h3>Zodiac Signs</h3>
                        <div class="zodiac-grid">
                            <div class="zodiac-item">
                                <span class="label">Western Zodiac</span>
                                <span class="value" id="westernZodiac">--</span>
                            </div>
                            <div class="zodiac-item">
                                <span class="label">Chinese Zodiac</span>
                                <span class="value" id="chineseZodiac">--</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-section">
                <h3><i class="fas fa-info-circle"></i> About Age Calculation</h3>
                <ul class="info-list">
                    <li>Calculations are based on the Gregorian calendar</li>
                    <li>Leap years are automatically accounted for</li>
                    <li>Time zones are based on your local system time</li>
                    <li>All calculations are done in real-time</li>
                </ul>
        </div>
        </div>

        <style>
            .age-calculator-container {
                max-width: 800px;
                margin: 0 auto;
                display: grid;
                gap: 2rem;
            }

            .calculator-section {
                background: var(--tool-card-bg);
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
                box-shadow: var(--soft-box-shadow);
            }

            .date-inputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }

            .birth-date, .calculation-date {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .birth-date h3, .calculation-date h3 {
                color: var(--text-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.1rem;
            }

            .date-picker input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .date-picker input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            .results-section {
                display: grid;
                gap: 2rem;
            }

            .main-age {
                text-align: center;
                padding: 1.5rem;
                background: var(--bg-color);
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .main-age h3 {
                color: var(--accent-color);
                margin-bottom: 1rem;
            }

            .age-display {
                display: flex;
                justify-content: center;
                gap: 2rem;
                font-size: 1.2rem;
                color: var(--text-color);
            }

            .age-display span {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }

            .breakdown-grid, .zodiac-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .breakdown-item, .zodiac-item {
                background: var(--bg-color);
                padding: 1rem;
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .breakdown-item .label, .zodiac-item .label {
                color: var(--text-color);
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .breakdown-item .value, .zodiac-item .value {
                color: var(--text-color);
                font-size: 1.1rem;
                font-weight: 500;
            }

            .info-section {
                background: var(--tool-card-bg);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
            }

            .info-section h3 {
                color: var(--accent-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .info-list {
                list-style: none;
                padding: 0;
            }

            .info-list li {
                color: var(--text-color);
                margin-bottom: 0.75rem;
                padding-left: 1.5rem;
                position: relative;
            }

            .info-list li::before {
                content: "•";
                color: var(--accent-color);
                position: absolute;
                left: 0;
            }

            @media (max-width: 768px) {
                .date-inputs {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .age-display {
                    flex-direction: column;
                    gap: 1rem;
                }

                .calculator-section {
                    padding: 1.5rem;
                }
            }
        </style>
    `;

    // Get DOM elements
    const birthDateInput = document.getElementById('birthDate');
    const calculationDateInput = document.getElementById('calculationDate');
    const mainAge = document.getElementById('mainAge');
    const totalYears = document.getElementById('totalYears');
    const totalMonths = document.getElementById('totalMonths');
    const totalWeeks = document.getElementById('totalWeeks');
    const totalDays = document.getElementById('totalDays');
    const totalHours = document.getElementById('totalHours');
    const nextBirthday = document.getElementById('nextBirthday');
    const westernZodiac = document.getElementById('westernZodiac');
    const chineseZodiac = document.getElementById('chineseZodiac');

    // Zodiac sign data
    const westernZodiacSigns = [
        { name: 'Capricorn', start: [1, 1], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
        { name: 'Capricorn', start: [12, 22], end: [12, 31] }
    ];

    const chineseZodiacSigns = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];

    // Calculate age function
    function calculateAge() {
        const birthDate = new Date(birthDateInput.value);
        const calculationDate = new Date(calculationDateInput.value);

        if (!birthDateInput.value || !calculationDateInput.value) {
            showToast('Please select both dates', 'error');
            return;
        }

        if (birthDate > calculationDate) {
            showToast('Birth date cannot be in the future', 'error');
            return;
        }

        // Calculate years, months, and days
        let years = calculationDate.getFullYear() - birthDate.getFullYear();
        let months = calculationDate.getMonth() - birthDate.getMonth();
        let days = calculationDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(calculationDate.getFullYear(), calculationDate.getMonth() - 1, birthDate.getDate());
            days = Math.floor((calculationDate - prevMonth) / (1000 * 60 * 60 * 24));
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total values
        const totalDaysValue = Math.floor((calculationDate - birthDate) / (1000 * 60 * 60 * 24));
        const totalMonthsValue = years * 12 + months;
        const totalWeeksValue = Math.floor(totalDaysValue / 7);
        const totalHoursValue = Math.floor((calculationDate - birthDate) / (1000 * 60 * 60));

        // Calculate next birthday
        const nextBirthdayDate = new Date(calculationDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthdayDate < calculationDate) {
            nextBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil((nextBirthdayDate - calculationDate) / (1000 * 60 * 60 * 24));

        // Update main age display
        mainAge.innerHTML = `
            <span class="years">${years} years</span>
            <span class="months">${months} months</span>
            <span class="days">${days} days</span>
        `;

        // Update detailed breakdown
        totalYears.textContent = years;
        totalMonths.textContent = totalMonthsValue;
        totalWeeks.textContent = totalWeeksValue;
        totalDays.textContent = totalDaysValue;
        totalHours.textContent = totalHoursValue;
        nextBirthday.textContent = `${daysUntilBirthday} days`;

        // Calculate Western Zodiac
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        const zodiacSign = westernZodiacSigns.find(sign => {
            if (sign.start[0] === birthMonth && birthDay >= sign.start[1]) return true;
            if (sign.end[0] === birthMonth && birthDay <= sign.end[1]) return true;
            return false;
        });
        westernZodiac.textContent = zodiacSign ? zodiacSign.name : '--';

        // Calculate Chinese Zodiac
        const chineseZodiacIndex = (birthDate.getFullYear() - 1900) % 12;
        chineseZodiac.textContent = chineseZodiacSigns[chineseZodiacIndex];
    }

    // Event listeners
    birthDateInput.addEventListener('change', calculateAge);
    calculationDateInput.addEventListener('change', calculateAge);

    // Calculate initial age if birth date is set
    if (birthDateInput.value) {
        calculateAge();
    }
} 