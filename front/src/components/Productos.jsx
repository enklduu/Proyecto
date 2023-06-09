import React, { useState, useEffect } from "react";
import axios from "axios";
import Producto from "./Producto";
import NewProduct from "./NewProduct";

const Productos = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [delatador, setDelatador] = useState(false);

  const fetchProducts = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/products");
    setProducts(response.data);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/category");
      setCategories(response.data);
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length === 0 && searchTerm === "") {
      return true;
    }

    const matchesCategory =
      selectedCategories.length === 0 ||
      product.categories.some((category) =>
        selectedCategories.includes(category.id.toString())
      );
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    console.log(matchesCategory && matchesSearchTerm);
    return matchesCategory && matchesSearchTerm;
  });

  const handleCreateProduct = () => {
    setShowCreate(!showCreate);
  };

  // Hacemos el fetch de nuevo para que se recarge la info de la página pero sin generar bucles en el useEffect
  if (delatador) {
    fetchProducts();
    setDelatador(!delatador);
  }
  return (
    <>
      {JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") ? (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={handleCreateProduct}
          >
            Crear Producto
          </button>
          <NewProduct
            show={showCreate}
            setShow={setShowCreate}
            categories={categories}
            setDelatador={setDelatador}
          />{" "}
        </>
      ) : (
        <></>
      )}

      <div className="mb-3">
        <label className="form-label">
          Selecciona las categorías que busques
        </label>
        <div className="checkbox-container">
          {categories.length === 0 ||
          categories.every((category) => category.visible === 0) ? (
            <p className="text-center">No hay categorías disponibles aún.</p>
          ) : (
            <>
              {JSON.parse(localStorage.getItem("user")).roles.includes(
                "ROLE_ADMIN"
              )
                ? categories.map((category) => (
                    <div key={category.id} className="checkbox-item">
                      <label
                        className="custom-checkbox"
                        tab-index="0"
                        aria-label="Another Label"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={category.id}
                          id={category.id}
                          onChange={handleCategoryChange}
                          checked={selectedCategories.includes(
                            category.id.toString()
                          )}
                        />
                        <span className="checkmark"></span>
                        <span className="label">{category.name}</span>
                      </label>
                    </div>
                  ))
                : categories
                    .filter((category) => category.visible !== 0)
                    .map((category) => (
                      <div key={category.id} className="checkbox-item">
                        <label
                          className="custom-checkbox"
                          tab-index="0"
                          aria-label="Another Label"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={category.id}
                            id={category.id}
                            onChange={handleCategoryChange}
                            checked={selectedCategories.includes(
                              category.id.toString()
                            )}
                          />
                          <span className="checkmark"></span>
                          <span className="label">{category.name}</span>
                        </label>
                      </div>
                    ))}
            </>
          )}
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          placeholder="Búsqueda por nombre"
          onChange={handleSearchTermChange}
        />
      </div>

      <ul className="list-unstyled d-flex flex-wrap justify-content-around">
        {filteredProducts.length === 0 ||
        filteredProducts.every((product) => product.visible === false) ? (
          <p className="text-center">No hay productos disponibles aún.</p>
        ) : (
          <>
            {JSON.parse(localStorage.getItem("user")).roles.includes(
              "ROLE_ADMIN"
            )
              ? filteredProducts.map((product) => (
                  <li key={product.id} className="mb-4">
                    <Producto
                      product={product}
                      categories={categories}
                      setDelatador={setDelatador}
                    />
                  </li>
                ))
              : filteredProducts
                  .filter((product) => product.visible !== false)
                  .map((product) => (
                    <li key={product.id} className="mb-4">
                      <Producto
                        product={product}
                        categories={categories}
                        setDelatador={setDelatador}
                      />
                    </li>
                  ))}
          </>
        )}
      </ul>
    </>
  );
};

export default Productos;
