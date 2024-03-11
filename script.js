const casillas = document.querySelectorAll('[data-casilla]');
const mensaje = document.getElementById('mensaje');
const listaMejoresTiempos = document.getElementById('lista-mejores-tiempos');

let jugadorActual = 'X';
let juegoActivo = false;
let movimientos = 0;
let tiempoInicio;
let mejoresTiempos = JSON.parse(localStorage.getItem('mejoresTiempos')) || [];

// Inicializar el juego
iniciarJuego();

function iniciarJuego() {
    juegoActivo = true; // Establecer el juego como activo
    movimientos = 0; // Reiniciar el contador de movimientos
    tiempoInicio = new Date().getTime(); // Iniciar el contador de tiempo
    jugadorActual = 'X'; // Establecer al jugador actual como X
    mensaje.innerText = `Turno del jugador ${jugadorActual}.`; // Mostrar el mensaje de turno del jugador

    casillas.forEach(casilla => {
        casilla.innerText = ''; // Limpiar el contenido de las casillas
        casilla.addEventListener('click', manejarClick, { once: true }); // Configurar el evento de clic para cada casilla
    });
}

function manejarClick(e) {
    const casilla = e.target;
    if (!juegoActivo || casilla.innerText !== '') return; // Si el juego no está activo o la casilla ya está marcada, no hacer nada

    casilla.innerText = jugadorActual;
    movimientos++;

    if (comprobarVictoria()) {
        finalizarJuego();
        return;
    }

    jugadorActual = 'O'; // Cambiar al siguiente jugador
    mensaje.innerText = `Turno del jugador ${jugadorActual}.`;
    if (jugadorActual === 'O') {
        setTimeout(movimientoComputadora, 1000);
    }else if (movimientos === 9) {
        mensaje.innerText = `¡Es un empate!`;
}
}

function movimientoComputadora() {
    if (!juegoActivo) return;

    const casillasDisponibles = [];
    casillas.forEach(casilla => {
        if (casilla.innerText === '') {
            casillasDisponibles.push(casilla);
        }
    });

    const casillaAleatoria = casillasDisponibles[Math.floor(Math.random() * casillasDisponibles.length)];
    casillaAleatoria.innerText = jugadorActual;
    movimientos++;

    if (comprobarVictoria()) {
        finalizarJuego();
        return;
    }

    jugadorActual = 'X'; // Cambiar al siguiente jugador
    mensaje.innerText = `Turno del jugador ${jugadorActual}.`;
}


function comprobarVictoria() {
    const condicionesVictoria = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6] // diagonales
    ];

    return condicionesVictoria.some(condicion => {
        const [a, b, c] = condicion;
        return casillas[a].innerText !== '' && casillas[a].innerText === casillas[b].innerText && casillas[a].innerText === casillas[c].innerText;
    });
}

function finalizarJuego() {
    juegoActivo = false;
    const ganador = jugadorActual;
    if (comprobarVictoria()) {
        mensaje.innerText = `${ganador} gana!`;
        if (jugadorActual === 'X') {
            const nombreJugador = prompt('¡Felicidades! ¡Has ganado! Ingresa tu nombre:');
            if (nombreJugador) {
                const tiempoFin = new Date().getTime();
                const tiempoTranscurrido = tiempoFin - tiempoInicio;
                guardarMejorTiempo(nombreJugador, tiempoTranscurrido);
            }
        }
    } else if (!movimientos === 9) {
        mensaje.innerText = `¡Es un empate!`;
    } else {
        // Si no hay ganador ni empate, es el turno del siguiente jugador
        jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        mensaje.innerText = `Turno del jugador ${jugadorActual}.`;
        if (jugadorActual === 'O') {
            setTimeout(movimientoComputadora, 1000);
        }
    }

    // Detener el juego si la O gana
    if (ganador === 'O') {
        mensaje.innerText = `${ganador} gana!`; // Actualiza el mensaje
    }
}

function guardarMejorTiempo(nombreJugador, tiempoTranscurrido) {
    const nuevoTiempo = { nombre: nombreJugador, tiempo: tiempoTranscurrido };
    mejoresTiempos.push(nuevoTiempo);
    mejoresTiempos.sort((a, b) => a.tiempo - b.tiempo);
    if (mejoresTiempos.length > 10) {
        mejoresTiempos.pop();
    }
    localStorage.setItem('mejoresTiempos', JSON.stringify(mejoresTiempos));
    mostrarMejoresTiempos();
}

function mostrarMejoresTiempos() {
    listaMejoresTiempos.innerHTML = '';
    mejoresTiempos.forEach((tiempo, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${tiempo.nombre} - ${formatoTiempo(tiempo.tiempo)}`;
        listaMejoresTiempos.appendChild(li);
    });
}

function formatoTiempo(milisegundos) {
    const segundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
}

mostrarMejoresTiempos();

