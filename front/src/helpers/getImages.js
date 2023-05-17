const getProducts = async (idProduct) => {
    const url = `https://fakestoreapi.com/products/${idProduct}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {data};
    } catch (e) {
      console.error(e);
    }
  };
  export default getProducts;
  