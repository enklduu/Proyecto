import React, { useContext, useState } from "react";

import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaCartPlus } from "react-icons/fa";
import { CartContext } from "../contexts/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Producto = ({ product, categories, setDelatador }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cart = useContext(CartContext);

  const handleAddToCart = (product) => {
    // Lógica para añadir el producto al carrito
    if (getProductAmountInCart(product.id) < product.stock) {
      cart.addToCart(product);
    } else {
      toast.error("No puedes añadir más", {
        position: "top-right",
        autoClose: 5000,
        icon: "😡",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleRemoveFromCart = (product) => {
    // Lógica para añadir el producto al carrito
    if (product.amount !== 0) {
      cart.removeFromCart(product.id);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(!showForm);
  };
  const getProductAmountInCart = (productId) => {
    const productInCart = cart.cartItems.find(
      (product) => product.id === productId
    );
    return productInCart ? productInCart.amount : 0;
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
    <>
      <div
        className="card m-auto container-fluid reset-padding"
        style={{ width: "16rem", minHeight: "400px", maxHeight: "100%" }}
      >
        <Link to={"/products/" + product.id}>
          <img
            className="card-img-top img-fluid"
            src={"../images/products/" + product.img}
            alt="Product"
            style={{ objectFit: "cover", height: "180px" }}
          />
        </Link>
        <div className="card-body border-top d-flex flex-column text-center">
          <h5 className="card-title">{product.name}</h5>
          {/* <p className="card-text">{product.description}</p> */}
          <p className="card-text">{"Precio -> " + product.price + "€"}</p>
          {JSON.parse(localStorage.getItem("user")).roles.includes(
            "ROLE_ADMIN"
          ) ? (
            <></>
          ) : (
            <p className="card-text">
              {"En el carrito -> " +
                getProductAmountInCart(product.id) +
                " Stock -> " +
                product.stock}
            </p>
          )}
          <div className="d-flex justify-content-center">
            {!product.visible && (
              <div className="icon-container">
                <FaEyeSlash />
              </div>
            )}
            {product.stock === 0 && (
              <div className="icon-container">
                <FaCartPlus />
              </div>
            )}
          </div>
        </div>
        <div className="card-footer">
          {JSON.parse(localStorage.getItem("user")).roles.includes(
            "ROLE_ADMIN"
          ) ? (
            <div className="d-flex">
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
            <>
              <div className="d-flex">
                {product.stock === 0 ? (
                  <button className="btn btn-primary flex-grow-1 m-1" disabled>
                    Agotado
                  </button>
                ) : (
                  <button
                    className="btn btn-primary flex-grow-1 m-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    Añadir
                  </button>
                )}
                <button
                  className="btn btn-primary flex-grow-1 m-1 "
                  onClick={() => handleRemoveFromCart(product)}
                >
                  Quitar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="container">
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </>
  );
};

export default Producto;
