import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  const [valoration, setValoration] = useState(null);

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/average");
        setValoration(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <section className="bg-dark text-white py-5 footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-justify">
            <h6>Company Info</h6>
            <hr />
            <p>Floristería blablabla</p>
          </div>
          <div className="col-md-4 text-justify">
            <h6>Enlaces</h6>
            <hr />
            <div>
              <Link to="/" className="text-decoration-none ">
                Home
              </Link>
            </div>
            <div>
              <Link to="/" className="text-decoration-none ">
                About Us
              </Link>
            </div>
            <div>
              <Link to="/" className="text-decoration-none ">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-justify">
            <h6>Información y Contacto</h6>
            <hr />
            <div>
              <p></p>
            </div>
            <div>
              <p>67673234 - Jose </p>
            </div>
            <div>
              <p>63182763 - Jose </p>
            </div>
            <div>
              <p>13abrilfloristerias@gmail.com</p>
            </div>
            <div>Valoración media : {renderStars(valoration)}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
