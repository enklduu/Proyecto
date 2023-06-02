import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { ProductsContext } from "../contexts/ProductsContext";

const Producto = ({ product }) => {
  const misProductos = useContext(ProductsContext);

  const [add, setAdd] = useState(false);

  const handleClick = () => {
    if(!add){
      misProductos.setProductos([ ...misProductos.productos, product ]);
    }else{
      misProductos.setProductos(misProductos.productos.filter(a=> a.id!==product.id));
    }
    add ? setAdd(false) : setAdd(true);
  };
  return (
    <Card style={{ width: "12rem" }} className="m-4 d-flex" key={product.id}>
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Link to={`/products/${product.id}`}>
          <Card.Img src={"images/products/"+product.img} width={200} height={280} />
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
