import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Authentication from "@/pages/Authentication";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Services from "@/pages/Services";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import ServiceDetail from "@/components/services/ServiceDetail";
import SpacesListPage from "@/pages/services/SpacesListPage";
import BookSpaceService from "@/pages/services/BookSpaceService";
import ShopService from "@/pages/services/ShopService";
import ServiceRequestDetail from "@/pages/ServiceRequestDetail";
import NewServiceRequest from "@/pages/NewServiceRequest";
import ShopCart from "@/pages/ShopCart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Authentication />,
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
    element: <ShopCart />,
  },
  {
    path: "/services/requests/:id",
    element: <ServiceRequestDetail />,
  },
  {
    path: "/services/requests/new",
    element: <NewServiceRequest />,
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
