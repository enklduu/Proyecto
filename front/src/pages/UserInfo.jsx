/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const UserInfo = () => {
  const auth = useContext(AuthContext);

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", auth.user.email);

    fetch("http://127.0.0.1:8000/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        auth.setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const cambiarEstado = async (pedidoId, email) => {
    fetch("http://127.0.0.1:8000/api/orders/" + pedidoId, {
      method: "PUT",
      body: JSON.stringify({ status: 3, email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        auth.setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      {auth.user && (
        <>
          <div className="container mt-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{auth.user.name}</h5>
                <p className="card-text mt-3">{auth.user.last_name}</p>
                <img
                  className="card-img-top"
                  src={
                    JSON.parse(localStorage.getItem("user")).img != null
                      ? "images/users/" +
                        JSON.parse(localStorage.getItem("user")).img
                      : "images/users/user.png"
                  }
                  alt="User"
                  style={{ width: "150px", height: "150px" }}
                />
                <p></p>
                <div className="file-input-container">
                  <input
                    type="file"
                    accept="image/*"
                    id="file-input"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="file-input" className="btn btn-primary">
                    Cargar archivo
                  </label>
                </div>

                <p className="card-text">{auth.user.email}</p>
                {renderStars(auth.user.valoration)}
              </div>
            </div>
          </div>

          {auth.user.reviews.length !== 0 && (
            <div className="text-center container">
              <h2>Mis reseñas</h2>
              {auth.user.reviews.map((review, index) => (
                <div key={index}>
                  {/* Aquí renderizamos los detalles de cada reseña */}
                  <div key={review.id} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">
                        <b>{review.user}</b>
                      </p>
                      <p className="card-text">
                        <b>{review.text}</b>
                      </p>
                      <p className="card-text">
                        {renderStars(review.valoration)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {auth.user.orders.length !== 0 && (
            <div className="text-center container">
              <div className="row">
                {auth.user.orders.some((order) => order.status === 1) && (
                  <div className="col-12">
                    <h2>Pedidos pendientes</h2>
                    {auth.user.orders
                      .filter((order) => order.status === 1)
                      .map((order, index) => (
                        <div key={index} className="card mb-3">
                          <div className="card-body">
                            <p className="card-text">
                              {" "}
                              Total : {order.total_price}€
                            </p>
                            <p className="card-text">
                              Fecha del pedido:{" "}
                              {new Date(order.date.date).toLocaleDateString()}
                            </p>
                            <p className="card-text">
                              <b>Productos</b>
                            </p>
                            <ul className="list-unstyled">
                              {order.order_products.map((product, index) => (
                                <li key={index}>
                                  <div className=" d-flex ">
                                    {product.amount} - {product.name}{" "}
                                    <img
                                      src={"../images/products/" + product.img}
                                      alt="Card image"
                                      style={{
                                        maxWidth: "200px",
                                        minWidth: "200px",
                                      }}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {auth.user.orders.some((order) => order.status === 2) && (
                  <div className="col-12">
                    <h2>Pedidos para recoger</h2>
                    {auth.user.orders
                      .filter((order) => order.status === 2)
                      .map((order, index) => (
                        <div key={index} className="card mb-3">
                          <div className="card-body">
                            <p className="card-text">
                              {" "}
                              Total : {order.total_price}€
                            </p>
                            <p className="card-text">
                              Fecha del pedido:{" "}
                              {new Date(order.date.date).toLocaleDateString()}
                            </p>
                            <p className="card-text">
                              <b>Productos</b>
                            </p>
                            <ul className="list-unstyled">
                              {order.order_products.map((product, index) => (
                                <li key={index}>
                                  <div className=" d-flex ">
                                    {product.amount} - {product.name}{" "}
                                    <img
                                      src={"../images/products/" + product.img}
                                      alt="Card image"
                                      style={{
                                        maxWidth: "200px",
                                        minWidth: "200px",
                                      }}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                cambiarEstado(order.id, auth.user.email)
                              }
                            >
                              Recogido
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {auth.user.orders.some((order) => order.status === 3) && (
                  <div className="col">
                    <h2>Pedidos Antiguos</h2>
                    {auth.user.orders
                      .filter((order) => order.status === 3)
                      .map((order, index) => (
                        <div key={index} className="card mb-3">
                          <div className="card-body">
                            <p className="card-text">
                              {" "}
                              Total : {order.total_price}€
                            </p>
                            <p className="card-text">
                              Fecha del pedido:{" "}
                              {new Date(order.date.date).toLocaleDateString()}
                            </p>
                            <p className="card-text">
                              <b>Productos</b>
                            </p>
                            <ul className="list-unstyled">
                              {order.order_products.map((product, index) => (
                                <li key={index}>
                                  <div className=" d-flex ">
                                    {product.amount} - {product.name}{" "}
                                    <img
                                      src={"../images/products/" + product.img}
                                      alt="Card image"
                                      style={{
                                        maxWidth: "200px",
                                        minWidth: "200px",
                                      }}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default UserInfo;
