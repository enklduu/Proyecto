const getProduct = async (idProduct) => {
    const url = `http://127.0.0.1:8000/api/products/${idProduct}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {data};
    } catch (e) {
      console.error(e);
    }
  };
  export default getProduct;
