import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const RegisterForm = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
    lastname: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Ingresa una dirección de correo electrónico válida")
      .required("Este campo es requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("Este campo es requerido"),
    password2: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Este campo es requerido"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post("http://127.0.0.1:8000/api/register", values)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => formik.setSubmitting(false));
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Nombre de usuario:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu nombre"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="lastname">
        <Form.Label>Apellidos de usuario:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tus apellidos"
          {...formik.getFieldProps("lastname")}
          isInvalid={formik.touched.lastname && !!formik.errors.lastname}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.lastname}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Correo electrónico:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu correo electrónico"
          {...formik.getFieldProps("email")}
          isInvalid={formik.touched.email && !!formik.errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Contraseña:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingresa tu contraseña"
          {...formik.getFieldProps("password")}
          isInvalid={formik.touched.password && !!formik.errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="password2">
        <Form.Label>Confirmar contraseña:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirma tu contraseña"
          {...formik.getFieldProps("password2")}
          isInvalid={formik.touched.password2 && !!formik.errors.password2}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
        Registrarse
      </Button>
    </Form>
  );
};
export default RegisterForm;
