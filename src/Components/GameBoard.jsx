// Importiamo useState da React.
// Serve per gestire lo stato locale del tabellone di gioco.
import { useState } from "react";

// Definiamo lo stato iniziale del tabellone.
// È una matrice 3x3 inizializzata a null.
// null = casella vuota
const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

// Componente GameBoard.
// Riceve due props dal componente padre (App):
// - onSelectSquare: funzione da chiamare quando si clicca una casella
// - activePlayerSymbol: simbolo del giocatore corrente ('X' o 'O')
export default function GameBoard({ onSelectSquare, activePlayerSymbol }) {

    // Stato che rappresenta il tabellone attuale del gioco.
    // È una copia dello stato iniziale.
    const [gameBoard, setGameBoard] = useState(initialGameBoard);

    // Questa funzione viene chiamata quando l'utente clicca su una casella.
    // rowIndex e colIndex indicano la posizione nella griglia.
    function handleSelectSquare(rowIndex, colIndex) {

        // Aggiorniamo lo stato usando la forma funzionale.
        // prevGameBoard è SEMPRE lo stato più recente.
        setGameBoard((prevGameBoard) => {

            // IMPORTANTISSIMO:
            // NON possiamo modificare direttamente prevGameBoard.
            // Dobbiamo creare una COPIA profonda della matrice 2D.

            // - map crea un nuovo array esterno
            // - [...innerArray] crea una copia di ogni riga
            const updateBoard = prevGameBoard.map(
                (innerArray) => [...innerArray]
            );

            // Ora possiamo modificare in sicurezza la casella selezionata.
            updateBoard[rowIndex][colIndex] = activePlayerSymbol;

            // Restituiamo il nuovo tabellone a React.
            // React confronterà il vecchio e il nuovo stato
            // e aggiornerà il DOM.
            return updateBoard;
        });

        // Dopo aver aggiornato il tabellone,
        // notifichiamo il componente padre (App)
        // che una mossa è stata fatta.
        onSelectSquare();
    }

    // Render del tabellone
    return (
        // Lista esterna che rappresenta le righe
        <ol id="game-board">

            {/* 
              map sul tabellone:
              - row è una riga (array)
              - rowIndex è l'indice della riga
            */}
            {gameBoard.map((row, rowIndex) => (
                <li key={rowIndex}>

                    {/* Lista interna per le colonne */}
                    <ol>

                        {/* 
                          map sulle celle della riga:
                          - playerSymbol è 'X', 'O' o null
                          - colIndex è l'indice della colonna
                        */}
                        {row.map((playerSymbol, colIndex) => (
                            <li key={colIndex}>

                                {/* 
                                  Ogni cella è un bottone cliccabile.
                                  Passiamo rowIndex e colIndex usando
                                  una arrow function.
                                */}
                                <button
                                    onClick={() =>
                                        handleSelectSquare(rowIndex, colIndex)
                                    }
                                >
                                    {/* Mostriamo il simbolo del giocatore */}
                                    {playerSymbol}
                                </button>
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ol>
    );
}
