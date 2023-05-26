import React, { useContext } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import CookieConsent from "react-cookie-consent";
import Modal from "../components/Modal";
import Productos from "../components/Productos";
import { Col } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Searcher from "../components/Searcher";

const Main = () => {
  const auth = useContext(AuthContext);
  const data = useLoaderData();
  // console.log(data);
  // console.log(auth.user);
  return (
    <>
       <CookieConsent
      location="bottom"
      buttonText="Acepto"
      cookieName="ArmaiMiCookie"
      expires={150}
      style={{
        background: '#333',
        color: '#fff',
        fontSize: '16px',
        textAlign: 'center',
        padding: '20px',
      }}
      buttonStyle={{
        background: '#c84f60',
        color: '#fff',
        fontSize: '14px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Esta página usa cookies para asegurarse de que tienes la mejor de las experiencias.
    </CookieConsent>
      {auth.user &&
        auth.user.valoration == null &&
        (auth.user.show_valoration || auth.user.show_valoration == null) && (
          <Modal />
        )}
      <Container className="container-fluid">
        <Row className="text-center"><Searcher/></Row>
        <Row>
          <Col className="d-flex flex-wrap"><Productos products={data}/></Col>
        </Row>
      </Container>
    </>
  );
};

export default Main;
