import React, { useContext } from "react";
import CookieConsent from "react-cookie-consent";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Index from "../components/Index";
const Main = () => {
  const auth = useContext(AuthContext);
  return (
    <>
      {auth.user ? (
        <></>
      ) : (
        <>
          <Index></Index>
          <div className="text-center mt-3">
            Por favor, <Link to="/login">inicia sesión</Link> o{" "}
            <Link to="/register">regístrate</Link> para acceder a todos los
            contenidos.
          </div>
        </>
      )}
      <CookieConsent
        location="bottom"
        buttonText="Acepto"
        cookieName="ArmaiMiCookie"
        expires={150}
        style={{
          background: "#333",
          color: "#fff",
          fontSize: "16px",
          textAlign: "center",
          padding: "20px",
        }}
        buttonStyle={{
          background: "#0069d9",
          color: "white",
          fontSize: "14px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Esta página usa cookies para asegurarse de que tienes la mejor de las
        experiencias.
      </CookieConsent>
      {auth.user &&
        auth.user.valoration == null &&
        (auth.user.show_valoration || auth.user.show_valoration == null) && (
          <Modal />
        )}
    </>
  );
};

export default Main;
