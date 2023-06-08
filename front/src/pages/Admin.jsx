import React from "react";
import Pedidos from "../components/Pedidos";
import Users from "../components/Users";
import Reviews from "../components/Reviews";
import Categories from "../components/Categories";

const Admin = () => {
  return (
    <>
      <Pedidos></Pedidos>
      <Users></Users>
      <Reviews></Reviews>
      <Categories></Categories>
    </>
  );
};

export default Admin;
