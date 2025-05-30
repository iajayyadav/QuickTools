export function init() {
    const contentDiv = document.getElementById('text-to-speech-content');
    if (!contentDiv) return;
  
    // Styles used inline for quick setup
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
      textarea: `
        width: 100%;
        min-height: 200px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--accent-color);
        border-radius: var(--border-radius-lg);
        background: var(--tool-card-bg);
        color: var(--text-color);
        font-size: 1em;
        line-height: 1.5;
        resize: vertical;
        transition: border-color 0.2s ease;
      `,
      controlsGrid: `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      `,
      controlGroup: `
        background: rgba(0, 184, 148, 0.05);
        padding: 1rem;
        border-radius: var(--border-radius-lg);
      `,
      label: `
        display: block;
        color: var(--text-color);
        margin-bottom: 0.5rem;
        font-size: 0.9em;
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
        margin-bottom: 1rem;
      `,
      range: `
        width: 100%;
        margin: 0.5rem 0;
      `,
      rangeValue: `
        font-family: monospace;
        color: var(--accent-color);
        font-size: 0.9em;
        text-align: right;
      `,
      buttonGroup: `
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
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
      disabledBtn: `
        opacity: 0.5;
        cursor: not-allowed;
      `,
      seoContent: `
        margin-bottom: 2rem;
        color: var(--text-color);
        line-height: 1.6;
      `,
      heading: `
        color: var(--text-color);
        margin-bottom: 1rem;
        font-size: 1.5em;
      `,
      subheading: `
        color: var(--text-color);
        margin: 1rem 0;
        font-size: 1.2em;
      `,
      paragraph: `
        margin-bottom: 1rem;
        color: var(--text-color);
        line-height: 1.6;
      `,
      featureList: `
        list-style: disc;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
      `,
      featureItem: `
        margin-bottom: 0.5rem;
        color: var(--text-color);
      `
    };
  
    contentDiv.innerHTML = `
      <div style="${styles.container}">
        <div style="${styles.seoContent}">
          <h1 style="${styles.heading}">Text to Speech Converter</h1>
          <p style="${styles.paragraph}">
            Convert any text into natural-sounding speech with our advanced text-to-speech tool. 
            Perfect for creating voiceovers, learning pronunciation, assisting visually impaired users, 
            or simply converting written content into audio format.
          </p>
          
          <h2 style="${styles.subheading}">Key Features</h2>
          <ul style="${styles.featureList}">
            <li style="${styles.featureItem}">Multiple voice options with different accents and languages</li>
            <li style="${styles.featureItem}">Adjustable speech rate and pitch controls</li>
            <li style="${styles.featureItem}">Real-time preview with play, pause, and stop controls</li>
            <li style="${styles.featureItem}">Support for long text passages</li>
            <li style="${styles.featureItem}">Easy-to-use interface with instant feedback</li>
          </ul>

          <h2 style="${styles.subheading}">How to Use</h2>
          <p style="${styles.paragraph}">
            Type or paste your text into the input area below. Select your preferred voice from the 
            dropdown menu. Adjust the rate and pitch sliders to customize the speech output. Use the 
            playback controls to start, pause, or stop the speech. The tool will automatically handle 
            punctuation and formatting for natural-sounding speech.
          </p>
        </div>

        <textarea
          id="text-input"
          placeholder="Type or paste text to convert to speech..."
          style="${styles.textarea}"
          aria-label="Text to convert to speech"
        ></textarea>
        <div style="${styles.controlsGrid}">
          <div style="${styles.controlGroup}">
            <label style="${styles.label}">Voice</label>
            <select id="voice-select" style="${styles.select}" aria-label="Select voice">
              <option value="">Loading voices...</option>
            </select>
          </div>
          <div style="${styles.controlGroup}">
            <label style="${styles.label}">
              Rate: <span id="rate-value" style="${styles.rangeValue}">1</span>
            </label>
            <input
              type="range"
              id="rate"
              min="0.5"
              max="2"
              value="1"
              step="0.1"
              style="${styles.range}"
              aria-label="Speech rate"
            >
            <label style="${styles.label}">
              Pitch: <span id="pitch-value" style="${styles.rangeValue}">1</span>
            </label>
            <input
              type="range"
              id="pitch"
              min="0.5"
              max="2"
              value="1"
              step="0.1"
              style="${styles.range}"
              aria-label="Speech pitch"
            >
          </div>
        </div>
        <div style="${styles.buttonGroup}">
          <button id="play-btn" style="${styles.button}${styles.primaryBtn}">
            <span class="icon">▶️</span> Play
          </button>
          <button id="pause-btn" style="${styles.button}${styles.secondaryBtn}" disabled>
            <span class="icon">⏸️</span> Pause
          </button>
          <button id="stop-btn" style="${styles.button}${styles.dangerBtn}" disabled>
            <span class="icon">⏹️</span> Stop
          </button>
          <button id="clear-btn" style="${styles.button}${styles.dangerBtn}">
            <span class="icon">🗑️</span> Clear
          </button>
        </div>

        <div style="${styles.seoContent}">
          <h2 style="${styles.subheading}">About Text-to-Speech Technology</h2>
          <p style="${styles.paragraph}">
            Text-to-speech (TTS) technology converts written text into natural-sounding speech using 
            advanced speech synthesis algorithms. This technology has numerous applications, from 
            accessibility tools for visually impaired users to creating audio content for learning 
            materials and podcasts.
          </p>
          <p style="${styles.paragraph}">
            Our text-to-speech converter uses your browser's built-in speech synthesis capabilities, 
            offering multiple voices and languages. The tool provides fine-grained control over speech 
            parameters like rate and pitch, allowing you to customize the output to your needs. Whether 
            you're creating accessible content, learning a new language, or just need to listen to text 
            instead of reading it, this tool makes it easy to convert text to natural-sounding speech.
          </p>

          <h2 style="${styles.subheading}">Tips for Best Results</h2>
          <p style="${styles.paragraph}">
            For the most natural-sounding speech, try to use proper punctuation in your text. 
            Experiment with different voices and speech rates to find the perfect combination for your 
            needs. If you're using the tool for learning purposes, try following along with the text 
            as it's being spoken to improve comprehension and pronunciation.
          </p>
        </div>
      </div>
    `;
  
    // Element references
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const rateValue = document.getElementById('rate-value');
    const pitchValue = document.getElementById('pitch-value');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
  
    // Verify all essential elements are found
    if (!textInput || !voiceSelect || !rateInput || !pitchInput || !rateValue || !pitchValue || !playBtn || !pauseBtn || !stopBtn || !clearBtn) {
      console.error('Some UI elements failed to initialize.');
      showErrorMessage('Error initializing UI components. Please refresh the page.');
      return;
    }
  
    // Clear error messages on input change
    textInput.addEventListener('input', () => {
      removeErrorMessage();
    });
  
    // Speech synthesis setup
    const speechSynth = window.speechSynthesis;
    let voices = [];
    let currentUtterance = null;
    let resumeIntervalId = null;
  
    // Load voices with retry if none found immediately
    async function loadVoices() {
      voices = speechSynth.getVoices();
      if (voices.length === 0) {
        // Wait for voiceschanged event or retry
        await new Promise(resolve => setTimeout(resolve, 100));
        voices = speechSynth.getVoices();
      }
      if (voices.length === 0) {
        voiceSelect.innerHTML = `<option value="">No voices available</option>`;
        voiceSelect.disabled = true;
        voiceSelect.setAttribute('aria-busy', 'false');
        showErrorMessage('No speech synthesis voices available.');
        return;
      }
      voiceSelect.innerHTML = voices
        .map((voice, idx) => `<option value="${idx}">${voice.name} (${voice.lang})</option>`)
        .join('');
      voiceSelect.disabled = false;
      voiceSelect.setAttribute('aria-busy', 'false');
    }
  
    if ('onvoiceschanged' in speechSynth) {
      speechSynth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  
    // Show error message below controls
    function showErrorMessage(msg) {
      removeErrorMessage();
      const errorDiv = document.createElement('div');
      errorDiv.className = 'tts-error';
      Object.assign(errorDiv.style, {
        color: '#e74c3c',
        padding: '1rem',
        marginTop: '1rem',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderRadius: 'var(--border-radius-lg)',
      });
      errorDiv.textContent = msg;
      contentDiv.appendChild(errorDiv);
    }
  
    // Remove error message if present
    function removeErrorMessage() {
      const err = contentDiv.querySelector('.tts-error');
      if (err) err.remove();
    }
  
    // Update displayed values for rate and pitch sliders
    rateInput.addEventListener('input', () => {
      rateValue.textContent = rateInput.value;
    });
  
    pitchInput.addEventListener('input', () => {
      pitchValue.textContent = pitchInput.value;
    });
  
    // Update button states & accessibility attributes depending on speaking state
    function updateButtons(isSpeaking, isPaused = false) {
      playBtn.disabled = isSpeaking && !isPaused;
      pauseBtn.disabled = !isSpeaking || isPaused;
      stopBtn.disabled = !isSpeaking;
  
      playBtn.style.opacity = playBtn.disabled ? '0.6' : '1';
      pauseBtn.style.opacity = pauseBtn.disabled ? '0.6' : '1';
      stopBtn.style.opacity = stopBtn.disabled ? '0.6' : '1';
  
      playBtn.setAttribute('aria-pressed', isSpeaking && !isPaused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    }
  
    // Stop any ongoing speech and reset UI state
    function stopSpeech() {
      if (speechSynth.speaking || speechSynth.paused) {
        speechSynth.cancel();
      }
      currentUtterance = null;
      updateButtons(false, false);
      clearInterval(resumeIntervalId);
      resumeIntervalId = null;
    }
  
    // Play or resume speech
    function playSpeech() {
      if (!textInput.value.trim()) {
        showErrorMessage('Please enter some text to speak.');
        return;
      }
      removeErrorMessage();
  
      if (speechSynth.paused) {
        speechSynth.resume();
        updateButtons(true, false);
        return;
      }
  
      if (speechSynth.speaking) {
        // Already speaking, ignore duplicate play
        return;
      }
  
      currentUtterance = new SpeechSynthesisUtterance(textInput.value.trim());
      const selectedVoiceIndex = voiceSelect.value;
      if (selectedVoiceIndex !== '') {
        currentUtterance.voice = voices[parseInt(selectedVoiceIndex)];
      }
      currentUtterance.rate = parseFloat(rateInput.value);
      currentUtterance.pitch = parseFloat(pitchInput.value);
  
      currentUtterance.onstart = () => {
        updateButtons(true, false);
        // Clear any old resume interval just in case
        if (resumeIntervalId) {
          clearInterval(resumeIntervalId);
          resumeIntervalId = null;
        }
        // Defensive resume interval to prevent stuck paused state on some browsers
        resumeIntervalId = setInterval(() => {
          if (speechSynth.paused) {
            speechSynth.resume();
          }
        }, 250);
      };
  
      currentUtterance.onend = () => {
        stopSpeech();
      };
  
      currentUtterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance error:', event.error);
        showErrorMessage('An error occurred during speech synthesis.');
        stopSpeech();
      };
  
      speechSynth.speak(currentUtterance);
    }
  
    // Pause speech
    function pauseSpeech() {
      if (speechSynth.speaking && !speechSynth.paused) {
        speechSynth.pause();
        updateButtons(true, true);
      }
    }
  
    // Clear text area and reset UI state
    function clearText() {
      textInput.value = '';
      removeErrorMessage();
      stopSpeech();
      rateValue.textContent = rateInput.value = '1';
      pitchValue.textContent = pitchInput.value = '1';
    }
  
    // Attach event listeners
    playBtn.addEventListener('click', playSpeech);
    pauseBtn.addEventListener('click', pauseSpeech);
    stopBtn.addEventListener('click', stopSpeech);
    clearBtn.addEventListener('click', clearText);
  
    // Keyboard accessibility for play button (optional)
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playSpeech();
      }
    });
  
    // Initialize UI state
    updateButtons(false, false);
  }
  