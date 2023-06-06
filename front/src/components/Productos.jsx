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
      <button className="" onClick={() => handleCreateProduct()}>
        Crear Producto
      </button>
      <NewProduct
        show={showCreate}
        setShow={setShowCreate}
        categories={categories}
        setDelatador={setDelatador}
      />
      <div>
        <label>Filter by category:</label>
        <div className="form-group">
          {categories.map((category) => (
            <div key={category.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={category.id}
                id={category.id}
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(category.id.toString())}
              />
              <label className="form-check-label" htmlFor={category.id}>
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Search by name:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <ul className="list-unstyled d-flex">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <Producto
              product={product}
              categories={categories}
              setDelatador={setDelatador}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Productos;
