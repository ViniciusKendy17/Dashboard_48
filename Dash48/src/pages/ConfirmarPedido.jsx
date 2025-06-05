import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import useLocalStorage from "use-local-storage";
import "../assets/css/confirmar.css";
import { PedidoService } from "../services/PedidoService.jsx";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import blpreto from "../assets/bloco/blocoCor1.png";
import blvermelho from "../assets/bloco/blocoCor2.png";
import blazul from "../assets/bloco/BlocoCor3.png";

//Tampa
import tampa from "../assets/bloco/Tampa.png";

// Lado esquerdo
import lamina1_1 from "../assets/laminas/lamina1-1.png";
import lamina1_2 from "../assets/laminas/lamina1-2.png";
import lamina1_3 from "../assets/laminas/lamina1-3.png";
import lamina1_4 from "../assets/laminas/lamina1-4.png";
import lamina1_5 from "../assets/laminas/lamina1-5.png";
import lamina1_6 from "../assets/laminas/lamina1-6.png";

//Meio
import lamina2_1 from "../assets/laminas/lamina2-1.png";
import lamina2_2 from "../assets/laminas/lamina2-2.png";
import lamina2_3 from "../assets/laminas/lamina2-3.png";
import lamina2_4 from "../assets/laminas/lamina2-4.png";
import lamina2_5 from "../assets/laminas/lamina2-5.png";
import lamina2_6 from "../assets/laminas/lamina2-6.png";

//Direito
import lamina3_1 from "../assets/laminas/lamina3-1.png";
import lamina3_2 from "../assets/laminas/lamina3-2.png";
import lamina3_3 from "../assets/laminas/lamina3-3.png";
import lamina3_4 from "../assets/laminas/lamina3-4.png";
import lamina3_5 from "../assets/laminas/lamina3-5.png";
import lamina3_6 from "../assets/laminas/lamina3-6.png";
import { useEffect, useState } from "react";
import Toast from "../components/toast.jsx";

export default function Confirmar() {
  const navigate = useNavigate();
  const [dados, Setdados] = useLocalStorage("blocos", []);
  const [andar, SetAndar] = useLocalStorage("andar", 0);
  const [state, Setstate] = useLocalStorage("isDark", 0);
  const [margin, Setmargin] = useState("");
  const [id, Setid] = useState(0);
  const [toast, Settoast] = useState();
  const[type,Settype] = useState()
  const[message,Setmessage] = useState()

  const editar = () => {
    navigate("/loja");
  };

  const toggle = () => {
    Settoast(!toast);
  };

  /**
   * Pega o id gerado pela api (id para cada pedido)
   */
  async function getOp() {
    const res = await fetch("http://192.168.2.109:1881/op");
    const data = await res.json();
    Setid(data);
  }

  useEffect(() => {
    getOp();
  }, []);

  /**
   * Realiza um pedido e retorna o toast
   */
  const pedir = () => {
    const sucesso = PedidoService(dados, andar, id, navigate);
    if (sucesso) {
      // alert("Pedido criado com sucesso");
      Setmessage("Pedido criado com sucesso")
      Settype("success")
      Settoast(true);
    }
    else{
      Setmessage("Coloque caixas com outras cores")
      Settype("danger")
      Settoast(true);
    }
  };

  const laminasImgs = {
    1: {
      1: lamina1_1,
      2: lamina1_2,
      3: lamina1_3,
      4: lamina1_4,
      5: lamina1_5,
      6: lamina1_6,
    },
    2: {
      1: lamina2_1,
      2: lamina2_2,
      3: lamina2_3,
      4: lamina2_4,
      5: lamina2_5,
      6: lamina2_6,
    },
    3: {
      1: lamina3_1,
      2: lamina3_2,
      3: lamina3_3,
      4: lamina3_4,
      5: lamina3_5,
      6: lamina3_6,
    },
  };

  //Pega as cores de cada bloco
  const cores = dados.filter((item) => {
    const cor = item.key.match(/^Cor bloco (\d+)$/);
    return cor;
  });

  /**
   * Pega a imagem da lamina 
   * @param {*} posicao 
   * @param {*} value 
   * @returns 
   */
  function getLaminaImage(posicao, value) {
    return laminasImgs[posicao]?.[value] || null;
  }

  const imagem = (index) => {
    const cor = cores[index]?.value;

    switch (cor) {
      case "1":
        return blpreto;
      case "2":
        return blvermelho;
      case "3":
        return blazul;
      default:
        return blpreto;
    }
  };

  /**
   * Retorna todas as laminas escolhidas pelo usuario
   */
  const laminas = dados.filter((item) => {
    const lamina = item.key.match(/^Lamina (\d+)$/);
    return lamina;
  });

  const renderSlides = () => {
    const quantidade = parseInt(andar);
    if (!quantidade || quantidade < 1) return null;

    return Array.from({ length: quantidade }, (_, index) => (
      <div
        id={`bloco${index + 1}`}
        key={index}
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {/* Imagem do bloco (estrutura/base) */}
        <img
          src={imagem(index)}
          style={{ width: "100%", height: "100%" }}
          alt={`Bloco ${index + 1}`}
        />

        {/* Lâminas sobre o bloco */}
        {[0, 2, 1].map((lado) => {
          const lamina = laminas[index * 3 + lado];
          if (!lamina) return null;

          const cor = parseInt(lamina.value);
          const posicao = lado + 1;
          const imgSrc = getLaminaImage(posicao, cor);

          return imgSrc ? (
            <img
              key={lado}
              src={imgSrc}
              alt={`Lâmina ${posicao}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                pointerEvents: "none",
              }}
            />
          ) : null;
        })}
      </div>
    ));
  };

  return (
    <>
      <div id="confirm" data-theme={state ? "dark" : ""}>
        <Header />

        <main
          id="blocotodo"
          style={{ position: "relative", width: "fit-content" }}
        >
          <img
            src={tampa}
            alt="Tampa"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              marginTop: "20px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
          {renderSlides()}
        </main>
        <button
          className="btn btn-primary"
          id="final"
          style={{ marginTop: "10px" }}
          onClick={pedir}
        >
          Confirmar Pedido
        </button>
      </div>
      <svg
        style={{ color: "#3cb41b" }}
        id="bhome"
        onClick={editar}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        class="bi bi-arrow-left-circle"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
        />
      </svg>

      {toast && (
        <Toast
          className="toast"
          state={toast}
          message={message}
          toggle={toggle}
          type={type}
        />
      )}

    </>
  );
}
