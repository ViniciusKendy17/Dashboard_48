import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Loja from "./pages/loja.jsx";
import Index from "./pages/index.jsx";
import Historico from "./pages/Histórico.jsx";
import Acompanhar from "./pages/Acompanhamento.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index/>} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/acompanhar" element={<Acompanhar/>} />
          <Route />
        </Routes>
      </Router>
    </>
  );
}

export default App;
