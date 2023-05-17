// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import Layout from "../layout/Layout";

// import getData from "../helpers/getData";
// import getProducts from "../helpers/getProducts";

// import ProductInfo from "../pages/ProductInfo";
// import Error from "../pages/Error";
// import Main from "../pages/Main";
// import Register from "../pages/Register";
// import Login from "../pages/Login";
// // import Admin from "../pages/Admin";
// import Gallery from "../pages/Gallery";
// import UserInfo from "../pages/UserInfo";
// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext";
// import PrivateRoute from "../components/PrivateRoute";

//   const { user } = useContext(AuthContext);

//   export const router = createBrowserRouter([
//     {
//       path: "/",
//       // El layout estaba con Header y Footer pero no lo quiero asique se queda con el Outlet
//       element: <Layout />,
//       errorElement: <Error />,
//       children: [
//         { index: true, element: <Main />, loader: getData },
//         {
//           path: "/login",
//           element: (
//             <PrivateRoute isAllowed={user ? false : false}>
//               <Login />
//             </PrivateRoute>
//           ),
//         },
//         { path: "/register", element: <Register />, loader: null },
//         { path: "/gallery", element: <Gallery />, loader: null },
//         { path: "/user", element: <UserInfo />, loader: null },
//         // { path: "/admin", element: <Admin />, loader: null, beforeEnter: requireAdminRole },
//         {
//           path: "/:id",
//           element: <ProductInfo />,
//           loader: ({ params }) => getProducts(params.id),
//         },
//       ],
//     },
//   ]);