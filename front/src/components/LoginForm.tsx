import React, { useContext } from "react";
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
const LoginForm = () => {
  const auth = useContext(AuthContext);

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo electrónico inválido")
      .required("Campo requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("Campo requerido"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      formik.setSubmitting(true);
      // const userData = values;
      // auth.login(userData);
      axios
        .post("http://127.0.0.1:8000/api/login", values)
        .then((response) => {
          console.log(response);
          const userData = response.data; // Suponiendo que el servidor devuelve los datos del usuario
          auth.login(userData);
          formik.setSubmitting(false);
        })
        .catch((error) => {
          console.log(error);
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <>
      {formik.isSubmitting ? (
        <div>
          {" "}
          <h1 className="text-center">Loading...</h1>
          <div>
            <ClipLoader
              color={"#ffffff"}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      ) : (
        <Form onSubmit={formik.handleSubmit}>
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
          <Button
            variant="primary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Log In
          </Button>
        </Form>
      )}
    </>
  );
};

export default LoginForm;
