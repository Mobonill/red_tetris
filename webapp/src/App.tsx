// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </div>
        
    </>
  )
}

export default App
