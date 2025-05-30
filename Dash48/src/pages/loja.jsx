import { PedidoService } from "../services/PedidoService";
import "../assets/css/loja.css";

export default function Loja() {
  const teste = PedidoService();

  return (
    <>
      <div id="Loja">
        <h3>{teste}</h3>
      </div>
    </>
  );
}
