// Importiamo useState: è l’hook che ci permette di memorizzare “stato” nel componente
// (dati che cambiano nel tempo e causano un re-render quando aggiornati).
import { useState } from 'react';

// Importiamo il componente Player: rappresenta un giocatore (nome, simbolo, stato attivo).
import Player from "./Components/Player.jsx";

// Importiamo GameBoard: renderizza la griglia e notifica i click sulle caselle.
import GameBoard from "./Components/GameBoard.jsx";

// Importiamo Log: mostra la cronologia dei turni (mosse effettuate).
import Log from './Components/Log.jsx';

// Importiamo GameOver: UI di fine partita (vittoria o pareggio + bottone restart).
import GameOver from './Components/GameOver.jsx';

// Importiamo la lista predefinita delle combinazioni vincenti del tris (8 combinazioni).
import { WINNING_COMBINATIONS } from './winning-combinations.js';

// Mappa “simbolo -> nome giocatore” usata per visualizzare nomi e determinare il vincitore.
// Nota: tenerla come oggetto rende facile fare lookup tipo players['X'].
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

// Rappresentazione della griglia 3x3 vuota: null = casella non ancora giocata.
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Calcola a chi tocca giocare partendo dalla cronologia dei turni.
// L’idea: se non ci sono turni -> parte X.
// Se l’ultimo turno registrato in testa (index 0) è di X, allora ora tocca a O, altrimenti a X.
function deriveActivePlayer(gameTurns) {
  // Per convenzione facciamo partire X.
  let currentPlayer = 'X';

  // gameTurns[0] è la mossa più recente perché nel codice aggiungiamo i turni in testa all’array.
  // Se l’ultima mossa è stata di X, allora il prossimo è O.
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  // Ritorniamo il simbolo del player attivo.
  return currentPlayer;
}

// Calcola il vincitore leggendo la griglia e confrontandola con le combinazioni vincenti.
// Ritorna il NOME del giocatore (non il simbolo) usando la mappa `players`.
function deriveWinner(gameBoard, players) {
  // Variabile locale che conterrà il vincitore se lo troviamo (altrimenti resta undefined).
  let winner;

  // Etichette solo per debug: servono a capire “quale combinazione” stiamo controllando nei log.
  const labels = [
    'C1 riga 0',
    'C2 riga 1',
    'C3 riga 2',
    'C4 col 0',
    'C5 col 1',
    'C6 col 2',
    'C7 diag principale',
    'C8 diag secondaria',
  ];

  // Scorriamo tutte le combinazioni vincenti.
  // `.entries()` ci dà [index, value] così possiamo usare l’etichetta labels[i].
  for (const [i, combination] of WINNING_COMBINATIONS.entries()) {
    // Ogni combinazione contiene 3 coordinate: le estraiamo per leggibilità.
    const a = combination[0];
    const b = combination[1];
    const c = combination[2];

    // Leggiamo cosa c’è nelle 3 caselle della combinazione corrente.
    // gameBoard[row][column] ci dà 'X', 'O' oppure null.
    const firstSquareSymbol = gameBoard[a.row][a.column];
    const secondSquareSymbol = gameBoard[b.row][b.column];
    const thirdSquareSymbol = gameBoard[c.row][c.column];

    // Condizione 1: la prima casella deve essere valorizzata (evita che null-null-null risulti “uguale”).
    const cond1 = !!firstSquareSymbol;

    // Condizione 2: prima e seconda devono essere uguali.
    const cond2 = firstSquareSymbol === secondSquareSymbol;

    // Condizione 3: prima e terza devono essere uguali.
    const cond3 = firstSquareSymbol === thirdSquareSymbol;

    // Debug: stampiamo esattamente cosa stiamo controllando.
    console.log('------------------------------');
    console.log(`${labels[i]} -> coords:`, a, b, c);
    console.log('symbols:', {
      firstSquareSymbol,
      secondSquareSymbol,
      thirdSquareSymbol,
    });
    console.log('check:', { cond1, cond2, cond3 });

    // Se tutte le condizioni sono vere, abbiamo una combinazione vincente.
    if (cond1 && cond2 && cond3) {
      // Convertiamo il simbolo ('X'/'O') nel nome (es. 'Player 1') usando l’oggetto players.
      winner = players[firstSquareSymbol];

      // Debug: annunciamo il vincitore e quale combinazione ha chiuso la partita.
      console.log('✅ WINNER TROVATO:', winner, 'con', labels[i]);

      // Ottimizzazione possibile: potremmo fare break per smettere di controllare altre combinazioni.
      // break;
    } else {
      // Debug: la combinazione corrente non è vincente.
      console.log('❌ no win for this combination');
    }
  }

  // Ritorniamo il vincitore trovato (oppure undefined se non esiste).
  return winner;
}

