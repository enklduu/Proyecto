import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import userImage from "../images/user.png";

const UserInfo = () => {
  const auth = useContext(AuthContext);

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", auth.user.email);

    fetch("http://127.0.0.1:8000/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        auth.setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {auth.user ? (
        <>
          <div className="container mt-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{auth.user.name}</h5>
                <img
                  className="card-img-top"
                  src={
                    auth.user.img
                      ? require("../images/" + auth.user.img)
                      : userImage
                  }
                  alt="User"
                  style={{ width: "150px", height: "150px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="card-text mt-3">{auth.user.last_name}</p>
                <p className="card-text">{auth.user.email}</p>
                {renderStars(auth.user.valoration)}
              </div>
            </div>
          </div>
          <div className="text-center container">
            <h2>Pedidos</h2>
          </div>
          <div className="text-center container">
            <h2>Opiniones</h2>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default UserInfo;
