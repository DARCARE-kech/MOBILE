
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Services from "@/pages/Services";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import ServiceDetail from "@/components/services/ServiceDetail";
import SpacesListPage from "@/pages/services/SpacesListPage";
import BookSpaceService from "@/pages/services/BookSpaceService";
import ShopService from "@/pages/services/ShopService";
import CartScreen from "@/pages/services/CartScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/services/:id",
    element: <ServiceDetail />,
  },
  {
    path: "/services/space/:id",
    element: <BookSpaceService />,
  },
  {
    path: "/services/spaces",
    element: <SpacesListPage />,
  },
  {
    path: "/services/shop",
    element: <ShopService />,
  },
  {
    path: "/services/cart",
    element: <CartScreen />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/services/laundry",
    element: <ServiceDetail />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
