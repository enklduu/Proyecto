import React, { useState, useEffect } from "react";
import axios from "axios";
import Producto from "./Producto";
import ProductForm from "./ProductForm";

const Productos = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data);
    };
    fetchProducts();

    const fetchCategories = async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/category");
      setCategories(response.data);
    };
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

  const handleAddToCart = (product) => {
    // Lógica para añadir el producto al carrito
    console.log('Producto añadido al carrito:', product);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
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

  return (
    <div>
      {editingProduct && (
        <ProductForm product={editingProduct} categories={categories} />
      )}
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
        <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
      </div>

      <ul className="list-unstyled d-flex">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <Producto product={product} />
            {JSON.parse(localStorage.getItem("user")).roles.includes("ROLE_ADMIN") ? (
              <button className="m-4" onClick={() => handleEditProduct(product)}>Edit</button>
            ) : (
              <button className="m-4n" onClick={() => handleAddToCart(product)}>+</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
