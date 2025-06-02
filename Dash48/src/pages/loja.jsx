import { PedidoService } from "../services/PedidoService";
import "../assets/css/loja.css";
import Theme from "../services/SetTheme";
import useLocalStorage from "use-local-storage";
import Header from "../components/header";
import "../index.css";

export default function Loja() {
  const teste = PedidoService();
  const [state, Setstate] = useLocalStorage("isDark", false);

  return (
    <>
      <div id="Loja" data-theme={state ? "dark" : ""}>
        <Header />

        

      </div>

      <Theme toggle={() => Setstate(!state)} state={state} />
    </>
  );
}
