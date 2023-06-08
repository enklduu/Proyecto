import React, { useContext } from "react";
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const auth = useContext(AuthContext);

  const override: CSSProperties = {
    display: "block",
    margin: "auto auto",
    borderColor: "white",
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
      formik.setSubmitting(true);
      axios
        .post("http://127.0.0.1:8000/api/login", values)
        .then((response) => {
          const userData = response.data;
          auth.login(userData);
          formik.setSubmitting(false);
          formik.resetForm();
        })
        .catch((error) => {
          console.log(error);
          formik.setSubmitting(false);
          formik.resetForm();
          if (error.response.status === 402) {
            alert("Este correo no existe en la base de datos");
          } else if (error.response.status === 401) {
            alert("La contraseña es errónea");
          }
        });
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center bg-image">
      {formik.isSubmitting ? (
        <div className="container mt-5 pt-3">
          <h1 className="text-center text-white">Loading...</h1>
          <div>
            <ClipLoader
              color={"white"}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      ) : (
        <Card
          className="container mt-5 mx-auto"
          style={{ minWidth: "100px", maxWidth: "550px" }}
        >
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
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
                  isInvalid={
                    formik.touched.password && !!formik.errors.password
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="mt-3"
                >
                  Log In
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              ¿No tienes una cuenta? - <Link to={"/register"}>Registrate</Link>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default LoginForm;
