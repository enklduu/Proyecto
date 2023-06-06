import React, { useState, useEffect } from "react";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);

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
      setPedidos(pedidosEstado1);
      setPedidosFinalizados(pedidosEstado2);
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
    console.log(pedidoId);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${pedidoId}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: 2, email: email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // const data = await response.json();
      // console.log(data);
      // sendEmail(data.email);

      // Llamar a la función para actualizar los pedidos después de cambiar el estado
      actualizarPedidos(pedidoId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h2>Pedidos en proceso</h2>
          {pedidos.map((pedido) => (
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
                    <li key={product.id}>
                      
                    </li>
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
          ))}
        </div>
        <div className="col-md-4">
          <h2>Pedidos finalizados</h2>
          {pedidosFinalizados.map((pedido) => (
            <div key={pedido.id} className="card mb-3">
              <div className="card-body">
                <p className="card-text">ID del pedido: {pedido.id}</p>
                <p className="card-text">
                  Fecha del pedido:{" "}
                  {new Date(pedido.date.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