// Ricostruisce la griglia a partire dalla lista turn-by-turn.
// Questo approccio (derivare la griglia dai turni) evita di avere “stato duplicato” (turni + griglia).
function deriveGameBoard(gameTurns) {
  // Creiamo una COPIA profonda (per questo caso) della griglia iniziale.
  // Importante: così non mutiamo mai INITIAL_GAME_BOARD, evitando side-effect tra render.
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  // Applichiamo ogni turno sulla griglia: per ogni mossa scriviamo X/O nella cella corretta.
  for (const turn of gameTurns) {
    // Destructuring: estraiamo square e player dall’oggetto turno.
    const { square, player } = turn;

    // Destructuring: estraiamo row e col dalle coordinate della casella.
    const { row, col } = square;

    // Scriviamo il simbolo del giocatore nella posizione della griglia.
    gameBoard[row][col] = player;
  }

  // Debug: separatore per capire dove inizia un nuovo render.
  console.log('==============================');

  // Debug: titolo del blocco log.
  console.log('RENDER / CONTROLLO VINCITORE');

  // Debug: stampiamo i turni (cronologia) così capisci che dati stiamo usando per ricostruire la griglia.
  console.log('gameTurns:', gameTurns);

  // Debug: stampa “umana” della griglia, sostituendo null con '-' per leggibilità.
  console.log(
    'gameBoard:\n' +
      gameBoard.map(row => row.map(c => c ?? '-').join(' ')).join('\n')
  );

  // Ritorniamo la griglia aggiornata.
  return gameBoard;
}

// Componente principale: gestisce stato e logica, e delega UI a Player/GameBoard/Log/GameOver.
function App() {
  // Stato dei giocatori: ci serve perché i nomi possono cambiare (es. input editabile nel componente Player).
  const [players, setPlayers] = useState(PLAYERS);

  // Stato dei turni: contiene la cronologia delle mosse (è lo “stato sorgente” della partita).
  const [gameTurns, setGameTurns] = useState([]);

  // Calcoliamo (deriviamo) il giocatore attivo dai turni, invece di tenerlo in uno state separato.
  // Questo riduce bug: un solo “source of truth”.
  const activePlayer = deriveActivePlayer(gameTurns);

  // Ricostruiamo la griglia corrente applicando i turni alla griglia vuota.
  const gameBoard = deriveGameBoard(gameTurns);

  // Calcoliamo il vincitore leggendo gameBoard e mappando simbolo->nome tramite players.
  const winner = deriveWinner(gameBoard, players);

  // Debug: stampa del vincitore calcolato in questo render.
  console.log('winner finale:', winner);

  // Debug: chiudiamo il blocco log del render.
  console.log('==============================');

  // Pareggio: nel tris 3x3 il massimo sono 9 mosse (tutte le caselle piene), e non deve esserci un winner.
  const hasDraw = gameTurns.length === 9 && !winner;

  // Handler chiamato quando l’utente clicca una casella sulla griglia.
  function handleSelectSquare(rowIndex, colIndex) {
    // Aggiorniamo i turni con la forma “funzionale”: React ci passa lo stato precedente (prevTurns).
    // È la scelta corretta quando il nuovo stato dipende dal precedente.
    setGameTurns(prevTurns => {
      // Deriviamo il player corrente basandoci sui prevTurns (non sulla variabile esterna),
      // così siamo sicuri di usare lo stato più aggiornato.
      const currentPlayer = deriveActivePlayer(prevTurns);

      // Creiamo un nuovo array con la mossa appena fatta in testa (index 0 = mossa più recente).
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      // Ritorniamo il nuovo array: React aggiornerà lo stato e farà re-render.
      return updatedTurns;
    });
  }

  // Handler di restart: azzera la cronologia delle mosse, quindi la griglia torna vuota.
  function handleRestart() {
    setGameTurns([]);
  }

  // Handler chiamato quando un Player cambia nome.
  // symbol è 'X' oppure 'O'; newName è il nuovo nome inserito dall’utente.
  function handlePlayerNameChange(symbol, newName) {
    // Usiamo l’update funzionale per evitare di lavorare su uno state “stale”.
    setPlayers(prevPlayers => {
      // Ritorniamo un nuovo oggetto:
      // - copiamo i giocatori esistenti
      // - sovrascriviamo solo la chiave corrispondente al simbolo cambiato
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  // Render: descriviamo la UI in JSX.
  return (
    <main>
      {/* Wrapper del gioco: utile per layout/CSS */}
      <div id="game-container">
        {/* Lista giocatori: evidenziamo quello attivo tramite la prop isActive */}
        <ol id="players" className="highlight-player">
          {/* Player X: passiamo nome iniziale, simbolo, stato attivo e callback per cambio nome */}
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />

          {/* Player O: stessa logica, ma attivo quando activePlayer è 'O' */}
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>

        {/* Mostriamo il pannello di fine gioco solo se c’è un winner o un pareggio */}
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}

        {/* Render della griglia: passa la griglia derivata e l’handler dei click */}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
        />
      </div>

      {/* Log mosse: riceve la cronologia turni e la renderizza */}
      <Log turns={gameTurns} />
    </main>
  );
}

// Export default: permette agli altri file (es. main.jsx) di importare App e renderizzarla.
export default App;