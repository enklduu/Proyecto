import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Producto from './Producto';

const ProductList = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data);
    };
    fetchProducts();

    const fetchCategories = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/category');
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((category) => category !== value));
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length === 0) {
      return true;
    }
    return product.categories.some((category) => selectedCategories.includes(category.id.toString()));
  });

  return (
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
      <ul className="list-unstyled d-flex">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <Producto product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
