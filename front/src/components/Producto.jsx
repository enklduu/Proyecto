import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { ProductsContext } from "../contexts/ProductsContext";
import ProductForm from "./ProductForm";

const Producto = ({ product, categories, setDelatador }) => {
  const misProductos = useContext(ProductsContext);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddToCart = (product) => {
    // Lógica para añadir el producto al carrito
    misProductos.setProductos(product);
    console.log("Producto añadido al carrito:", product);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(!showForm);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch("http://127.0.0.1:8000/api/products/"+product.id, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDelatador(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Card style={{ width: "12rem" }} className="m-4 d-flex" key={product.id}>
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Link to={`/products/${product.id}`}>
            <Card.Img
              src={"images/products/" + product.img}
              width={200}
              height={280}
            />
          </Link>
          <Card.Text className="">
            price: {product.price}{" "}
            {JSON.parse(localStorage.getItem("user")).roles.includes(
              "ROLE_ADMIN"
            ) ? (
              <>
                <button className="" onClick={() => handleEditProduct(product)}>
                  Edit
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </>
            ) : (
              <button className="" onClick={() => handleAddToCart(product)}>
                +
              </button>
            )}
          </Card.Text>

          {editingProduct &&
            JSON.parse(localStorage.getItem("user")).roles.includes(
              "ROLE_ADMIN"
            ) && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                show={showForm}
                setShow={setShowForm}
                setDelatador={setDelatador}
              />
            )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Producto;
