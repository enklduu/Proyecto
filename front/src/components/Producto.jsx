/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from "react";
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
        // console.log(data);
        setDelatador(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card m-auto" style={{ width: "18rem" }}>
      <img
        className="card-img-top img-fluid"
        src={"../images/products/" + product.img}
        alt="Product"
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">{product.description}</p>
      </div>
      <div className="card-footer">
        {JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") ? (
          <div>
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                id="file-input"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="btn btn-primary">
                Cambiar Imagen
              </label>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleEditProduct(product)}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="file-input-container">
            <button
              className="btn btn-primary"
              onClick={() => handleAddToCart(product)}
            >
              +
            </button>
          </div>
        )}
        {editingProduct &&
          JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") && (
            <ProductForm
              product={editingProduct}
              categories={categories}
              show={showForm}
              setShow={setShowForm}
              setDelatador={setDelatador}
            />
          )}
      </div>
    </div>
  );
};

export default Producto;
