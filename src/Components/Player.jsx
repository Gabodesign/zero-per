// Importiamo useState: hook di React che ci permette di salvare e aggiornare stato locale nel componente.
// Quando lo stato cambia, React riesegue il render del componente per aggiornare l’interfaccia.
import { useState } from "react";

// Esportiamo il componente come default: chi importa questo file può scegliere il nome con cui importarlo.
// Questo componente rappresenta “la riga” di un giocatore (nome, simbolo, bottone Edit/Save).
export default function Player({ initialName, symbol, isActive, onChangeName }) {
  // Stato: nome del giocatore mostrato a schermo.
  // Lo inizializziamo con la prop initialName perché all’inizio arriva dal padre (App),
  // ma poi vogliamo poterlo cambiare localmente mentre l’utente scrive.
  const [playerName, setPlayername] = useState(initialName);

  // Stato: flag che controlla la UI “view mode” vs “edit mode”.
  // false => mostro testo; true => mostro input.
  const [isEditing, setIsEditing] = useState(false);

  // Handler del click sul bottone: alterna tra modalità Edit e Save.
  function handleEditClick() {
    // Aggiorniamo isEditing con la forma funzionale: React ci passa il valore precedente.
    // Questo evita bug quando più aggiornamenti avvengono vicini (stato non ancora “committato”).
    setIsEditing((editing) => !editing);

    // Se prima del click eravamo in editing, allora il bottone rappresenta “Save”.
    // Quindi notifichiamo il componente padre (App) del nuovo nome.
    //
    // Nota importante: isEditing qui è il valore “vecchio” (prima del setIsEditing),
    // ed è esattamente ciò che vogliamo per capire se stiamo salvando.
    if (isEditing) {
      // onChangeName è una callback passata dal padre: così il padre può aggiornare lo stato globale dei nomi.
      // Passiamo:
      // - symbol ('X' o 'O') per sapere quale giocatore stiamo modificando
      // - playerName che è il valore corrente in stato
      onChangeName(symbol, playerName);
    }
  }

  // Handler dell’input: viene chiamato ad ogni digitazione (evento onChange).
  function handleChange(event) {
    // event è un SyntheticEvent di React: wrapper cross-browser dell’evento del DOM.
    // Stampiamo in console solo per debug (in produzione lo rimuoverei).
    console.log(event);

    // Aggiorniamo lo stato con il valore digitato nell’input.
    // event.target è l’input, event.target.value è la stringa corrente.
    setPlayername(event.target.value);
  }

  // Prepariamo un “pezzo di UI” in una variabile: ci serve per renderizzare in modo condizionale
  // (testo quando non editiamo, input quando editiamo) senza duplicare troppo JSX nel return.
  let editPlayerName = (
    // In modalità non-edit mostriamo il nome come semplice testo.
    <span className="player-name">{playerName}</span>
  );

  // Se siamo in modalità editing, sostituiamo lo span con un input.
  if (isEditing) {
    editPlayerName = (
      <input
        // Input di testo per modificare il nome.
        type="text"
        // required: il browser considera il campo obbligatorio (utile in form),
        // ma qui non stiamo usando un submit, quindi ha effetto limitato.
        required
        // defaultValue rende l’input “uncontrolled” (gestito dal DOM) con valore iniziale.
        // Noi comunque ascoltiamo onChange e aggiorniamo lo stato.
        // Alternativa più “React style”: usare value={playerName} (controlled input).
        defaultValue={playerName}
        // onChange viene chiamato ad ogni modifica (digitazione, incolla, ecc.).
        onChange={handleChange}
      />
    );
  }

  // Return JSX: descrive esattamente cosa React deve mostrare.
  return (
    // Ogni Player è un <li> dentro una lista <ol>.
    // className condizionale: se il giocatore è attivo aggiungiamo 'active', altrimenti niente.
    // undefined è un modo pulito per “non mettere” la classe.
    <li className={isActive ? "active" : undefined}>
      {/* Contenitore che raggruppa nome + simbolo (utile per layout/CSS). */}
      <span className="player">
        {/* Qui React inserisce o <span> o <input> in base a isEditing. */}
        {editPlayerName}

        {/* Simbolo fisso del giocatore (X o O). */}
        <span className="player-symbol">{symbol}</span>
      </span>

      {/* Bottone: in base a isEditing cambia etichetta e significato (Edit vs Save). */}
      <button onClick={handleEditClick}>
        {/* Se stiamo editando, il click equivale a salvare; altrimenti equivale a entrare in edit. */}
        {isEditing ? "Save" : "Edit"}
      </button>
    </li>
  );
}