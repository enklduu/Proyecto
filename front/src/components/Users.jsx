import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showUsers, setShowUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/data");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (user) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/user/${user.id}`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Actualizar en el lado del cliente
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const toggleUserList = () => {
    setShowUsers(!showUsers);
  };

  return (
    <div className="container text-center">
      <hr />
      <div className="row">
        <div className="col-md-12">
          <h2 onClick={toggleUserList} style={{ cursor: "pointer" }}>
            {showUsers ? "🔼Lista de usuarios🔼" : "🔽Lista de usuarios🔽"}
          </h2>
          <hr />
          {showUsers && (
            <div>
              {usuarios.map((user) => (
                <div key={user.id} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">Nombre del usuario: {user.name}</p>
                    <p className="card-text">Email: {user.email}</p>
                  </div>
                  {JSON.parse(localStorage.getItem("user")).email ===
                  user.email ? (
                    <></>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleClick(user)}
                    >
                      {user.roles.includes("ROLE_ADMIN")
                        ? "¿Revocar Admin?"
                        : "Hacer Admin"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
