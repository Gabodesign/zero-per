// Importiamo useState da React.
// useState serve per gestire dati che cambiano nel tempo all'interno
// di un componente (stato locale).
import { useState } from "react";

// Esportiamo direttamente la funzione Player come default export.
// Player è un componente React che rappresenta un giocatore.
export default function Player({ initialName, symbol, isActive }) {

    // Stato che contiene il nome del giocatore.
    // initialName arriva come prop dal componente padre (App).
    // Lo copiamo nello stato perché vogliamo poterlo MODIFICARE.
    const [playerName, setPlayername] = useState(initialName);

    // Stato che indica se siamo in modalità "editing" o no.
    // false = stiamo solo visualizzando il nome
    // true  = stiamo modificando il nome
    const [isEditing, setIsEditing] = useState(false);

    // Questa funzione viene chiamata quando clicchiamo il bottone Edit/Save.
    function handleEditClick() {

        // Qui usiamo di nuovo la forma funzionale di setState.
        // "editing" è il valore attuale di isEditing.
        // Lo invertiamo: true diventa false, false diventa true.
        setIsEditing((editing) => !editing);
    }  

    // Questa funzione viene chiamata ogni volta che l'input cambia valore.
    function handleChange(event) {

        // event è l'evento del browser (SyntheticEvent di React).
        // Contiene TUTTE le info sull'interazione dell'utente.
        console.log(event);

        // event.target è l'input
        // event.target.value è il testo digitato dall'utente
        // Aggiorniamo lo stato con il nuovo nome
        setPlayername(event.target.value);
    }

    // Qui iniziamo con una variabile che conterrà JSX.
    // Di default mostriamo solo il nome del giocatore come testo.
    let editPlayerName = (
        <span className="player-name">{playerName}</span>
    );

    // Se siamo in modalità editing...
    if (isEditing) {

        // ...sostituiamo lo span con un input di testo.
        // defaultValue viene usato per inizializzare il valore dell'input.
        // onChange ascolta ogni modifica dell'utente.
        editPlayerName = (
            <input
                type="text"
                required
                defaultValue={playerName}
                onChange={handleChange}
            />
        );
    }

    // JSX che definisce l'output del componente
    return (
        // <li> rappresenta un giocatore nella lista.
        // Se isActive è true, aggiungiamo la classe 'active'
        // altrimenti non aggiungiamo nessuna classe.
        <li className={isActive ? 'active' : undefined}>

            {/* Contenitore del nome e del simbolo */}
            <span className="player">

              {/* Qui React renderizza o lo span o l'input */}
              {editPlayerName}

              {/* Simbolo del giocatore (X o O) */}
              <span className="player-symbol">{symbol}</span>
            </span>

            {/* 
              Bottone che cambia comportamento in base allo stato:
              - se isEditing è true → mostra "Save"
              - se isEditing è false → mostra "Edit"
            */}
            <button onClick={handleEditClick}>
                {isEditing ? 'Save' : 'Edit'}
            </button>
        </li>
    );
}
