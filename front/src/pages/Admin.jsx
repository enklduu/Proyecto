import React from "react";
import Pedidos from "../components/Pedidos";
import Users from "../components/Users";
import Reviews from "../components/Reviews";
import Categories from "../components/Categories";

const Admin = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Pedidos></Pedidos>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <Categories></Categories>
        </div>
        <div className="col-md-4">
          <Reviews></Reviews>
        </div>
        <div className="col-md-4">
          <Users></Users>
        </div>
      </div>
    </div>
  );
};

export default Admin;
