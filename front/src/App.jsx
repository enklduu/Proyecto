import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

import getData from "./helpers/getData";
import getProducts from "./helpers/getProducts";
import getImages from "./helpers/getImages";

import ProductInfo from "./pages/ProductInfo";
import Error from "./pages/Error";
import Main from "./pages/Main";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";
import UserInfo from "./pages/UserInfo";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const { user } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      // El layout estaba con Header y Footer pero no lo quiero asique se queda con el Outlet
      element: <Layout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Main />, loader: getData },
        {
          path: "/login",
          element: (
            <PrivateRoute isAllowed={user ? false : true}>
              <Login />
            </PrivateRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <PrivateRoute isAllowed={user ? false : true}>
              <Register />
            </PrivateRoute>
          ),
        },
        {
          path: "/gallery",
          element: <Gallery />,
          loader: getImages,
        },
        {
          path: "/user",
          element: (
            <PrivateRoute isAllowed={user ? true : false}>
              <UserInfo />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin",
          element: <PrivateRoute isAllowed={(user && user.roles.includes('ROLE_ADMIN') )? true : false}>
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
