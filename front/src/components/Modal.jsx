import React, { useContext, useState } from "react";
import ReactModal from "react-modal";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Modal = () => {
  const auth = useContext(AuthContext);
  const [mostrarVentanaEmergente, setMostrarVentanaEmergente] = useState(true);
  const [noMostrarNuevamente, setNoMostrarNuevamente] = useState(false);
  const [valoration, setValoration] = useState(null);
  const [starsSelected, setStarsSelected] = useState(0);

  const handleCheckboxChange = () => {
    setNoMostrarNuevamente(!noMostrarNuevamente);
    if (!noMostrarNuevamente) {
      setStarsSelected(0);
      setValoration(null);
    }
  };

  const handleValorationChange = (event) => {
    setNoMostrarNuevamente(false);
    setValoration(event.target.value);
    setStarsSelected(parseInt(event.target.value));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (noMostrarNuevamente) {
      const newUser = auth.user;
      newUser.show_valoration = 0;
      newUser.valoration = null;
      // console.log(newUser);

      // Cambiar en el servidor

      try {
        const response = await axios.put(
          "http://127.0.0.1:8000/api/valoration",
          { data: newUser }
        );
        // console.log(response.data); // Respuesta del servidor

        // Cambiar en el cliente
        auth.setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setMostrarVentanaEmergente(false);
      } catch (error) {
        console.log(error);
      }
    } else if (valoration == null) {
      alert("Valoración vacía");
    } else {
      const newUser = auth.user;
      newUser.valoration = valoration;
      newUser.show_valoration = 1;
      // console.log(newUser);

      // Cambiar en el servidor
      try {
        const response = await axios.put(
          "http://127.0.0.1:8000/api/valoration",
          { data: newUser }
        );

        // Cambiar en el cliente
        auth.setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setMostrarVentanaEmergente(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="modal-container">
      <ReactModal isOpen={mostrarVentanaEmergente} ariaHideApp={false}>
        <div className="modal-content">
          <h2>Valoración</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="input-group">
              <label>
                <div className="estrellas-mini">
                  <input
                    type="radio"
                    id="estrella5"
                    name="puntuacion"
                    value="5"
                    onChange={handleValorationChange}
                    checked={starsSelected === 5}
                  />
                  <label htmlFor="estrella5">&#9733;</label>
                  <input
                    type="radio"
                    id="estrella4"
                    name="puntuacion"
                    value="4"
                    onChange={handleValorationChange}
                    checked={starsSelected === 4}
                  />
                  <label htmlFor="estrella4">&#9733;</label>
                  <input
                    type="radio"
                    id="estrella3"
                    name="puntuacion"
                    value="3"
                    onChange={handleValorationChange}
                    checked={starsSelected === 3}
                  />
                  <label htmlFor="estrella3">&#9733;</label>
                  <input
                    type="radio"
                    id="estrella2"
                    name="puntuacion"
                    value="2"
                    onChange={handleValorationChange}
                    checked={starsSelected === 2}
                  />
                  <label htmlFor="estrella2">&#9733;</label>
                  <input
                    type="radio"
                    id="estrella1"
                    name="puntuacion"
                    value="1"
                    onChange={handleValorationChange}
                    checked={starsSelected === 1}
                  />
                  <label htmlFor="estrella1">&#9733;</label>
                </div>
              </label>
            </div>
            <div className="input-group  d-flex justify-content-center">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={noMostrarNuevamente}
                  onChange={handleCheckboxChange}
                />
                No volver a mostrar
              </label>
            </div>
            <div className="button-group d-flex justify-content-center">
              <button className="btn btn-primary">Enviar</button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};

export default Modal;
