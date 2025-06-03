export const PedidoService = async (dados) => {
  const pedido = JSON.stringify({
    code: "",
    productId: "",
    priority: "",
    productionLineId: "",
    dueDate: "",
    parameters: dados,
  });

  console.log(pedido);

  const res = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: pedido,
  });
  const data = await res.json();
};
