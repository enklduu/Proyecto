import React from "react";
import ReactDOM from "react-dom/client";
import App from './App'
// import { RouterProvider } from "react-router-dom";
// import { router } from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductsContextProvider } from "./contexts/ProductsContext";
import "../src/css/style.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <ProductsContextProvider>
    <AuthProvider>
      {/* <RouterProvider router={router} /> */}
      <App/>
    </AuthProvider>
  </ProductsContextProvider>
);
