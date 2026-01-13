// Importiamo ReactDOM nella versione "client": è l’entry point moderno per applicazioni React nel browser.
// Da React 18 in poi si usa createRoot() (non più ReactDOM.render()) per abilitare il nuovo rendering concorrente.
import ReactDOM from 'react-dom/client';

// Importiamo il componente App: è il componente “root” della nostra UI, quello che contiene tutto il resto.
import App from './App.jsx';

// Importiamo gli stili globali dell’app (CSS applicato a tutta la pagina o a molte parti dell’app).
import './index.css';

// 1) Prendiamo dal DOM l’elemento con id="root" (di solito definito in index.html).
// 2) Creiamo una “root” React collegata a quell’elemento.
// 3) Renderizziamo <App /> dentro quella root.
// Da qui in poi React gestisce aggiornamenti e re-render in base allo stato/props.
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(<App />);