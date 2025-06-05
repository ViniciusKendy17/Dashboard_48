import { useNavigate } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import "../assets/css/loja.css";

//Blocos
import blnormal from "../assets/bloco/blocoCor0.png";
import blpreto from "../assets/bloco/blocoCor1.png";
import blvermelho from "../assets/bloco/blocoCor2.png";
import blazul from "../assets/bloco/BlocoCor3.png";

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
import Theme from "../services/SetTheme";
import useLocalStorage from "use-local-storage";
import Header from "../components/header";
import Modal from "../components/Modal.jsx";

export default function Loja() {
  const [state, Setstate] = useLocalStorage("isDark", false);
  const [dados, Setdados] = useLocalStorage("blocos", []);
  const [andar, Setandar] = useLocalStorage("andar", 1);
  const [modal, Setmodal] = useState(false);
  const [index, Setindex] = useState();
  const [andarAnterior, setAndarAnterior] = useState(andar);
  const [posicoes, Setposicoes] = useState([]);

  const navaigate = useNavigate();
  const home = () => {
    Setdados([]);
    Setandar(1);
    navaigate("/");
  };

  const handleandar = (evt) => {
    Setandar(evt.target.value);
  };

  const tooglemodal = (index) => {
    Setmodal(!modal);
    Setindex(index);
  };

  const handlePedido = async () => {
    navaigate("/confirmar");
  };

  /**
   * Pega todas as posições e suas respectivas cores disponveis
   */
  async function getPosicoes() {
    try {
      const res = await fetch("http://192.168.2.109:1881/api/blocks");
      const data = await res.json();
      Setposicoes(data);
    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    getPosicoes();
  }, []);

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

  /**
   * Pega a imagem da lamina com sua respectiva cor
   * @param {*} posicao
   * @param {*} value
   * @returns
   */
  function getLaminaImage(posicao, value) {
    return laminasImgs[posicao]?.[value] || null;
  }

  /**
   * Retorna todas as cores escolhidas pelo usuario
   */
  const cores = dados.filter((item) => {
    const cor = item.key.match(/^Cor bloco (\d+)$/);
    return cor;
  });

  /**
   * Pega todas as laminas que o usuario escolheu
   */
  const laminas = dados.filter((item) => {
    const lamina = item.key.match(/^Lamina (\d+)$/);
    return lamina;
  });

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

  useEffect(() => {
    if (posicoes.length === 0) return; // só roda se tiver dados em posicoes

    let novosDados = [...dados];

    for (let a = 1; a <= andar; a++) {
      const corKey = `Cor bloco ${a}`;
      const posicaoKey = `Posicao estoque ${a}`;

      // Define cor preta se não existir
      if (!novosDados.some((item) => item.key === corKey)) {
        novosDados.push({ key: corKey, value: "1" }); // Cor preta padrão
      }

      // Se não existe posição, acha uma posição válida para a cor preta (1)
      if (!novosDados.some((item) => item.key === posicaoKey)) {
        const posicoesValidas = posicoes.filter(
          (p) => p.storageId === 1 && p.color === 1 // só cor preta
        );

        // Precisa garantir que essa posição não está já usada
        // Coleta posições já usadas nos blocos (existentes)
        const posicoesUsadas = novosDados
          .filter((item) => item.key.startsWith("Posicao estoque"))
          .map((item) => item.value);

        // Encontra a primeira posição válida da cor preta que não está usada ainda
        const posicaoDisponivel = posicoesValidas.find(
          (p) => !posicoesUsadas.includes(p.position)
        );

        if (posicaoDisponivel) {
          novosDados.push({
            key: posicaoKey,
            value: posicaoDisponivel.position,
          });
        } else {
          novosDados.push({ key: posicaoKey, value: "0" });
          alert(`Não há posição disponível para o bloco ${a} com cor preta.`);
        }
      }

      // Checa lâminas e padrão de lâminas
      for (let i = 0; i < 3; i++) {
        const laminaIndex = (a - 1) * 3 + i + 1;
        const laminaKey = `Lamina ${laminaIndex}`;
        const padraoLaminaKey = `Padrao Lamina ${laminaIndex}`;

        if (!novosDados.some((item) => item.key === laminaKey)) {
          novosDados.push({ key: laminaKey, value: "0" });
        }

        if (!novosDados.some((item) => item.key === padraoLaminaKey)) {
          novosDados.push({ key: padraoLaminaKey, value: "0" });
        }
      }
    }

    //Ordena as informações na ordem que a api pede
    novosDados.sort((a, b) => {
      const getOrder = (key) => {
        if (key.startsWith("Posicao estoque "))
          return 0 + parseInt(key.replace("Posicao estoque", ""));
        if (key.startsWith("Cor bloco"))
          return 20 + parseInt(key.replace("Cor bloco ", ""));
        if (key.startsWith("Lamina"))
          return 40 + parseInt(key.replace("Lamina ", ""));
        if (key.startsWith("Padrao Lamina"))
          return 60 + parseInt(key.replace("Padrao Lamina ", ""));
      };
      return getOrder(a.key) - getOrder(b.key);
    });

    if (JSON.stringify(novosDados) !== JSON.stringify(dados)) {
      Setdados(novosDados);
    }
  }, [andar, posicoes]);

  //Retira informações de blocos que foram retiradas por causa do select de andares
  useEffect(() => {
    if (andar < andarAnterior) {
      const dadosFiltrados = dados.filter((item) => {
        const corMatch = item.key.match(/^Cor bloco (\d+)$/);
        const laminaMatch = item.key.match(/^Lamina (\d+)$/);
        const posicao = item.key.match(/^Posicao estoque (\d+)$/);
        const padrao_lamina = item.key.match(/^Padrao Lamina (\d+)$/);

        if (corMatch) {
          const blocoNum = parseInt(corMatch[1]);
          return blocoNum <= andar;
        }

        if (laminaMatch) {
          const laminaNum = parseInt(laminaMatch[1]);
          return laminaNum <= andar * 3;
        }

        if (posicao) {
          const posicaonum = parseInt(posicao[1]);
          return posicaonum <= andar;
        }

        if (padrao_lamina) {
          const padraonum = parseInt(padrao_lamina[1]);
          return padraonum <= andar * 3;
        }

        return true;
      });

      Setdados(dadosFiltrados);
    }

    setAndarAnterior(andar);
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
          src={imagem(index)}
          className="d-block w-100"
          alt={`Bloco ${index + 1}`}
        />
        {[0, 2, 1].map((lado) => {
          const lamina = laminas[index * 3 + lado];
          if (!lamina) return null;

          const cor = parseInt(lamina.value); // ex: 1 a 6
          const posicao = lado + 1; // lado 0 → 1 (esquerdo), 1 → 2 (meio), 2 → 3 (direito)
          const imgSrc = getLaminaImage(posicao, cor);

          return imgSrc ? (
            <img
              id="lamina"
              key={lado}
              src={imgSrc}
              className="d-block w-100"
              alt={`Lâmina ${posicao}`}
            />
          ) : null;
        })}

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
            <select
              name=""
              id=""
              value={andar}
              style={{ border: "none" }}
              onChange={handleandar}
            >
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
          posicoes={posicoes}
          quantAndar={andar}
          state={modal}
          toggle={tooglemodal}
        />
      )}
      <Theme toggle={() => Setstate(!state)} state={state} />

      <svg
        style={{ color: "#3cb41b" }}
        id="bhome"
        onClick={home}
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
    </>
  );
}
