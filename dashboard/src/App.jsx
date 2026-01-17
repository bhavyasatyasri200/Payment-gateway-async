import { useState } from 'react';
import Webhooks from './pages/Webhooks';
import Docs from './pages/Docs';
import './App.css';

function App() {
  const [page, setPage] = useState('webhooks');

  return (
    <div id="root">
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('webhooks')}>Webhooks</button>
        <button onClick={() => setPage('docs')} style={{ marginLeft: '10px' }}>
          API Docs
        </button>
      </nav>

      {page === 'webhooks' && <Webhooks />}
      {page === 'docs' && <Docs />}
    </div>
  );
}

export default App;
