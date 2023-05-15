const getData = async () => {
    const url = "https://fakestoreapi.com/products";
      try {
        const response = await fetch(url);
        return response;
      } catch (e) {
        console.error(e);
      }
      
    };
export default getData;