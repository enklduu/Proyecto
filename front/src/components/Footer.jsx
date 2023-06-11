import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
const Footer = () => {
  const [valoration, setValoration] = useState(null);

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/average");
        setValoration(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <section className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-center">
            <h4>Compañía</h4>
            <hr />
            <p>
              13_Abril_Floristerías es una empresa dedicada al tratado de
              plantas, expertos en creaciones florales con amplía experiencia en
              el montaje de eventos.
            </p>
            <div className="d-flex justify-content-around">
              <Link
                to="https://www.facebook.com/trecefloristeria/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none facebook"
              >
                <FaFacebookF className="mr-2" />
              </Link>
              <Link
                to="https://www.instagram.com/13abrilflor/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none instagram"
              >
                <FaInstagram className="mr-2" />
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <h4>Enlaces Útiles</h4>
            <hr />
            <div>
              <Link to="/" className="text-decoration-none ">
                Home
              </Link>
            </div>
            <div>
              <Link to="/" className="text-decoration-none ">
                Sobre Nosotros
              </Link>
            </div>
            <div>
              <Link to="/" className="text-decoration-none ">
                Horario Apertura
              </Link>
            </div>
            {JSON.parse(localStorage.getItem("user")) ? (
              <div>
                <Link to="/products" className="text-decoration-none ">
                  Tiendas
                </Link>
              </div>
            ) : null}
          </div>
          <div className="col-md-4 text-center">
            <h4 id="contacto">Contacto</h4>
            <hr />
            <div>
              <p></p>
            </div>
            <div>
              <p>676732342 - Jose </p>
              <p>683625982 - Jose Antonio </p>
              <p>676732341 - Cristina </p>
            </div>
            <div>
              <p>13abrilfloristerias@gmail.com</p>
            </div>
            <div>
              <p>
                Valoración media :{" "}
                {valoration === 0 ? "😿" : renderStars(valoration)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
