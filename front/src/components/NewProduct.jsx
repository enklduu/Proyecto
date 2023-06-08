import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const NewProduct = ({ categories, show, setShow, setDelatador }) => {
  // Define el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    price: Yup.number().required("El precio es requerido"),
    visible: Yup.boolean().required("La visibilidad es requerida"),
    stock: Yup.number().required("El stock es requerido"),
    categories: Yup.array().required("Seleccione al menos una categoría"),
    img: Yup.mixed()
      .required("La imagen es requerida")
      .test("fileFormat", "Formato de archivo no válido", (value) => {
        if (value) {
          const supportedFormats = ["image/jpeg", "image/png"];
          return supportedFormats.includes(value.type);
        }
        return false;
      }),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      visible: false,
      stock: "",
      categories: [],
      img: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData(); // Crea un nuevo objeto FormData

      // Agrega los campos del formulario al objeto FormData
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("visible", values.visible);
      formData.append("stock", values.stock);
      formData.append("categories", JSON.stringify(values.categories));
      formData.append("img", values.img);

      axios
        .post("http://127.0.0.1:8000/api/new-product", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Establece el encabezado adecuado para datos de formulario y archivos
          },
        })
        .then((response) => {
          //   console.log(response);
          setShow(false);
          setDelatador(true);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  });

  return (
    <>
      <div>
        {show && (
          <div className="card reset-padding">
            <Form onSubmit={formik.handleSubmit}>
              <h2>Crear</h2>
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
                  isInvalid={
                    formik.touched.description && formik.errors.description
                  }
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
                        formik.setFieldValue("categories", [
                          ...categories,
                          cat,
                        ]);
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

              <Form.Group controlId="img">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(event) =>
                    formik.setFieldValue("img", event.target.files[0])
                  }
                  isInvalid={formik.touched.img && formik.errors.img}
                />
                {formik.touched.img && formik.errors.img && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.img}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button type="submit" className="btn btn-primary">
                  Crear
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

export default NewProduct;
