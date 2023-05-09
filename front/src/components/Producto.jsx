import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { ProductsContext } from "../contexts/ProductsContext";

const Producto = ({ product }) => {
  const misProductos = useContext(ProductsContext);

  const [add, setAdd] = useState(false);

  const handleClick = () => {
    if(!add){
      // console.log("Entro");
      misProductos.setProductos([ ...misProductos.productos, product ]);
    }else{
      misProductos.setProductos(misProductos.productos.filter(a=> a.id!==product.id));
    }
      // console.log(misProductos.productos);
    add ? setAdd(false) : setAdd(true);
  };
  // console.log(data);
  return (
    <Card style={{ width: "12rem" }} className="m-4 d-flex" key={product.id}>
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Link to={`/${product.id}`}>
          <Card.Img src={product.image} width={200} height={280} />
        </Link>
        <Card.Text className="">
          price: {product.price}{" "}
          <button onClick={() => handleClick()}>{add ? "✔" : "➕"}</button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Producto;
