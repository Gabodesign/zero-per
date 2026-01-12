// Importiamo l'hook useState da React.
// useState serve per creare e gestire uno "stato", cioè un dato che può cambiare
// nel tempo e che, quando cambia, fa ri-renderizzare il componente.
import { useState } from 'react';

// Importiamo il componente Player.
// Questo è un componente custom che probabilmente rappresenta un giocatore.
import Player from "./Components/Player.jsx";

// Importiamo il componente GameBoard.
// Questo componente gestirà la griglia del gioco (tipo tris).
import GameBoard from "./Components/GameBoard.jsx";
import Log from './Components/Log.jsx';
import GameOver from './Components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';
// Definiamo lo stato iniziale del tabellone.
// È una matrice 3x3 inizializzata a null.
// null = casella vuota
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currentPlayer = 'O';
  }

  return currentPlayer;
}
// Definiamo il componente principale App.
// In React, un componente è semplicemente una funzione che ritorna JSX.
function App() {
  const [gameTurns, setGameTurns] = useState([]);

  // Qui creiamo uno stato chiamato "activePlayer".
  // - 'X' è il valore iniziale
  // - activePlayer è il valore attuale dello stato
  // - SetActivePlayer è la funzione per modificarlo
  //
  // Importante: NON possiamo modificare activePlayer direttamente,
  // dobbiamo sempre usare SetActivePlayer.
  const activePlayer = deriveActivePlayer(gameTurns);

  

  let gameBoard = initialGameBoard;
   
  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row, col} = square;
      gameBoard[row][col] = player; 
  }

  console.log('==============================');
  console.log('RENDER / CONTROLLO VINCITORE');
  console.log('gameTurns:', gameTurns);

  // stampa tabellone in modo leggibile
  console.log(
    'gameBoard:\n' +
      gameBoard.map(row => row.map(c => c ?? '-').join(' ')).join('\n')
  );
  let winner;


  // etichette solo per capire quale combinazione stai controllando
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

  for (const [i, combination] of WINNING_COMBINATIONS.entries()) {
    // coordinate della combinazione
    const a = combination[0];
    const b = combination[1];
    const c = combination[2];

    // simboli letti dalla griglia
    const firstSquareSymbol = gameBoard[a.row][a.column];
    const secondSquareSymbol = gameBoard[b.row][b.column];
    const thirdSquareSymbol = gameBoard[c.row][c.column];

    // le condizioni dell'if (separate così capisci bene cosa fallisce)
    const cond1 = !!firstSquareSymbol;
    const cond2 = firstSquareSymbol === secondSquareSymbol;
    const cond3 = firstSquareSymbol === thirdSquareSymbol;

    console.log('------------------------------');
    console.log(`${labels[i]} -> coords:`, a, b, c);
    console.log('symbols:', {
      firstSquareSymbol,
      secondSquareSymbol,
      thirdSquareSymbol,
    });
    console.log('check:', { cond1, cond2, cond3 });

    if (cond1 && cond2 && cond3) {
      winner = firstSquareSymbol;
      console.log('✅ WINNER TROVATO:', winner, 'con', labels[i]);
      // se vuoi fermarti al primo vincitore:
      // break;
    } else {
      console.log('❌ no win for this combination');
    }
  }

  console.log('winner finale:', winner);
  console.log('==============================');

  const hasDraw = gameTurns.length === 9 && !winner;
  // Questa funzione verrà chiamata quando un giocatore seleziona una casella.
  function handleSelectSquare(rowIndex, colIndex) {
    
    // Qui usiamo la forma "funzionale" di setState.
    // React ci passa automaticamente il valore attuale dello stato
    // (curActivePlayer).
    //
    // Questo approccio è consigliato quando il nuovo stato
    // dipende dal valore precedente.
    
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [{square: {row: rowIndex, col: colIndex}, player: currentPlayer}, ...prevTurns,];
      return updatedTurns;
    });
  }
  
  // Il return di un componente React descrive cosa deve essere mostrato a schermo.
  // Non è HTML vero, ma JSX (HTML + JavaScript).
  return (
    <main>
      {/* Contenitore principale del gioco */}
      <div id="game-container">

        {/* Lista dei giocatori */}
        <ol id="players" className='highlight-player'>

          {/* 
            Player 1:
            - initialName: nome iniziale del giocatore
            - symbol: simbolo usato nel gioco
            - isActive: true se questo giocatore è quello attivo
          */}
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === 'X'}
          />

          {/* 
            Player 2:
            La logica è identica, ma controlliamo se il giocatore attivo è 'O'
          */}
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === 'O'}
          />
        </ol>

        {/* 
          GameBoard:
          - onSelectSquare: passiamo la funzione che GameBoard chiamerà
            quando viene selezionata una casella
          - acrivePlayerSymbol: passiamo il simbolo del giocatore attivo
            (ATTENZIONE: qui c'è un typo, dovrebbe essere "activePlayerSymbol")
        */}
        {(winner || hasDraw) && <GameOver winner={winner}/>}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
        />
      </div>

      {/* Placeholder per eventuali log di gioco */}
      <Log turns={gameTurns}/>
    </main>
  )
}

// Esportiamo il componente App per poterlo usare in index.jsx/main.jsx.
// Senza questo export, React non saprebbe quale componente renderizzare.
export default App;
