import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/css/loja.css";
import blnormal from "../assets/bloco/blocoCor0.png";
import Theme from "../services/SetTheme";
import useLocalStorage from "use-local-storage";
import Header from "../components/header";
import "../index.css";
import { useEffect, useState, useRef } from "react";
import Modal from "../components/Modal.jsx";
import { PedidoService } from "../services/PedidoService";

export default function Loja() {
  const [state, Setstate] = useLocalStorage("isDark", false);
  const [dados, Setdados] = useLocalStorage("blocos", []);
  const [andar, Setandar] = useState(1);
  const [modal, Setmodal] = useState(false);
  const [index, Setindex] = useState();

  const handleandar = (evt) => {
    Setandar(evt.target.value);
  };

  const tooglemodal = (index) => {
    Setmodal(!modal);
    Setindex(index);
  };

  const handlePedido = async () => {
    PedidoService(dados);
  };

  //http://192.168.2.181:5678/api/requisicoes/

  useEffect(() => {
    const dadosFiltrados = dados.filter((item) => {
      const corMatch = item.key.match(/^Cor bloco (\d+)$/);
      const laminaMatch = item.key.match(/^Lamina (\d+)$/);

      if (corMatch) {
        const blocoNum = parseInt(corMatch[1]);
        return blocoNum <= andar;
      }

      if (laminaMatch) {
        const laminaNum = parseInt(laminaMatch[1]);
        return laminaNum <= andar * 3;
      }

      return true;
    });

    if (dadosFiltrados.length !== dados.length) {
      Setdados(dadosFiltrados);
    }
  }, [andar]);

  const renderSlides = () => {
    const quantidade = parseInt(andar);
    if (!quantidade || quantidade < 1 || quantidade > 3) return [];

    return Array.from({ length: quantidade }, (_, index) => (
      <div
        onClick={() => tooglemodal(index)}
        id={`caixa${index + 1}`}
        className={`carousel-item ${
          index === 0 || (index === 0 && quantidade === 1) ? "active" : ""
        }`}
        key={index}
      >
        <img
          src={blnormal}
          className="d-block w-100"
          alt={`Bloco ${index + 1}`}
        />
        <p style={{ marginLeft: "15px" }}>Bloco {index + 1}</p>
      </div>
    ));
  };

  return (
    <>
      <div id="Loja" data-theme={state ? "dark" : ""}>
        <Header />

        <main id="loja-cont">
          <div id="out-select">
            <label htmlFor="">Quantidade de andares:</label>
            <select name="" id="" value={andar} onChange={handleandar}>
              <option value={1}>1 andar</option>
              <option value={2}>2 andares</option>
              <option value={3}>3 andares</option>
            </select>
          </div>

          <h5 style={{ marginTop: "-20px", fontSize: "16px" }}>
            Clique no bloco para editar
          </h5>

          <div
            key={andar}
            id="carouselExample"
            style={{ width: "100vw", height: "50%" }}
            className="carousel slide"
          >
            <div className="carousel-inner">{renderSlides()}</div>

            {andar > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>

                <button
                  class="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </main>

        <button onClick={handlePedido} className="btn btn-primary" id="revi">
          Revisar Pedido
        </button>
      </div>

      {modal && (
        <Modal
          andar={index + 1}
          quantAndar={andar}
          state={modal}
          toggle={tooglemodal}
        />
      )}
      <Theme toggle={() => Setstate(!state)} state={state} />
    </>
  );
}
