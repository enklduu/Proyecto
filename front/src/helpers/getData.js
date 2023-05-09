const getData = async () => {
    const url = "https://fakestoreapi.com/products";
      try {
        const response = await fetch(url);
        // console.log(response);
        // const data = await response.json();
        // console.log(data);
        // return data;
        return response;
      } catch (e) {
        console.error(e);
      }
      
    };
export default getData;