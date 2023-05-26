import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import userImage from "../images/user.png";

const UserInfo = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(userImage);

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };
  return (
    <>
    {user ? <>
      <div className="container mt-3">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <img
              className="card-img-top"
              src={ image }
              alt="User"
              style={{ width: "150px", height: "150px" }}
            />
            <p className="card-text mt-3">{user.last_name}</p>
            <p className="card-text">{user.email}</p>
            {renderStars(user.valoration)}
          </div>
        </div>
      </div>
      <div className="text-center container"><h2>Pedidos</h2></div>
      <div className="text-center container"><h2>Opiniones</h2></div>
    </> : <></>}
    </>
  );
};
export default UserInfo;
