import React from 'react'
import Productos from '../components/Productos';
import { Col, Container, Row } from 'react-bootstrap';
import { useLoaderData } from 'react-router-dom';

const Products = () => {
  const data = useLoaderData();
  return (
    <Container className="container-fluid">
        <Row className="text-center">
        </Row>
        <Row>
          <Col className="d-flex flex-wrap">
            <Productos products={data} />
          </Col>
        </Row>
      </Container>
  )
}

export default Products