document.addEventListener('DOMContentLoaded', function() {
    const piano = document.getElementById('piano');
    const frequenciesDiv = document.getElementById('frequencies');
    const divisionInput = document.getElementById('division');
    const setDivisionButton = document.getElementById('setDivision');
    let division = parseInt(divisionInput.value);
    let pianoKeys = generatePianoKeys(division);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillators = {};

    function generatePianoKeys(division) {
        return '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.substring(0, division);
    }

    function updatePiano() {
        piano.innerHTML = ''; 
        frequenciesDiv.innerHTML = ''; // 周波数表示をリセット
        pianoKeys.split('').forEach(key => {
            const div = document.createElement('div');
            div.className = 'key';
            div.textContent = key;
            piano.appendChild(div);

            // 各キーの周波数を表示
            const frequency = calculateFrequency(key);
            const freqDiv = document.createElement('div');
            freqDiv.textContent = `${key} = ${frequency.toFixed(2)}Hz`;
            frequenciesDiv.appendChild(freqDiv);
        });
    }

    function calculateFrequency(key) {
        return 440 * Math.pow(2, (pianoKeys.indexOf(key) / division));
    }

    setDivisionButton.addEventListener('click', function() {
        division = parseInt(divisionInput.value);
        pianoKeys = generatePianoKeys(division);
        updatePiano();
    });

    document.addEventListener('keydown', function(e) {
        const key = e.key.toUpperCase();
        if (pianoKeys.includes(key) && !oscillators[key]) {
            playSound(key);
        }
    });

    document.addEventListener('keyup', function(e) {
        const key = e.key.toUpperCase();
        if (pianoKeys.includes(key) && oscillators[key]) {
            stopSound(key);
        }
    });

    function playSound(key) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        const frequency = calculateFrequency(key);
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        oscillator.start();

        oscillators[key] = oscillator;
    }

    function stopSound(key) {
        if (oscillators[key]) {
            oscillators[key].stop(audioContext.currentTime);
            oscillators[key].disconnect();
            delete oscillators[key];
        }
    }

    updatePiano(); // 初期表示
});
