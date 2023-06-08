import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (category) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/category/${category.id}`,
        category,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Actualizar en el lado del cliente
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };
  const toggleCategoryList = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className="container text-center">
      <div className="row">
        <hr />
        <div className="col-md-12">
          <h2 onClick={toggleCategoryList} style={{ cursor: "pointer" }}>
            {showCategories ? "Lista de categorias" : "Lista de categorias"}
          </h2>
          {showCategories &&
            (categories.length === 0 ? (
              <p>No hay pedidos antiguos.</p>
            ) : (
              <div>
                {categories.map((category) => (
                  <div key={category.id} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">Categoría: {category.name}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleClick(category)}
                    >
                      {category.visible ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
