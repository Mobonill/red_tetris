// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './solo.css'
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"

function Solo() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Game mode="solo" pseudo="aa"/>} />
        </Routes>
      </div>
        
    </>
  )
}

export default Solo
