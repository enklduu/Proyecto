import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const NewCategory = ({ show, setShow, setDelatador }) => {
  // Define el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    visible: Yup.boolean().required("La visibilidad es requerida"),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      visible: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData(); // Crea un nuevo objeto FormData

      // Agrega los campos del formulario al objeto FormData
      formData.append("name", values.name);
      formData.append("visible", values.visible);
      axios
        .post("http://127.0.0.1:8000/api/new-category", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // console.log(response);
          formik.resetForm();
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
          <div className="form">
            <Form onSubmit={formik.handleSubmit}>
              <h2>Crear Categoría</h2>
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

export default NewCategory;
