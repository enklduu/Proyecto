import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Layout = () => {
  const [log, setLog] = useState(false);
  return (
    <Container>
      <Row>
        <Header />
      </Row>
      <Outlet context={[log, setLog]} />
    </Container>
  );
};

export default Layout;
