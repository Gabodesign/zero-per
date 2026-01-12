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

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currentPlayer = '0';
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
        <GameBoard
          onSelectSquare={handleSelectSquare}
          turns={gameTurns}
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
