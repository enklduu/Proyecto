/* eslint-disable react/style-prop-object */
import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Agregar código JavaScript para controlar la apertura y cierre del Navbar
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    const handleNavbarToggle = () => {
      navbarCollapse.classList.toggle("show");
    };

    navbarToggler.addEventListener("click", handleNavbarToggle);

    return () => {
      navbarToggler.removeEventListener("click", handleNavbarToggle);
    };
  }, []);
  // console.log(location);
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="navbar-nav mr-auto">
          <div
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            style={{ "--clr": "#7b9e7e" }}
          >
            <Link className=" nav-link a-home" to="/" data-text="Home">
              Home
            </Link>
          </div>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {user ? (
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li
                className={`nav-item ${
                  location.pathname === "/products" ? "active" : ""
                }`}
                style={{ "--clr": "#e3aa97" }}
              >
                <Link className="nav-link" data-text="Tienda" to="/products">
                  Tienda
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/user" ? "active" : ""
                }`}
                style={{ "--clr": "#ffca08" }}
              >
                <Link className="nav-link" data-text="Info" to="/user">
                  Info
                </Link>
              </li>
              {user.roles.includes("ROLE_ADMIN") && (
                <li
                  className={`nav-item ${
                    location.pathname === "/admin" ? "active" : ""
                  }`}
                  style={{ "--clr": "#c84f60" }}
                >
                  <Link className="nav-link" data-text="Admin" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item" style={{ "--clr": "#fecccb" }}>
                <Link
                  className="nav-link"
                  data-text="Cerrar_Sesión"
                  onClick={logout}
                >
                  Cerrar_Sesión
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li
                className={`nav-item ${
                  location.pathname === "/products" ? "active" : ""
                }`}
                style={{ "--clr": "#e3aa97" }}
              >
                <Link className="nav-link" data-text="Log_In" to="/login">
                  Log_In
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/user" ? "active" : ""
                }`}
                style={{ "--clr": "#fecccb" }}
              >
                <Link
                  className="nav-link"
                  data-text="Registrate"
                  to="/register"
                >
                  Registrate
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
