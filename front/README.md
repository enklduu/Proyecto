# Frontend Doc

The frontend part of this project has been done with react, we also using bootstrap with sass, and other libraries for the code for example you will see formik and yup for the forms. 

Let's start 😎

# Table of Contents

- [Creation of the proyect](#creation-of-the-proyect)
    - [The code example for API request](#the-code-example-for-api-request)

# Creation of the proyect

First of all we gonna create a new react proyect for the frontend
```bash
npx create-react-app front
```

We will work as always with react , creating components, pages, routes, layout, contexts and helpers... 
We also will be working with React libraries like bootstrap, formik, yup, react-cookie-consent, react-router-dom, axios, react-spinners, react-modal ...  

The front part is going to be used by asking and sending data to the API we created on the backend, as you could see before, we are going to use axios (we also used fetch) to make this conection posible and it result in something like this:

## The Code example for API request

Here we can see fetch on the upload-image method
```javascript	
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", auth.user.email);

    fetch("http://127.0.0.1:8000/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        auth.setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
```

Here we can see the axios on the register method:

```javascript
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
      formik.setSubmitting(true);
      axios
        .post("http://127.0.0.1:8000/api/register", values)
        .then((response) => {
          alert("Cuenta registrada");
          navigate("/login");
        })
        .catch((error) => {
          formik.setSubmitting(false);
          formik.resetForm();
          alert(error.response.data);
        });
    },
  });
```
