// Variables de estado
let lastTapTime = 0;
let tapTimes = [];
let tapCount = 0;
const maxTaps = 10; // Número de taps para calcular el promedio (optimizado)

// Referencias del DOM
const bpmDisplay = document.getElementById('bpmDisplay');
const genreDisplay = document.getElementById('genreDisplay'); // New reference
const tapButton = document.getElementById('tapButton');
const resetButton = document.getElementById('resetButton');
const tapsCountDisplay = document.getElementById('tapsCount');

// Función para determinar el género musical basado en el BPM
function getMusicGenre(bpm) {
    if (bpm < 60) return "Lento (ej. Balada, Ambient)";
    if (bpm < 80) return "Downtempo / Chillout";
    if (bpm < 100) return "Hip-Hop / Reggae";
    if (bpm < 110) return "Pop / Rock";
    if (bpm < 120) return "Indie / Alternative";
    if (bpm < 130) return "House / Disco";
    if (bpm < 140) return "Techno / Trance";
    if (bpm < 160) return "Drum and Bass";
    if (bpm < 180) return "Jungle / Breakbeat";
    return "Hardcore / Speedcore";
}

// Función principal para manejar el tap
function handleTap() {
    const currentTime = performance.now(); // Tiempo en milisegundos de alta precisión

    // Reinicia si el tiempo entre taps es demasiado largo (ej. más de 3 segundos)
    if (currentTime - lastTapTime > 3000) {
        resetBPM();
    }

    // Almacena el tiempo actual
    tapTimes.push(currentTime);
    
    // Mantenemos solo los últimos 'maxTaps' tiempos para el cálculo
    if (tapTimes.length > maxTaps) {
        tapTimes.shift(); // Elimina el tiempo más antiguo
    }

    tapCount++;
    lastTapTime = currentTime;

    calculateBPM();
}

// Función para calcular y mostrar el BPM y género
function calculateBPM() {
    const len = tapTimes.length;
    
    tapsCountDisplay.textContent = `Taps: ${tapCount}`;

    // Necesitamos al menos dos taps para calcular un intervalo
    if (len < 2) {
        bpmDisplay.textContent = '0';
        genreDisplay.textContent = 'Género: ---';
        return;
    }

    // Calcula la suma de todos los intervalos
    let totalInterval = 0;
    for (let i = 1; i < len; i++) {
        totalInterval += tapTimes[i] - tapTimes[i-1];
    }

    // Calcula el intervalo promedio en milisegundos
    const averageIntervalMs = totalInterval / (len - 1);

    // Convierte el intervalo promedio a BPM
    const bpm = 60000 / averageIntervalMs;

    // Muestra el BPM redondeado al número entero más cercano
    const roundedBPM = Math.round(bpm);
    bpmDisplay.textContent = roundedBPM;
    
    // Muestra el género musical correspondiente
    genreDisplay.textContent = `Género: ${getMusicGenre(roundedBPM)}`;
}

// Función para reiniciar el estado
function resetBPM() {
    lastTapTime = 0;
    tapTimes = [];
    tapCount = 0;
    bpmDisplay.textContent = '0';
    genreDisplay.textContent = 'Género: ---'; // Reset genre display
    tapsCountDisplay.textContent = 'Taps: 0';
}

// Asignación de Eventos
tapButton.addEventListener('click', handleTap);
resetButton.addEventListener('click', resetBPM);

// Opcional: Permitir tap con la barra espaciadora
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && document.activeElement !== tapButton) {
        event.preventDefault(); 
        handleTap();
        tapButton.classList.add('active'); 
        setTimeout(() => tapButton.classList.remove('active'), 100);
    }
});

// CSS adicional para el efecto visual con la barra espaciadora
const style = document.createElement('style');
style.textContent = `
    #tapButton.active {
        transform: scale(0.98); 
        background-color: #2b6cb0;
    }
`;
document.head.appendChild(style);