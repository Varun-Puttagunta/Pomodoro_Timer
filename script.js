// DOM Elements
const timeDisplay = document.getElementById('time-display');
const phaseIndicator = document.getElementById('phase-indicator');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const workTab = document.getElementById('work-tab');
const breakTab = document.getElementById('break-tab');

// Timer Variables
let timer;
let isRunning = false;
let isWorkPhase = true;
let timeLeft = 25 * 60; // Default 25 minutes in seconds
let totalTime = 25 * 60;

// Initialize the timer display
updateDisplay();

// Event Listeners
startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
workTimeInput.addEventListener('change', updateSettings);
breakTimeInput.addEventListener('change', updateSettings);
workTab.addEventListener('click', () => switchPhase(true));
breakTab.addEventListener('click', () => switchPhase(false));

// Toggle between start and pause
function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

// Start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
        startBtn.classList.remove('bg-green-500');
        startBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                playSound();
                switchPhase(!isWorkPhase);
                startTimer(); // Auto-start next phase
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Start';
    startBtn.classList.remove('bg-yellow-500');
    startBtn.classList.add('bg-green-500', 'hover:bg-green-600');
}

// Reset the timer
function resetTimer() {
    pauseTimer();
    isWorkPhase = true;
    updateSettings();
    switchPhase(true);
}

// Update timer settings from inputs
function updateSettings() {
    if (!isRunning) {
        totalTime = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
        timeLeft = totalTime;
        updateDisplay();
    }
}

// Switch between work and break phases
function switchPhase(workPhase) {
    isWorkPhase = workPhase;
    totalTime = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
    timeLeft = totalTime;
    
    // Update UI
    phaseIndicator.textContent = isWorkPhase ? 'Work Time' : 'Break Time';
    workTab.classList.toggle('phase-active', isWorkPhase);
    breakTab.classList.toggle('phase-active', !isWorkPhase);
    
    updateDisplay();
}

// Update the display with current time
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Play notification sound
function playSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.volume = 0.3;
    audio.play();
}

// Teaching Notes:
// 1. The timer uses setInterval for second-by-second updates
// 2. All time calculations are done in seconds for precision
// 3. The phase switching is handled by toggling the isWorkPhase flag
// 4. Event listeners handle user interactions with buttons and inputs
// 5. The UI updates are separated from the timer logic for clarity