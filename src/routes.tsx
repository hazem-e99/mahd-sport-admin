import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router-dom";
import App from "./App";
import { Spinner } from "react-bootstrap";

// Lazy load components
const LoginPage = lazy(() => import("./pages/login/login"));
const Home = lazy(() => import("./pages/home/home"));
const CardControl = lazy(() => import("./pages/cardControl/card-control"));

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spinner animation="border" variant="primary" />
  </div>
);

const Router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, element: <Navigate to="/en" replace /> },
      {
        path: "/:lng",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "/:lng/card-control",
        element: (
          <Suspense fallback={<Loading />}>
            <CardControl />
          </Suspense>
        )
      },
      {
        path: "*",
        element: <Navigate to="/en" replace />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/en" replace />,
  },
]);

export default Router;
