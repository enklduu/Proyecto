import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <section className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-justify">
            <h6>Company Info</h6>
            <hr/>
            <p>Floristería blablabla</p>
          </div>
          <div className="col-md-4 text-justify">
            <h6>Enlaces</h6>
            <hr/>
            <div><Link to="/" className="text-decoration-none ">Home</Link></div>
            <div><Link to="/" className="text-decoration-none ">About Us</Link></div>
            <div><Link to="/" className="text-decoration-none ">Contact Us</Link></div>
          </div>
          <div className="col-md-4 text-justify">
            <h6>Información y Contacto</h6>
            <hr/>
            <div><p></p></div>
            <div><p>67673234 - Jose </p></div>
            <div><p>63182763 - Jose </p></div>
            <div><p>13abrilfloristerias@gmail.com</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
