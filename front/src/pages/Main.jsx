import React, { useContext, useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Modal from "../components/Modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Index from "../components/Index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const auth = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders");
      const data = await response.json();

      setPedidos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user")).orders.some(
        (order) => order.status === 2
      )
    ) {
      console.log("Hola");
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

    const hasVisitedPage = localStorage.getItem("hasVisitedPage");
    if (!hasVisitedPage) {
      localStorage.setItem("hasVisitedPage", "true");
      // console.log("Ahora ya si la he visitado");
    } else {
      setModalVisible(true);
    }
    fetchPedidos();
    // console.log(pedidos);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    JSON.parse(localStorage.getItem("user")) &&
    JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") &&
    pedidos.some((order) => order.status === 1)
  ) {
    console.log("Hola");
    toast.info("Tienes pedidos que hacer", {
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
  }

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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          borderRadius: "4px",
        }}
        buttonStyle={{
          background: "#e3aa97",
          color: "white",
          fontSize: "14px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
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
      <Header></Header>
      Hola holit
      <Footer></Footer>
    </>
  );
};

export default Main;
