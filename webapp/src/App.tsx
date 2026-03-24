import { useState } from 'react';
import './App.css';
import Solo from "./solo.tsx";
import Multi from "./multi.tsx";

function App() {
    const [page, setPage] = useState('home');

    if (page === 'solo') {
        return <Solo onBack={() => setPage('home')} />;
    }
    if (page === 'multi') {
        return <Multi onBack={() => setPage('home')} />;
    }

    return (
        <div className="app-container">
            <div className="button-group">
                <button className="menu-button" onClick={() => setPage('solo')}>Solo</button>
                <button className="menu-button" onClick={() => setPage('multi')}>Create Room</button>
            </div>
        </div>
    );
}

export default App;