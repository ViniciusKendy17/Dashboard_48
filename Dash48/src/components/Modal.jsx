import useLocalStorage from "use-local-storage";
import "../assets/css/modal.css";
import { useEffect, useState } from "react";

export default function Modal({ quantAndar, andar, toggle }) {
  const [dados, setDados] = useLocalStorage("blocos", []);
  const index = andar - 1;

  
  // Localiza valor atual no array
  const corInicial =
    dados.find((item) => item.key === `Cor bloco ${andar}`)?.value || "0";

  const laminasIniciais = [1, 2, 3].map((n) => {
    const idx = index * 3 + (n - 1) + 1; // lamina 1 = bloco1 → Lamina 1, 2, 3; bloco2 → Lamina 4, 5, 6
    return dados.find((item) => item.key === `Lamina ${idx}`)?.value || "0";
  });

  const [cor, setCor] = useState(corInicial);
  const [laminas, setLaminas] = useState(laminasIniciais);


  /**
   * close modal
   * @param {*} e
   */
  const handleOverlayClick = (e) => {
    const form = document.getElementById("form");
    if (!form.contains(e.target)) toggle();
  };

  const handleCor = (e) => {
    const novaCor = e.target.value;
    setCor(novaCor);
    salvarBloco(novaCor, laminas);
  };

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

    // Atualiza ou adiciona cor
    const corKey = `Cor bloco ${andar}`;
    const corIdx = novosDados.findIndex((item) => item.key === corKey);
    if (corIdx !== -1) {
      novosDados[corIdx].value = corBloco;
    } else if (quantAndar == 1 && novosDados.length == 8) {
      dados.pop(dados[1]);
      dados.pop(dados[5]);
      dados.pop(dados[6]);
      dados.pop(dados[7]);
      setDados(dados);
    } else {
      novosDados.push({ key: corKey, value: corBloco });
    }

    // Atualiza ou adiciona lâminas
    for (let i = 0; i < 3; i++) {
      const laminaKey = `Lamina ${index * 3 + i + 1}`;
      const laminaIdx = novosDados.findIndex((item) => item.key === laminaKey);
      if (laminaIdx !== -1) {
        novosDados[laminaIdx].value = laminasBloco[i];
      } else {
        novosDados.push({ key: laminaKey, value: laminasBloco[i] });
      }
    }

    novosDados.sort((a, b) => {
      const ordem = (key) => {
        if (key.startsWith("Cor bloco")) {
          return parseInt(key.replace("Cor bloco ", ""));
        } else if (key.startsWith("Lamina")) {
          return 3 + parseInt(key.replace("Lamina ", ""));
        }
        return Infinity; // para chaves que não se encaixem
      };

      return ordem(a.key) - ordem(b.key);
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
            <option value="0"></option>
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
      </div>
    </div>
  );
}
