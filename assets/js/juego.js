const myModulo = (() => {
  "use strict";

  let deck = [];
  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  const btnNuevo = document.querySelector("#btnNuevo"),
    btnPedir = document.querySelector("#btnPedir"),
    btnDetener = document.querySelector("#btnDetener");

  let divCartasJugadores = document.querySelectorAll(".divCartas"),
    puntosHTML = document.querySelectorAll("small");

  let puntosJugadores = [];

  // Esta function inicializa el juego
  const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck();

    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHTML.forEach((elem) => (elem.innerHTML = 0));

    divCartasJugadores.forEach((elem) => (elem.innerHTML = ""));

    btnPedir.disabled = false;
    btnDetener.disabled = false;
  };

  // Crear deck
  const crearDeck = () => {
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }
    for (let tipo of tipos) {
      for (let esp of especiales) {
        deck.push(esp + tipo);
      }
    }

    return _.shuffle(deck);
  };

  // Pedir carta
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }

    return deck.shift();
  };

  // Acumular puntos
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] += valorCarta(carta);
    puntosHTML[turno].innerHTML = puntosJugadores[turno];

    return puntosJugadores[turno];
  };

  // Valor carta
  const valorCarta = (carta = "") => {
    const valor = carta.slice(0, carta.length - 1);

    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  // Crear carta
  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/4.1 cartas/cartas/${carta}.png`;
    imgCarta.classList.add("carta");

    divCartasJugadores[turno].append(imgCarta);
  };

  // Determinar ganador
  const determinarGanador = () => {
    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        alert("Nadie gana :(");
      } else if (puntosMinimos > 21) {
        alert("Computadora gana");
      } else if (puntosComputadora > 21) {
        alert("Jugador gana");
      } else if (puntosComputadora > puntosMinimos) {
        alert("Computadora gana");
      } else {
        alert("Jugador gana");
      }
    }, 100);
  };

  // Turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    do {
      const carta = pedirCarta();

      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    determinarGanador();
  };

  // Eventos
  btnNuevo.addEventListener("click", () => {
    console.clear();
    inicializarJuego();
  });

  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    let puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      console.warn("Lo siento, perdiste!");
      btnPedir.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn("21, it's great!");
      turnoComputadora(puntosJugador);
    }
  });

  btnDetener.addEventListener("click", () => {
    btnDetener.disabled = true;
    btnPedir.disabled = true;
    turnoComputadora(puntosJugadores[0]);
  });

  return {
    nuevoJuego: inicializarJuego,
  };
})();
