import React, { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";


const Carrito = () => {
  const misProductos = useContext(ProductsContext);

  async function handleSubmit() {
    //añadir en firebase
    misProductos.productos.forEach(element => {
      // console.log(element);
    });
   };

  // console.log(misProductos.productos);
  // Tengo que confesar que he mirado ejercicios del año pasado para esta parte
  let total = misProductos.productos.reduce(
    (acumulador, actual) => acumulador + actual.price,
    0
  );
  return (
    <>
      <div>Productos: 🛒 </div>
      {misProductos.productos.map((producto) => (
        <li key={producto.id}>
          {producto.title} - {producto.price}€
        </li>
      ))}
      <div>Total - {total}€</div>
      <button onClick={() => handleSubmit()}>Pagar</button>
    </>
  );
};

export default Carrito;
