// Esportiamo il componente Log come default export.
// Questo componente ha una responsabilità semplice: renderizzare la lista delle mosse effettuate.
export default function Log({ turns }) {
  // Il componente è “presentational”: non gestisce stato, riceve tutto via props (turns).
  return (
    // <ol> (ordered list) perché ha senso mostrare un elenco ordinato di azioni.
    <ol id="log">
      {/* 
        turns.map(...) trasforma l’array di turni in un array di <li>.
        In React questo è il modo standard per “renderizzare una lista”.
      */}
      {turns.map((turn) => (
        // key: serve a React per identificare in modo stabile ogni elemento della lista tra un render e l’altro.
        // Qui la key è composta da row+col (es. "02" per riga 0 col 2).
        // Va bene SOLO se sei sicuro che la stessa casella non venga mai selezionata due volte.
        // In caso di refactor o bug, una key non unica crea comportamenti strani (riuso sbagliato di DOM).
        <li key={`${turn.square.row}${turn.square.col}`}>
          {/* Testo leggibile che descrive la mossa */}
          {turn.player} selected {turn.square.row}, {turn.square.col}
        </li>
      ))}
    </ol>
  );
}