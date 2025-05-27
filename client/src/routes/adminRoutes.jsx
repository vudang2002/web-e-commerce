import React, { lazy, Suspense } from "react";

const DashboardHome = lazy(() =>
  import("../components/admin/dashboard/DashboardHome")
);
const ProductList = lazy(() =>
  import("../components/admin/product/ProductList")
);
const ProductCreate = lazy(() =>
  import("../components/admin/product/ProductCreate")
);
const ProductDetail = lazy(() =>
  import("../components/admin/product/ProductDetail")
);
const ProductUpdate = lazy(() =>
  import("../components/admin/product/ProductUpdate")
);
const CategoryList = lazy(() =>
  import("../components/admin/category/CategoryList")
);
const CategoryCreate = lazy(() =>
  import("../components/admin/category/CategoryCreate")
);
const CategoryDetail = lazy(() =>
  import("../components/admin/category/CategoryDetail")
);
const CategoryUpdate = lazy(() =>
  import("../components/admin/category/CategoryUpdate")
);
// Brand management components
const BrandList = lazy(() => import("../components/admin/brand/BrandList"));
const BrandCreate = lazy(() => import("../components/admin/brand/BrandCreate"));
const BrandDetail = lazy(() => import("../components/admin/brand/BrandDetail"));
const BrandUpdate = lazy(() => import("../components/admin/brand/BrandUpdate"));
// User management components
const UserList = lazy(() => import("../components/admin/user/UserList"));
const UserCreate = lazy(() => import("../components/admin/user/UserCreate"));
const UserDetail = lazy(() => import("../components/admin/user/UserDetail"));
const UserUpdate = lazy(() => import("../components/admin/user/UserUpdate"));

const adminRoutes = [
  {
    path: "",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardHome />
      </Suspense>
    ),
  },
  {
    path: "products", // Đúng chuẩn nested route, KHÔNG có dấu /
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    ),
  },
  {
    path: "products/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductCreate />
      </Suspense>
    ),
  },
  {
    path: "products/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "products/update/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductUpdate />
      </Suspense>
    ),
  },
  //Category routes
  {
    path: "categories",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryList />
      </Suspense>
    ),
  },
  {
    path: "categories/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryCreate />
      </Suspense>
    ),
  },
  {
    path: "categories/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryDetail />
      </Suspense>
    ),
  },
  {
    path: "categories/update/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryUpdate />
      </Suspense>
    ),
  },
  // Brand routes
  {
    path: "brands",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BrandList />
      </Suspense>
    ),
  },
  {
    path: "brands/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BrandCreate />
      </Suspense>
    ),
  },
  {
    path: "brands/detail/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BrandDetail />
      </Suspense>
    ),
  },
  {
    path: "brands/edit/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BrandUpdate />
      </Suspense>
    ),
  },

  // User management routes
  {
    path: "users",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserList />
      </Suspense>
    ),
  },
  {
    path: "users/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserCreate />
      </Suspense>
    ),
  },
  {
    path: "users/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserDetail />
      </Suspense>
    ),
  },
  {
    path: "users/update/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserUpdate />
      </Suspense>
    ),
  },
];

export default adminRoutes;
