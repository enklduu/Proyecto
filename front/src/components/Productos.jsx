import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Producto from "./Producto";
import NewProduct from "./NewProduct";
import ReactModal from "react-modal";
import { CartContext } from "../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewCategory from "./NewCategory";

const Productos = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [delatador, setDelatador] = useState(false);

  const [showCart, setShowCart] = useState(false);

  const cart = useContext(CartContext);

  const stripePromise = loadStripe(
    "pk_test_51MZHTWEqp3CmKNmxoUnpZ8QMXX9QYWyg9GxfTCLmKnYLLe4gKRrTP9QRLPk0COUC8WbxQuQv1iQfaORVcL5GRUzK00qiBmpUcR"
  );

  const pay = async (email) => {
    fetch("http://127.0.0.1:8000/api/cart/pay", {
      method: "PUT",
      body: JSON.stringify({ status: 1, email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data === true) {
          cart.clearCart();
          // cerrar modal
          setShowCart(false);
          // Notificacion
          toast.info("Tu pedido se ha realizado correctamente", {
            position: "top-right",
            autoClose: 5000,
            icon: "😀",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          fetchProducts();
        } else if (data === false) {
          setShowCart(false);
          //Notification
          toast.error("Algo salió mal", {
            position: "top-right",
            autoClose: 5000,
            icon: "😟",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const CheckoutForm = () => {
    // console.log(cart);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();

      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (!error) {
        // console.log("Pago exitoso:", paymentMethod);
        try {
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          await pay(userEmail);
          // console.log(data);
        } catch (error) {
          console.error("Error al procesar el pago:", error);
        }
      } else {
        console.error("Error al procesar el pago:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="card-element-container">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
        {cart.cartItems.length === 0 ? (
          <button className="btn btn-primary flex-grow-1 m-1" disabled>
            Pagar
          </button>
        ) : (
          <button type="submit" className="btn btn-primary">
            Pagar
          </button>
        )}
      </form>
    );
  };
  const fetchProducts = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/products");
    setProducts(response.data);
  };
  const fetchCategories = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/category");
    setCategories(response.data);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const userEmail = JSON.parse(localStorage.getItem("user")).email;
      const response = await axios.get("http://127.0.0.1:8000/api/orders");
      const items = response.data.filter(
        (item) => item.status === 0 && item.user === userEmail
      );
      // console.log(items[0]);
      if (items.length !== 0) {
        cart.setCartItems(items[0].orderProducts);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length === 0 && searchTerm === "") {
      return true;
    }

    const matchesCategory =
      selectedCategories.length === 0 ||
      product.categories.some((category) =>
        selectedCategories.includes(category.id.toString())
      );
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // console.log(matchesCategory && matchesSearchTerm);
    return matchesCategory && matchesSearchTerm;
  });

  const handleCreateProduct = () => {
    setShowCreate(!showCreate);
    setShowCreateCategory(false);
  };

  const handleCreateCategory = () => {
    setShowCreateCategory(!showCreateCategory);
    setShowCreate(false);
  };

  const handleCart = () => {
    setShowCart(!showCart);
  };
  // Hacemos el fetch de nuevo para que se recarge la info de la página pero sin generar bucles en el useEffect
  if (delatador) {
    fetchProducts();
    fetchCategories();
    setDelatador(!delatador);
  }

  return (
    <>
      {JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") ? (
        <>
          <div className="d-flex">
            <button
              className="btn btn-primary m-3 flex-grow-1"
              onClick={handleCreateProduct}
            >
              Crear Producto
            </button>
            <button
              className="btn btn-primary m-3 flex-grow-1"
              onClick={handleCreateCategory}
            >
              Crear Categoría
            </button>
          </div>
          <NewProduct
            show={showCreate}
            setShow={setShowCreate}
            categories={categories}
            setDelatador={setDelatador}
          />
          <NewCategory
            show={showCreateCategory}
            setShow={setShowCreateCategory}
            setDelatador={setDelatador}
          />
        </>
      ) : (
        <>
          <button className="btn btn-primary mb-3" onClick={handleCart}>
            Tu Carro {cart.cartItems.length}
          </button>
          <ReactModal isOpen={showCart} ariaHideApp={false}>
            <div className="modal-content">
              <h3>Tu Carro</h3>
              <ul className="">
                {cart.cartItems.map((product) => (
                  <li key={product.id}>
                    {product.name} - {product.amount}
                  </li>
                ))}
              </ul>
              <div className="productos-container">
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>
              <button className="btn btn-primary" onClick={handleCart}>
                Cerrar
              </button>
            </div>
          </ReactModal>
        </>
      )}

      <div className="mb-3">
        <h4 className="form-label text-center w-100">
          Selecciona las categorías que busques
        </h4>
        <div className="checkbox-container justify-content-center">
          {categories.length === 0 ||
          categories.every((category) => category.visible === 0) ? (
            <p className="text-center">No hay categorías disponibles aún.</p>
          ) : (
            <>
              {JSON.parse(localStorage.getItem("user")).roles.includes(
                "ROLE_ADMIN"
              )
                ? categories.map((category) => (
                    <div key={category.id} className="checkbox-item">
                      <label
                        className="custom-checkbox"
                        tab-index="0"
                        aria-label="Another Label"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={category.id}
                          id={category.id}
                          onChange={handleCategoryChange}
                          checked={selectedCategories.includes(
                            category.id.toString()
                          )}
                        />
                        <span className="checkmark"></span>
                        <span className="label">{category.name}</span>
                      </label>
                    </div>
                  ))
                : categories
                    .filter((category) => category.visible !== 0)
                    .map((category) => (
                      <div key={category.id} className="checkbox-item">
                        <label
                          className="custom-checkbox"
                          tab-index="0"
                          aria-label="Another Label"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={category.id}
                            id={category.id}
                            onChange={handleCategoryChange}
                            checked={selectedCategories.includes(
                              category.id.toString()
                            )}
                          />
                          <span className="checkmark"></span>
                          <span className="label">{category.name}</span>
                        </label>
                      </div>
                    ))}
            </>
          )}
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          placeholder="Búsqueda por nombre"
          onChange={handleSearchTermChange}
        />
      </div>

      <ul className="list-unstyled d-flex flex-wrap justify-content-around">
        {filteredProducts.length === 0 ||
        filteredProducts.every((product) => product.visible === false) ? (
          <p className="text-center">No se encuentran productos.</p>
        ) : (
          <>
            {JSON.parse(localStorage.getItem("user")).roles.includes(
              "ROLE_ADMIN"
            )
              ? filteredProducts.map((product) => (
                  <li key={product.id} className="mb-4">
                    <Producto
                      product={product}
                      categories={categories}
                      setDelatador={setDelatador}
                    />
                  </li>
                ))
              : filteredProducts
                  .filter((product) => product.visible !== false)
                  .map((product) => (
                    <li key={product.id} className="mb-4">
                      <Producto
                        product={product}
                        categories={categories}
                        setDelatador={setDelatador}
                      />
                    </li>
                  ))}
          </>
        )}
      </ul>
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

export default Productos;
