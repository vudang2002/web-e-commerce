import React, { lazy } from "react";
import { Suspense } from "react";
import UserLayout from "../components/layout/UserLayout";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetail = lazy(() => import("../pages/OrderDetail"));

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
    path: "/checkout",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "/orders",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OrderDetail />
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
