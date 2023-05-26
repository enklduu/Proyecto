import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import getData from "./helpers/getData";
import getProducts from "./helpers/getProducts";
import ProductInfo from "./pages/ProductInfo";
import Error from "./pages/Error";
import Main from "./pages/Main";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import UserInfo from "./pages/UserInfo";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./pages/Cart";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Main />, loader: getData },
        {
          path: "/login",
          element: (
            <PrivateRoute isAllowed={ user && localStorage.getItem("user") ? false : true}>
              <Login />
            </PrivateRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <PrivateRoute isAllowed={ user ? false : true}>
              <Register />
            </PrivateRoute>
          ),
        },
        {
          path: "/user",
          element: (
            <PrivateRoute isAllowed={localStorage.getItem("user") ? true : false}>
              <UserInfo />
            </PrivateRoute>
          ),
        },
        {
          path: "/cart",
          element: (
            <PrivateRoute isAllowed={localStorage.getItem("user") ? true : false}>
              <Cart/>
            </PrivateRoute>
          ),
        },
        {
          path: "/admin",
          element: <PrivateRoute isAllowed={(localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).roles.includes('ROLE_ADMIN') )? true : false}>
          <Admin />
        </PrivateRoute>,
        },
        {
          path: "/:id",
          element: <ProductInfo />,
          loader: ({ params }) => getProducts(params.id),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
