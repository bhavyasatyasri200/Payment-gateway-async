import { useState } from 'react';
import Webhooks from './pages/Webhooks';
import Docs from './pages/Docs';
import './App.css';
function App() {
  const [page, setPage] = useState('webhooks');

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <button onClick={() => setPage('webhooks')}>Webhooks</button>
        <button onClick={() => setPage('docs')} style={{ marginLeft: 10 }}>
          API Docs
        </button>
      </nav>

      {page === 'webhooks' && <Webhooks />}
      {page === 'docs' && <Docs />}
    </div>
  );
}


export default App;
