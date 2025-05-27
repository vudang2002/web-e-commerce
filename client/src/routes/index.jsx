import React, { lazy } from "react";
import { Suspense } from "react";
import UserLayout from "../components/layout/UserLayout";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <UserLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <About />
        </Suspense>
      </UserLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <UserLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Contact />
        </Suspense>
      </UserLayout>
    ),
  },
];

export default routes;
