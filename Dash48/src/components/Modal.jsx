import useLocalStorage from "use-local-storage";
import "../assets/css/modal.css";
import { useEffect, useState } from "react";
import { PedidoService } from "../services/PedidoService";

export default function Modal({ posicoes, andar, toggle }) {
  const [dados, setDados] = useLocalStorage("blocos", []);
  const index = andar - 1;

  const coresBlocos = dados.filter((item) => {
    const cor = item.key.match(/^Cor bloco (\d+)$/);
    return cor;
  });

  // Localiza valor atual no array
  const corInicial =
    dados.find((item) => item.key === `Cor bloco ${andar}`)?.value || "0";

  const [cor, setCor] = useState(corInicial);

  const laminasIniciais = [1, 2, 3].map((n) => {
    const idx = index * 3 + (n - 1) + 1; // lamina 1 = bloco1 → Lamina 1, 2, 3 bloco2 → Lamina 4, 5, 6
    return dados.find((item) => item.key === `Lamina ${idx}`)?.value || "0";
  });

  const [laminas, setLaminas] = useState(laminasIniciais);

  /**
   * close modal
   * @param {*} e
   */
  const handleOverlayClick = (e) => {
    const form = document.getElementById("form");
    if (!form.contains(e.target)) toggle();
  };

  /**
   * Defini as cor para o bloco e salva localmente
   * @param {*} e
   */
  const handleCor = (e) => {
    const novaCor = e.target.value;
    setCor(novaCor);
    salvarBloco(novaCor, laminas);
  };

  /**
   * Defini as lamina (todos os lados) para o bloco e salva localmente
   * @param {*} idx
   * @param {*} value
   */
  const handleLamina = (idx, value) => {
    const novasLaminas = [...laminas];
    novasLaminas[idx] = value;
    setLaminas(novasLaminas);
    salvarBloco(cor, novasLaminas);
  };

  /**
   * Salva o bloco da pior maneira possivel
   * @param {*} corBloco
   * @param {*} laminasBloco
   */
  const salvarBloco = (corBloco, laminasBloco) => {
    let novosDados = [...dados];

    console.log(corBloco);

    // Atualiza ou adiciona cor
    const corKey = `Cor bloco ${andar}`;

    const corIdx = novosDados.findIndex((item) => item.key === corKey);
    if (corIdx !== -1) {
      novosDados[corIdx].value = corBloco;
    } else {
      novosDados.push({ key: corKey, value: corBloco });
    }

    // Atualiza ou adiciona lâminas
    for (let i = 0; i < 3; i++) {
      const laminaKey = `Lamina ${index * 3 + i + 1}`;
      const padrao_laminaKey = `Padrao Lamina ${index * 3 + i + 1}`;

      const laminaIdx = novosDados.findIndex((item) => item.key === laminaKey);
      if (laminaIdx !== -1) {
        novosDados[laminaIdx].value = laminasBloco[i];
      } else {
        novosDados.push({ key: laminaKey, value: laminasBloco[i] });
        novosDados.push({ key: padrao_laminaKey, value: "0" });
      }
    }

    //Adicona a posicao de cada bloco e sua devida cor
    if (posicoes.length === 0 || coresBlocos.length === 0) return;

    const posicoesValidas = posicoes.filter(
      (p) => p.storageId === 1 && p.color !== 0
    );

    // blocos com a mesma cor
    const blocosComMesmaCor = dados.filter((item) => {
      const match = item.key.match(/^Cor bloco (\d+)$/);
      return match && item.value === corBloco;
    });

    // Pega os índices desses blocos
    const indicesComMesmaCor = blocosComMesmaCor.map((item) =>
      parseInt(item.key.replace("Cor bloco ", ""))
    );

    // Acha posições já usadas por blocos com essa cor
    const posicoesJaUsadas = dados
      .filter((item) => {
        if (!item.key.startsWith("Posicao estoque")) return false;
        const idx = parseInt(item.key.replace("Posicao estoque ", ""));
        return indicesComMesmaCor.includes(idx);
      })
      .map((item) => item.value);

    // Acha uma posição válida livre pra essa cor
    const posicao_atual = posicoesValidas.find(
      (item) =>
        item.color === parseInt(corBloco) &&
        !posicoesJaUsadas.includes(item.position)
    );

    const posicaoKey = `Posicao estoque ${andar}`;
    const posicao_idx = novosDados.findIndex((item) => item.key === posicaoKey);

    const posicaoAtualSalva =
      posicao_idx !== -1 ? novosDados[posicao_idx].value : null;

    // Só altera se a posição atual salva não for mais válida
    const posicaoAindaValida =
      posicaoAtualSalva &&
      posicoesValidas.some(
        (item) =>
          item.color === parseInt(corBloco) &&
          item.position === posicaoAtualSalva
      );

    if (!posicaoAindaValida) {
      if (posicao_atual) {
        if (posicao_idx !== -1) {
          novosDados[posicao_idx].value = posicao_atual.position;
        } else {
          novosDados.push({
            key: posicaoKey,
            value: posicao_atual.position,
          });
        }
      } else {
        alert("Sem posição disponível pra essa cor de bloco kkkkk");
      }
    }

    novosDados.sort((a, b) => {
      const getOrder = (key) => {
        if (key.startsWith("Posicao estoque")) {
          return 0 + parseInt(key.replace("Posicao estoque ", ""));
        } else if (key.startsWith("Cor bloco")) {
          return 20 + parseInt(key.replace("Cor bloco ", ""));
        } else if (key.startsWith("Lamina")) {
          return 40 + parseInt(key.replace("Lamina ", ""));
        } else if (key.startsWith("Padrao Lamina")) {
          return 60 + parseInt(key.replace("Padrao Lamina ", ""));
        } else {
          return 90; //
        }
      };

      return getOrder(a.key) - getOrder(b.key);
    });

    setDados(novosDados);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div id="form">
        <h3>Editar andar: {andar}</h3>

        <div className="modal-out-select">
          <label>Cor do bloco</label>
          <select value={cor} onChange={handleCor}>
            <option value="1">Preto</option>
            <option value="2">Vermelho</option>
            <option value="3">Azul</option>
          </select>
        </div>

        <div id="out-lamina">
          {laminas.map((val, idx) => (
            <div className="modal-out-select" key={idx}>
              <label>Lâmina {idx + 1}</label>
              <select
                value={val}
                onChange={(e) => handleLamina(idx, e.target.value)}
              >
                <option value="0"></option>
                <option value="1">Vermelho</option>
                <option value="2">Azul</option>
                <option value="3">Amarelo</option>
                <option value="4">Verde</option>
                <option value="5">Preto</option>
                <option value="6">Branco</option>
              </select>
            </div>
          ))}
        </div>

        <svg
          onClick={toggle}
          id="close"
          style={{ color: "red" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-x-square-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
        </svg>
      </div>
    </div>
  );
}
