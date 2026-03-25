import { useState } from 'react';
import './App.css';
import Solo from "./solo.tsx";
import Multi from "./multi.tsx";

function App() {
    const [page, setPage] = useState('home');
    const [roomName, setRoomName] = useState('');

    if (page === 'solo') {
        return <Solo onBack={() => setPage('home')} />;
    }
    if (page === 'multi') {
        return <Multi onBack={() => setPage('home')} roomName={roomName} />;
    }

    return (
        <div className="app-container">
            <div className="button-group">
                <button className="menu-button" onClick={() => setPage('solo')}>Solo</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Room Name" 
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}/>
                    <button className="menu-button" onClick={() => {if (roomName.trim() !== '') {setPage('multi')}}}>Create Room</button>
                </div>
            </div>
        </div>
    );
}

export default App;