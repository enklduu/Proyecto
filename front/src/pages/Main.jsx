import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// import { useLoaderData } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
// import Modal from "../components/Modal";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Main = () => {
  // const data = useLoaderData();
  // console.log(data);

  return (
    <>
    <Header/>
      <CookieConsent
        location="bottom"
        buttonText="Acepto"
        cookieName="ArmaiMiCookie"
        expires={150}
      >
        Esta página usa cookies para asegurarse de que tienes la mejor de las experiencias en nuestro sitio.
      </CookieConsent>
      <Container>
        <h1>Main</h1>
        <Row>
          {/* <Col className="d-flex flex-wrap"><Productos products={data}/></Col>
          <Col className=""><Carrito/></Col> */}
          {/* <Modal></Modal> */}
        </Row>
      </Container>
      <Footer/>
    </>

    // <Productos products={data}/>
  );
};

export default Main;
