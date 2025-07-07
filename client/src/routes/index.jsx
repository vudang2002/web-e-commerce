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
const SearchResults = lazy(() => import("../pages/SearchResults"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const HotDealsPage = lazy(() => import("../pages/HotDealsPage"));
const FeaturedProducts = lazy(() => import("../pages/FeaturedProducts"));
const Profile = lazy(() => import("../pages/Profile"));

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
    path: "/category/:slug",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryPage />
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
    path: "/profile",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    ),
  },
  {
    path: "/hot-deals",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HotDealsPage />
      </Suspense>
    ),
  },
  {
    path: "/featured-products",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <FeaturedProducts />
      </Suspense>
    ),
  },
];

export default routes;
