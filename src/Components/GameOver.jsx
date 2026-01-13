// Esportiamo il componente GameOver come default export.
// Responsabilità: mostrare la schermata di fine partita e offrire un bottone per ricominciare.
export default function GameOver({ winner, onRestart }) {
  return (
    // Contenitore principale: l'id serve tipicamente per stile CSS e/o test.
    <div id="game-over">
      {/* Titolo fisso della schermata */}
      <h2>Game Over!</h2>

      {/* 
        Rendering condizionale:
        - Se winner esiste (stringa non vuota), mostriamo il messaggio di vittoria.
        In React: `winner && <p>...</p>` significa "se winner è truthy, renderizza il <p>".
      */}
      {winner && <p>{winner} won!</p>}

      {/* 
        Caso complementare:
        - Se winner NON esiste (undefined/null/''), allora è un pareggio.
        Qui usiamo `!winner` per renderizzare il messaggio di draw.
      */}
      {!winner && <p>It&apos;s a Draw!</p>}

      {/* Wrapper solo per layout: mette il bottone su una riga/paragrafo separato */}
      <p>
        {/* 
          Callback passata dal padre:
          - onRestart tipicamente azzera lo stato (es. gameTurns = [])
          - Non la invochiamo qui con parentesi: passiamo la funzione, React la chiamerà al click.
        */}
        <button onClick={onRestart}>Rematch!</button>
      </p>
    </div>
  );
}