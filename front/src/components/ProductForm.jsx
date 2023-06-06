import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";


const ProductForm = ({ product, categories, show, setShow, setDelatador}) => {

  // Define el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    description: Yup.string(),
    price: Yup.number(),
    visible: Yup.boolean(),
    stock: Yup.number(),
    categories: Yup.array(),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      visible: product.visible || 0,
      stock: product.stock || "",
      categories: product.categories || [],
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedProduct = {
        ...product,
        ...values,
      };

      axios
        .put("http://127.0.0.1:8000/api/products/"+updatedProduct.id,  updatedProduct) 
        .then((response) => {
          setShow(false);
          setDelatador(true);
          // console.log(response);
          // navigate("/admin");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  });

  useEffect(() => {
    formik.setValues({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      visible: product.visible || 0,
      stock: product.stock || "",
      categories: product.categories || [],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, formik.setValues]);

  return (
    <>
    {show && <Form onSubmit={formik.handleSubmit}>
      <h2>Editar</h2>
      <Form.Group controlId="name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el nombre"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && formik.errors.name}
        />
        {formik.touched.name && formik.errors.name && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ingrese la descripción"
          {...formik.getFieldProps("description")}
          isInvalid={formik.touched.description && formik.errors.description}
        />
        {formik.touched.description && formik.errors.description && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.description}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese el precio"
          {...formik.getFieldProps("price")}
          isInvalid={formik.touched.price && formik.errors.price}
        />
        {formik.touched.price && formik.errors.price && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.price}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group controlId="visible">
        <Form.Check
          type="checkbox"
          label="Visible"
          {...formik.getFieldProps("visible")}
          isInvalid={formik.touched.visible && formik.errors.visible}
        />
        {formik.touched.visible && formik.errors.visible && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.visible}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="stock">
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese el stock"
          {...formik.getFieldProps("stock")}
          isInvalid={formik.touched.stock && formik.errors.stock}
        />
        {formik.touched.stock && formik.errors.stock && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.stock}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group controlId="categories">
        <Form.Label>Categorías</Form.Label>
        {categories.map((category) => (
          <Form.Check
            key={category.id}
            type="checkbox"
            label={category.name}
            checked={formik.values.categories.some(
              (cat) => cat.id === category.id
            )}
            onChange={(event) => {
              const cat = category;
              const { categories } = formik.values;

              if (event.target.checked) {
                formik.setFieldValue("categories", [...categories, cat]);
              } else {
                formik.setFieldValue(
                  "categories",
                  categories.filter((c) => c.id !== cat.id)
                );
              }
            }}
          />
        ))}
        {formik.touched.categories && formik.errors.categories && (
          <Form.Control.Feedback type="invalid">
            {formik.errors.categories}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button type="submit">Guardar</Button>
    </Form>}
    </>
  );
};

export default ProductForm;
