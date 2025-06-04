export const PosicoesService = async () => {
  try {
    const res = await fetch("http://192.168.2.109:1881/api/blocks", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
