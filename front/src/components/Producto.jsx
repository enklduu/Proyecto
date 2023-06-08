/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";

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

    fetch("http://127.0.0.1:8000/api/products/" + product.id, {
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
    <div
      className="card m-auto container-fluid reset-padding"
      style={{ width: "18rem" }}
    >
      <Link to={"/products/" + product.id}>
        <img
          className="card-img-top img-fluid"
          src={"../images/products/" + product.img}
          alt="Product"
          style={{ objectFit: "cover", height: "200px" }}
        />
      </Link>
      <div className="card-body border-top">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">{product.description}</p>
      </div>
      <div className="card-footer">
        {JSON.parse(localStorage.getItem("user")).roles.includes(
          "ROLE_ADMIN"
        ) ? (
          <div className=" d-flex">
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                id="file-input"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="btn btn-primary m-1">
                Cambiar Imagen
              </label>
            </div>
            <button
              className="btn btn-primary flex-grow-1 m-1"
              onClick={() => handleEditProduct(product)}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex-grow-1">
            <div className="file-input-container">
              <button
                className="btn btn-primary"
                onClick={() => handleAddToCart(product)}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
      {editingProduct &&
        JSON.parse(localStorage.getItem("user")).roles.includes(
          "ROLE_ADMIN"
        ) && (
          <div className="">
            <ProductForm
              product={editingProduct}
              categories={categories}
              show={showForm}
              setShow={setShowForm}
              setDelatador={setDelatador}
            />
          </div>
        )}
    </div>
  );
};

export default Producto;
