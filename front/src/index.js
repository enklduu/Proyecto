import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProductsContextProvider } from './contexts/ProductsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProductsContextProvider>
  <RouterProvider router={router}/>
  </ProductsContextProvider>
)