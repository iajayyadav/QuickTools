export function init() {
    const contentDiv = document.getElementById('timer-stopwatch-content');
    if (!contentDiv) return;

    const styles = {
        container: `
            background: var(--tool-card-bg);
            padding: 2rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--soft-box-shadow);
            width: 90%;
            max-width: 600px;
            margin: 20px auto;
            text-align: center;
        `,
        display: `
            font-family: monospace;
            font-size: 3.5rem;
            color: var(--text-color);
            margin: 2rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `,
        buttonGroup: `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
        `,
        button: `
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: var(--border-radius-lg);
            font-size: 1em;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 120px;
            justify-content: center;
        `,
        primaryBtn: `
            background: var(--accent-color);
            color: white;
        `,
        secondaryBtn: `
            background: rgba(0, 184, 148, 0.1);
            color: var(--accent-color);
        `,
        dangerBtn: `
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        `,
        lapList: `
            max-height: 300px;
            overflow-y: auto;
            border-radius: var(--border-radius-lg);
            background: rgba(0, 184, 148, 0.05);
            padding: 1rem;
            margin-top: 1rem;
        `,
        lapItem: `
            display: flex;
            justify-content: space-between;
            padding: 0.8rem;
            border-bottom: 1px solid rgba(0, 184, 148, 0.1);
            color: var(--text-color);
            font-family: monospace;
        `,
        lapNumber: `
            color: var(--accent-color);
            font-weight: bold;
        `,
        noLaps: `
            color: var(--text-color);
            opacity: 0.7;
            padding: 1rem;
            text-align: center;
        `
    };

    contentDiv.innerHTML = `
        <div style="${styles.container}">
            <div style="${styles.display}" id="stopwatch-display">00:00:00.000</div>
            <div style="${styles.buttonGroup}">
                <button id="start-btn" style="${styles.button}${styles.primaryBtn}">
                    <span class="icon">▶️</span> Start
                </button>
                <button id="lap-btn" style="${styles.button}${styles.secondaryBtn}" disabled>
                    <span class="icon">🏁</span> Lap
                </button>
                <button id="reset-btn" style="${styles.button}${styles.dangerBtn}" disabled>
                    <span class="icon">🔄</span> Reset
                </button>
            </div>
            <div style="${styles.lapList}" id="lap-list">
                <div style="${styles.noLaps}">No laps recorded</div>
            </div>
        </div>
    `;

    const display = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('start-btn');
    const lapBtn = document.getElementById('lap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const lapList = document.getElementById('lap-list');

    let startTime = 0;
    let elapsedTime = 0;
    let intervalId = null;
    let isRunning = false;
    let laps = [];
    let lastLapTime = 0;

    function formatTime(ms) {
        const date = new Date(ms);
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    function updateDisplay() {
        const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
        display.textContent = formatTime(currentTime);
    }

    function updateLapList() {
        if (laps.length === 0) {
            lapList.innerHTML = `<div style="${styles.noLaps}">No laps recorded</div>`;
            return;
        }

        lapList.innerHTML = laps.map((lap, index) => `
            <div style="${styles.lapItem}">
                <span style="${styles.lapNumber}">Lap ${index + 1}</span>
                <span>${formatTime(lap.lapTime)}</span>
                <span>${formatTime(lap.totalTime)}</span>
            </div>
        `).join('');
    }

    function startStop() {
        if (!isRunning) {
            // Start
            isRunning = true;
            startTime = Date.now();
            intervalId = setInterval(updateDisplay, 10);
            startBtn.innerHTML = '<span class="icon">⏸️</span> Pause';
            startBtn.style.background = 'rgba(231, 76, 60, 0.1)';
            startBtn.style.color = '#e74c3c';
            lapBtn.disabled = false;
            resetBtn.disabled = false;
        } else {
            // Stop
            isRunning = false;
            clearInterval(intervalId);
            elapsedTime += Date.now() - startTime;
            startBtn.innerHTML = '<span class="icon">▶️</span> Resume';
            startBtn.style.background = 'var(--accent-color)';
            startBtn.style.color = 'white';
        }
    }

    function lap() {
        if (!isRunning) return;

        const currentTime = Date.now() - startTime + elapsedTime;
        const lapTime = currentTime - lastLapTime;
        lastLapTime = currentTime;

        laps.unshift({
            lapTime: lapTime,
            totalTime: currentTime
        });

        updateLapList();
    }

    function reset() {
        isRunning = false;
        clearInterval(intervalId);
        startTime = 0;
        elapsedTime = 0;
        lastLapTime = 0;
        laps = [];
        
        startBtn.innerHTML = '<span class="icon">▶️</span> Start';
        startBtn.style.background = 'var(--accent-color)';
        startBtn.style.color = 'white';
        lapBtn.disabled = true;
        resetBtn.disabled = true;
        
        updateDisplay();
        updateLapList();
    }

    // Event listeners
    startBtn.addEventListener('click', startStop);
    lapBtn.addEventListener('click', lap);
    resetBtn.addEventListener('click', reset);

    // Initialize display
    updateDisplay();
} 