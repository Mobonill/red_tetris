import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Solo from "./pages/Solo";
import Multi from "./pages/Multi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/solo/:pseudo" element={<Solo />} />
      <Route path="/:roomName/:pseudo" element={<Multi />} />
    </Routes>
  );
}

export default App;
