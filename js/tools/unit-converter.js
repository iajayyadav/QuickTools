export function init() {
    const contentDiv = document.getElementById('unit-converter-content');
    if (!contentDiv) return;

    const styles = {
        container: `
            background: var(--tool-card-bg);
            padding: 2rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--soft-box-shadow);
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
        `,
        header: `
            color: var(--text-color);
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            text-align: center;
        `,
        grid: `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        `,
        card: `
            background: rgba(0, 184, 148, 0.05);
            padding: 1.5rem;
            border-radius: var(--border-radius-lg);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `,
        select: `
            width: 100%;
            padding: 0.8rem;
            border: 1px solid var(--accent-color);
            border-radius: var(--border-radius-lg);
            background: var(--tool-card-bg);
            color: var(--text-color);
            font-size: 1em;
            cursor: pointer;
        `,
        input: `
            width: 100%;
            padding: 0.8rem;
            border: 1px solid var(--accent-color);
            border-radius: var(--border-radius-lg);
            background: var(--tool-card-bg);
            color: var(--text-color);
            font-size: 1em;
            margin-top: 0.5rem;
        `,
        label: `
            color: var(--text-color);
            font-size: 1em;
            margin-bottom: 0.5rem;
        `,
        result: `
            font-family: monospace;
            font-size: 1.1em;
            color: var(--accent-color);
            padding: 1rem;
            background: var(--tool-card-bg);
            border-radius: var(--border-radius-lg);
            text-align: center;
            border: 1px dashed var(--accent-color);
        `
    };

    const unitTypes = {
        length: {
            name: 'Length',
            units: {
                meters: { name: 'Meters (m)', factor: 1 },
                kilometers: { name: 'Kilometers (km)', factor: 1000 },
                centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
                millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
                inches: { name: 'Inches (in)', factor: 0.0254 },
                feet: { name: 'Feet (ft)', factor: 0.3048 },
                yards: { name: 'Yards (yd)', factor: 0.9144 },
                miles: { name: 'Miles (mi)', factor: 1609.344 }
            }
        },
        weight: {
            name: 'Weight',
            units: {
                kilograms: { name: 'Kilograms (kg)', factor: 1 },
                grams: { name: 'Grams (g)', factor: 0.001 },
                milligrams: { name: 'Milligrams (mg)', factor: 0.000001 },
                pounds: { name: 'Pounds (lb)', factor: 0.45359237 },
                ounces: { name: 'Ounces (oz)', factor: 0.028349523125 }
            }
        },
        temperature: {
            name: 'Temperature',
            units: {
                celsius: { name: 'Celsius (°C)', factor: 'special' },
                fahrenheit: { name: 'Fahrenheit (°F)', factor: 'special' },
                kelvin: { name: 'Kelvin (K)', factor: 'special' }
            }
        },
        volume: {
            name: 'Volume',
            units: {
                liters: { name: 'Liters (L)', factor: 1 },
                milliliters: { name: 'Milliliters (mL)', factor: 0.001 },
                cubicMeters: { name: 'Cubic Meters (m³)', factor: 1000 },
                gallons: { name: 'Gallons (gal)', factor: 3.78541 },
                quarts: { name: 'Quarts (qt)', factor: 0.946353 },
                cups: { name: 'Cups (cup)', factor: 0.236588 }
            }
        }
    };

    contentDiv.innerHTML = `
        <div style="${styles.container}">
            <h2 style="${styles.header}">Unit Converter</h2>
            <div style="${styles.grid}">
                <div style="${styles.card}">
                    <label style="${styles.label}">Unit Type</label>
                    <select id="unit-type" style="${styles.select}">
                        ${Object.entries(unitTypes).map(([key, type]) => 
                            `<option value="${key}">${type.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="${styles.card}">
                    <div>
                        <label style="${styles.label}">From</label>
                        <select id="from-unit" style="${styles.select}"></select>
                        <input type="number" id="from-value" placeholder="Enter value" style="${styles.input}">
                    </div>
                </div>
                <div style="${styles.card}">
                    <div>
                        <label style="${styles.label}">To</label>
                        <select id="to-unit" style="${styles.select}"></select>
                        <div id="result" style="${styles.result}">0</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const unitTypeSelect = document.getElementById('unit-type');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const fromValueInput = document.getElementById('from-value');
    const resultDiv = document.getElementById('result');

    function updateUnitSelects(unitType) {
        const units = unitTypes[unitType].units;
        const unitOptions = Object.entries(units)
            .map(([key, unit]) => `<option value="${key}">${unit.name}</option>`)
            .join('');
        
        fromUnitSelect.innerHTML = unitOptions;
        toUnitSelect.innerHTML = unitOptions;
    }

    function convertTemperature(value, from, to) {
        let celsius;
        // Convert to Celsius first
        switch(from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch(to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    function convert() {
        const unitType = unitTypeSelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const value = parseFloat(fromValueInput.value);

        if (isNaN(value)) {
            resultDiv.textContent = '0';
            return;
        }

        let result;
        if (unitType === 'temperature') {
            result = convertTemperature(value, fromUnit, toUnit);
        } else {
            const fromFactor = unitTypes[unitType].units[fromUnit].factor;
            const toFactor = unitTypes[unitType].units[toUnit].factor;
            result = (value * fromFactor) / toFactor;
        }

        resultDiv.textContent = result.toLocaleString(undefined, {
            maximumFractionDigits: 6,
            minimumFractionDigits: 0
        });
    }

    // Event listeners
    unitTypeSelect.addEventListener('change', () => {
        updateUnitSelects(unitTypeSelect.value);
        convert();
    });

    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    fromValueInput.addEventListener('input', convert);

    // Initialize unit selects
    updateUnitSelects(unitTypeSelect.value);
} 