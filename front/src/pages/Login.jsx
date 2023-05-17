import React, { useContext } from "react";
import LoginForm from "../components/LoginForm.tsx";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const auth = useContext(AuthContext);
  if (auth.user) {
    console.log("Ya has iniciado sesión");
    // Redirigir

  }
  return (
    // Con Footer y Header

    // <>
    //   <Header/>
    //   <LoginForm/>
    //   <Footer/>
    // </>

    // Sin
    <LoginForm/>
  );
};

export default Login;
