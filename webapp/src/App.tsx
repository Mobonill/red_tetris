import { useState } from 'react';
import './App.css';
import Solo from "./solo.tsx";
import Multi from "./multi.tsx";

function App() {
    const [page, setPage] = useState('home');
    const [pseudo, setPseudo] = useState('');
    const [roomName, setRoomName] = useState('');

    if (page === 'solo') {
        return <Solo onBack={() => setPage('home')} pseudo={pseudo} />;
    }
    if (page === 'multi') {
        return <Multi onBack={() => setPage('home')} pseudo={pseudo} roomName={roomName} />;
    }

    return (
        <div className="app-container">
            <div className="button-group">
                <input 
                    type="text" 
                    placeholder="Player Pseudo" 
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}/>
                <button className="menu-button" onClick={() => {
                        if (pseudo.trim() !== '') {setPage('solo');}
                        else {alert("Enter pseudo");}}}>Solo</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Room Name" 
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}/>
                    <button className="menu-button" onClick={() => {
                        if (pseudo.trim() !== '' && roomName.trim() !== '') {setPage('multi');}
                        else {alert("Enter pseudo and room name");}}}>Create Room</button>
                </div>
            </div>
        </div>
    );
}

export default App;