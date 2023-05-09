import React from "react";
import Carrito from "../components/Carrito";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useLoaderData } from "react-router-dom";

import Productos from "../components/Productos";

const Main = () => {
  const data = useLoaderData();
  // console.log(data);

  return (
    <Container>
        <Row>
          <Col className="d-flex flex-wrap"><Productos products={data}/></Col>
          <Col className=""><Carrito/></Col>
        </Row>
      </Container>

  // <Productos products={data}/>
  
  );

  /* <Link to={`/infopeliculas/${pelicula.id}`}>{pelicula.title}</Link> */
};

export default Main;
