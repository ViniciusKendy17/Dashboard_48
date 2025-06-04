import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Loja from "./pages/loja.jsx";
import Index from "./pages/index.jsx";
import Historico from "./pages/Histórico.jsx";
import Acompanhar from "./pages/Acompanhamento.jsx";
import Confirmar from "./pages/ConfirmarPedido.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index/>} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/confirmar" element={<Confirmar />} />
          <Route path="/acompanhar" element={<Acompanhar/>} />
          <Route />
        </Routes>
      </Router>
    </>
  );
}

export default App;
