import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);
  const [pedidosRecogidos, setPedidosRecogidos] = useState([]);
  const [showPedidosRecogidos, setShowPedidosRecogidos] = useState(false);
  const auth = useContext(AuthContext);
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

  return (
    <>
      <div className="container text-center">
        <div className="row">
          <div className="col-md-6">
            <h2>Pedidos en proceso</h2>
            {pedidos.length === 0 ? (
              <p>No hay pedidos en proceso.</p>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">ID del pedido: {pedido.id}</p>
                    <p className="card-text">
                      Fecha del pedido:{" "}
                      {new Date(pedido.date.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">Usuario: {pedido.user}</p>
                    <ul className="list-unstyled d-flex">
                      {pedido.orderProducts.map((product) => (
                        <li key={product.id}></li>
                      ))}
                    </ul>
                    <button
                      className="btn btn-primary"
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
              pedidosFinalizados.map((pedido) => (
                <div key={pedido.id} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">ID del pedido: {pedido.id}</p>
                    <p className="card-text">
                      Fecha del pedido:{" "}
                      {new Date(pedido.date.date).toLocaleDateString()}
                    </p>
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
            <h2 onClick={togglePedidosRecogidos} style={{ cursor: "pointer" }}>
              {showPedidosRecogidos ? "Pedidos recogidos" : "Pedidos recogidos"}
            </h2>

            {showPedidosRecogidos ? (
              pedidosRecogidos.length === 0 ? (
                <p>No hay pedidos antiguos.</p>
              ) : (
                pedidosRecogidos.map((pedido) => (
                  <div key={pedido.id} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">ID del pedido: {pedido.id}</p>
                      <p className="card-text">
                        Fecha del pedido:{" "}
                        {new Date(pedido.date.date).toLocaleDateString()}
                      </p>
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
