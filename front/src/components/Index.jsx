import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Index = () => {
  return (
    <>
      <div>
        <header className="hero">
          <div className="textos-hero">
            <h1>Bienvenido a 13_Abril_Floristerías</h1>
            <p>Ahora también estamos online!</p>
            <a href="#contacto">Contactanos</a>
          </div>
          <div
            className="svg-hero"
            style={{ height: "150px", overflow: "hidden" }}
          >
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              style={{ height: "100%", width: "100%" }}
            >
              <path
                d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                style={{ stroke: "none", fill: "#f5f5f5" }}
              ></path>
            </svg>
          </div>
        </header>

        <section className="wave-contenedor website">
          <img src={"images/2.jpg"} alt="Imagen empresa" />
          <div className="contenedor-textos-main">
            <h2 className="titulo left">A que nos dedicamos</h2>
            <p className="parrafo d-flex m-3">
              Loquaerat odio alias obcaecati quicupiditate quia iste explicabo
              cum ullam quisquam repellat aliquid eaque. Cumque reprehenderit
              iusto eaque facere, cupiditate unde delectus qui.
            </p>
          </div>
        </section>

        <section className="info p-5 mt-4">
          <div className="container">
            <h2 className="titulo left">
              Alta experiencia en montaje de eventos
            </h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </section>

        <section className="cards contenedor">
          <h2 className="titulo">Nuestro Equipo</h2>
          <div className="content-cards">
            <article className="card-landing">
              <FaUser className="large" />
              <h3>Cristina</h3>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
              <Link to="/#contacto" className="cta">
                Contactar
              </Link>
            </article>
            <article className="card-landing">
              <FaUser className="large" />
              <h3>Jose Antonio</h3>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
              <Link to="/#contacto" className="cta">
                Contactar
              </Link>
            </article>
            <article className="card-landing">
              <FaUser className="large" />
              <h3>Jose</h3>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
              <Link to="/#contacto" className="cta">
                Contactar
              </Link>
            </article>
          </div>
        </section>

        <section className="galeria">
          <div className="contenedor">
            <h2 className="titulo">Nuestras creaciones</h2>
            <article className="galeria-cont">
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
              <img src="/images/1.jpg" alt="" />
            </article>
          </div>
        </section>

        <section className="info-last">
          <div className="table-responsive m-5">
            <h2 id="horario" class="text-center pb-2">
              Horario Apertura
            </h2>
            <table className="table table-bordered opening-hours-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lunes</td>
                  <td>10:00 - 9:00</td>
                </tr>
                <tr>
                  <td>Martes</td>
                  <td>10:00 - 9:00</td>
                </tr>
                <tr>
                  <td>Miércoles</td>
                  <td>10:00 - 9:00</td>
                </tr>
                <tr>
                  <td>Jueves</td>
                  <td>10:00 - 9:00</td>
                </tr>
                <tr>
                  <td>Viernes</td>
                  <td>10:00 - 9:00</td>
                </tr>
                <tr>
                  <td>Sábado</td>
                  <td>10:00 AM - 2:00 PM</td>
                </tr>
                <tr>
                  <td>Domingo</td>
                  <td>Cerrado</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="svg-wave"
            style={{ height: "150px", overflow: "hidden" }}
          >
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              style={{ height: "100%", width: "100%" }}
            >
              <path
                d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                style={{ stroke: "none", fill: "#333" }}
              ></path>
            </svg>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
