import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="sol-sm-12 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg"></div>
              <div className="container-fluid">
                <img
                  className="img-fluid"
                  src="../images/error.jpg"
                  alt="Error"
                  style={{
                    maxWidth: "100%",
                    minWidth: "300px",
                  }}
                />
              </div>
              <div className="contant_box_404">
                <h3 className="h2">¡Ups! Página no encontrada</h3>
                <p>Lo sentimos, pero la página que estás buscando no existe.</p>
                <Link className="btn btn-secondary" to={`/`}>
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error;
