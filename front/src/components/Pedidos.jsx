import React, { useState, useEffect } from "react";
const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);
  const [pedidosRecogidos, setPedidosRecogidos] = useState([]);
  const [showPedidosRecogidos, setShowPedidosRecogidos] = useState(false);
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders");
      const data = await response.json();
      // Filtrar pedidos por estado
      const pedidosEstado1 = data.filter((pedido) => pedido.status === 1);
      const pedidosEstado2 = data.filter((pedido) => pedido.status === 2);
      const pedidosEstado3 = data.filter((pedido) => pedido.status === 3);
      setPedidos(pedidosEstado1);
      setPedidosFinalizados(pedidosEstado2);
      setPedidosRecogidos(pedidosEstado3);
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarPedidos = (pedidoId) => {
    const pedidoActualizado = pedidos.find((pedido) => pedido.id === pedidoId);
    if (pedidoActualizado) {
      const pedidosActualizados = pedidos.filter(
        (pedido) => pedido.id !== pedidoId
      );
      setPedidos(pedidosActualizados);
      setPedidosFinalizados([...pedidosFinalizados, pedidoActualizado]);
    }
  };

  const cambiarEstado = async (pedidoId, email) => {
    fetch("http://127.0.0.1:8000/api/orders/" + pedidoId, {
      method: "PUT",
      body: JSON.stringify({ status: 2, email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        actualizarPedidos(pedidoId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const togglePedidosRecogidos = () => {
    setShowPedidosRecogidos(!showPedidosRecogidos);
  };
  console.log(pedidos);
  return (
    <>
      <div className="container text-center">
        <div className="row">
          <div className="col-md-6">
            <h2>Pedidos en proceso</h2>
            {pedidos.length === 0 ? (
              <p>No hay pedidos en proceso.</p>
            ) : (
              pedidos.map((pedido, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">
                      <b>Total:</b> {pedido.total}€
                    </p>
                    <p className="card-text">
                      <b>Fecha del pedido:</b>{" "}
                      {new Date(pedido.date.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <b>Productos:</b>
                    </p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Cantidad</th>
                          <th scope="col">Imagen</th>
                          <th scope="col">Nombre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.orderProducts.map((product, index) => (
                          <tr key={index}>
                            <td>{product.amount}</td>
                            <td>
                              <img
                                src={"../images/products/" + product.img}
                                alt="Product"
                                style={{
                                  maxWidth: "65px",
                                  minWidth: "65px",
                                  minHeight: "65px",
                                  maxHeight: "65px",
                                }}
                              />
                            </td>
                            <td>{product.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn button-like"
                      onClick={() => cambiarEstado(pedido.id, pedido.user)}
                    >
                      Cambiar a finalizado
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-md-6">
            <h2>Pedidos finalizados</h2>
            {pedidosFinalizados.length === 0 ? (
              <p>No hay pedidos finalizados.</p>
            ) : (
              pedidosFinalizados.map((pedido, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">
                      <b>Total:</b> {pedido.total}€
                    </p>
                    <p className="card-text">
                      <b>Fecha del pedido:</b>{" "}
                      {new Date(pedido.date.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <b>Productos:</b>
                    </p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Cantidad</th>
                          <th scope="col">Imagen</th>
                          <th scope="col">Nombre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.orderProducts.map((product, index) => (
                          <tr key={index}>
                            <td>{product.amount}</td>
                            <td>
                              <img
                                src={"../images/products/" + product.img}
                                alt="Product"
                                style={{
                                  maxWidth: "65px",
                                  minWidth: "65px",
                                  minHeight: "65px",
                                  maxHeight: "65px",
                                }}
                              />
                            </td>
                            <td>{product.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="container text-center">
        <div className="row">
          <hr />
          <div className="col-md-12">
            <h2
              onClick={togglePedidosRecogidos}
              className="btn button-like"
              style={{ cursor: "pointer" }}
            >
              {showPedidosRecogidos ? "Pedidos recogidos" : "Pedidos recogidos"}
            </h2>

            {showPedidosRecogidos ? (
              pedidosRecogidos.length === 0 ? (
                <p>No hay pedidos antiguos.</p>
              ) : (
                pedidosRecogidos.map((pedido, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">
                        <b>Total:</b> {pedido.total}€
                      </p>
                      <p className="card-text">
                        <b>Fecha del pedido:</b>{" "}
                        {new Date(pedido.date.date).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <b>Productos:</b>
                      </p>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Nombre</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.orderProducts.map((product, index) => (
                            <tr key={index}>
                              <td>{product.amount}</td>
                              <td>
                                <img
                                  src={"../images/products/" + product.img}
                                  alt="Product"
                                  style={{
                                    maxWidth: "65px",
                                    minWidth: "65px",
                                    minHeight: "65px",
                                    maxHeight: "65px",
                                  }}
                                />
                              </td>
                              <td>{product.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pedidos;
