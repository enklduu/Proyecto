import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import "../src/css/style.css";
import { CartProvider } from "./contexts/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </CartProvider>
);
