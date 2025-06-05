export const PedidoService = async (dados, andar, id, navigate) => {
  const hoje = new Date();
  const isotime = hoje.toISOString();
  const parametros = Array.from(dados);
  parametros.push({ key: "Andares", value: andar });
  parametros.push({ key: "Posicao expedicao", value: "0" });

  const pedido = {
    code: id.op,
    productId: "1",
    priority: "0",
    productionLineId: "1",
    dueDate: isotime,
    parameters: parametros,
  };

  try {
    const res = await fetch("http://192.168.2.109:1881/pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });

    if (res.status == 201) {
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
  }
};
