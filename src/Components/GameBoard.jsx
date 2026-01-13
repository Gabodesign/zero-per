// GameBoard è un componente “presentational”: non mantiene lo stato della griglia.
// Riceve tutto dal padre (App) tramite props:
// - board: matrice 3x3 con 'X' | 'O' | null (stato corrente della griglia)
// - onSelectSquare: callback da chiamare quando l’utente clicca una casella (row, col)
export default function GameBoard({ onSelectSquare, board }) {
  // Nota “da senior”:
  // Qui non usiamo useState per la griglia perché la griglia viene DERIVATA in App da gameTurns.
  // Questo evita “stato duplicato” (avere sia gameTurns che gameBoard in state),
  // che spesso porta a bug di sincronizzazione.

  return (
    // Lista esterna: rappresenta le righe del tabellone.
    // Usiamo <ol> perché è comodo per layout e styling, non perché sia obbligatorio.
    <ol id="game-board">
      {/* 
        Renderizziamo le righe con map:
        - row è un array (una riga della griglia)
        - rowIndex è l’indice della riga (0..2)
      */}
      {board.map((row, rowIndex) => (
        // key: per React ogni elemento di una lista deve avere una chiave stabile.
        // Qui rowIndex va bene perché la dimensione/ordine delle righe è fissa e non cambia mai.
        <li key={rowIndex}>
          {/* Lista interna: rappresenta le colonne (celle) di quella riga */}
          <ol>
            {/*
              Renderizziamo le celle della riga:
              - playerSymbol è il contenuto della cella: 'X', 'O' oppure null
              - colIndex è l’indice colonna (0..2)
            */}
            {row.map((playerSymbol, colIndex) => (
              // Anche qui la key può essere colIndex perché l’ordine delle colonne è fisso.
              <li key={colIndex}>
                {/*
                  Ogni cella è un <button> per due motivi:
                  1) Accessibilità: un bottone è naturalmente cliccabile e “focusabile” da tastiera
                  2) Semantica: è un’azione (selezionare una casella)
                */}
                <button
                  // Usiamo una arrow function perché dobbiamo passare argomenti al click handler.
                  // Se scrivessimo onClick={onSelectSquare(rowIndex, colIndex)} lo chiameremmo SUBITO al render.
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  // Disabilitiamo il bottone quando la cella è già occupata.
                  // playerSymbol !== null significa: c’è già 'X' oppure 'O' in quella casella.
                  disabled={playerSymbol !== null}
                >
                  {/* Mostriamo a schermo il contenuto della cella (X/O). Se è null, non mostra nulla. */}
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