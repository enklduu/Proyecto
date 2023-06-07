import React from "react";
import Productos from "../components/Productos";
import { Container, Row } from "react-bootstrap";

const Products = () => {
  return (
    <Container className="container-fluid">
      <Row>
        <Productos />
      </Row>
    </Container>
  );
};

export default Products;
