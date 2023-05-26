import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthContext";


const Layout = () => {
  const auth = useContext(AuthContext);

  return (
    <>
    {auth.user ? <Header/> : <></>}
    <Outlet/>
    {auth.user ? <Footer /> : <></>}
    </>
  );
};

export default Layout;
