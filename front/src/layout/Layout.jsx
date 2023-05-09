import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

const Layout = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
      const [isSubmitting, setIsSubmitting] = useState(false);
    
      const onSubmit = (data) => {
        // console.log(data);
        setIsSubmitting(true);
        axios.post('http://127.0.0.1:8000/api/register', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => setIsSubmitting(false));
      };
    
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name">Nombre de usuario:</label>
            <input type="text" id="name" {...register("name", { required: true })} />
            {errors.username && <span>Este campo es requerido</span>}
          </div>
          <div>
            <label htmlFor="lastname">Apellidos de usuario:</label>
            <input type="text" id="lastname" {...register("lastname", { required: true })} />
            {errors.username && <span>Este campo es requerido</span>}
          </div>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input type="email" id="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email && errors.email.type === 'required' && <span>Este campo es requerido</span>}
            {errors.email && errors.email.type === 'pattern' && <span>Ingresa una dirección de correo electrónico válida</span>}
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" {...register("password", { required: true, minLength: 6 })} />
            {errors.password && errors.password.type === 'required' && <span>Este campo es requerido</span>}
            {errors.password && errors.password.type === 'minLength' && <span>La contraseña debe tener al menos 6 caracteres</span>}
          </div>
          <div>
            <label htmlFor="password">Repita la contraseña:</label>
            <input type="password" id="password2" {...register("password2", { required: true, minLength: 6 })} />
            {errors.password && errors.password.type === 'required' && <span>Este campo es requerido</span>}
            {errors.password && errors.password.type === 'minLength' && <span>La contraseña debe tener al menos 6 caracteres</span>}
          </div>
          <button type="submit" disabled={isSubmitting}>Registrarse</button>
        </form>
      );
};

export default Layout;
 /*
 const [log, setLog] = useState(false);
<Container>
      <Row>
        <Header />
      </Row>
      <Outlet context={[log, setLog]} />
    </Container>
 */