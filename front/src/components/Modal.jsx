import React, { useState } from "react";
import ReactModal from 'react-modal';

const Modal = () => {
  const [mostrarVentanaEmergente, setMostrarVentanaEmergente] = useState(true);
  const [noMostrarNuevamente, setNoMostrarNuevamente] = useState(false);

  const abrirVentanaEmergente = () => {
    setMostrarVentanaEmergente(true);
  };

  const cerrarVentanaEmergente = () => {
    setMostrarVentanaEmergente(false);
  };

  const handleCheckboxChange = () => {
    setNoMostrarNuevamente(!noMostrarNuevamente);
  };
  // Verificar si el usuario ha seleccionado "No volver a mostrar" y evitar mostrar la ventana emergente
  if (
    !mostrarVentanaEmergente ||
    (mostrarVentanaEmergente && noMostrarNuevamente)
  ) {
    return <div>Tu contenido principal aquí...</div>;
  }

  return (
    <div>
      <button onClick={abrirVentanaEmergente}>Valorar la página</button>

      <ReactModal isOpen={mostrarVentanaEmergente}>
        <h2>Valorar la página</h2>
        <form>
          <label>
            Puntuación:
            <input type="number" min="1" max="5" />
          </label>
          <label>
          <input type="checkbox" checked={noMostrarNuevamente} onChange={handleCheckboxChange} />
          No volver a mostrar
        </label>
          <button>Enviar</button>
        </form>

        <button onClick={cerrarVentanaEmergente}>Cerrar</button>
      </ReactModal>
    </div>
  );
};

export default Modal;
