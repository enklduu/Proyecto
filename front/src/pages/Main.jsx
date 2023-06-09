import React, { useContext, useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Index from "../components/Index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const auth = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const hasVisitedPage = localStorage.getItem("hasVisitedPage");
    if (!hasVisitedPage) {
      localStorage.setItem("hasVisitedPage", "true");
      console.log("Ahora ya si la he visitado");
    } else {
      setModalVisible(true);
    }
  }, []);

  useEffect(() => {
    if (
      auth.user &&
      auth.user.roles.includes("ROLE_ADMIN") &&
      auth.user.orders.some((order) => order.status === 1)
    ) {
      toast("Tienes pedidos que hacer", {
        position: "top-right",
        autoClose: 5000,
        icon: "🌼",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (
      auth.user &&
      auth.user.orders.some((order) => order.status === 2)
    ) {
      toast.warn("Tienes pedidos listos para recoger", {
        position: "top-right",
        autoClose: 5000,
        icon: "📦",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [auth.user]);

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
      {modalVisible &&
        auth.user &&
        auth.user.valoration == null &&
        (auth.user.show_valoration || auth.user.show_valoration == null) && (
          <Modal />
        )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </>
  );
};

export default Main;
