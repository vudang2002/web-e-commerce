import React from "react";
import ProductPrice from "../components/common/ProductPrice";

const DiscountDemo = () => {
  // Demo products with different discount scenarios
  const demoProducts = [
    {
      _id: "1",
      name: "Sản phẩm không giảm giá",
      price: 100000,
      discount: 0,
    },
    {
      _id: "2",
      name: "Sản phẩm giảm 20%",
      price: 200000,
      discount: 20,
    },
    {
      _id: "3",
      name: "Sản phẩm giảm 50%",
      price: 500000,
      discount: 50,
    },
    {
      _id: "4",
      name: "Sản phẩm hot deal giảm 70%",
      price: 1000000,
      discount: 70,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Demo Discount Pricing
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {demoProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">{product.name}</h3>

            <div className="space-y-4">
              {/* Size Small */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Small Size
                </h4>
                <ProductPrice product={product} size="sm" showDiscount={true} />
              </div>

              {/* Size Medium */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Medium Size
                </h4>
                <ProductPrice product={product} size="md" showDiscount={true} />
              </div>

              {/* Size Large */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Large Size
                </h4>
                <ProductPrice product={product} size="lg" showDiscount={true} />
              </div>

              {/* Without discount badge */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Without Discount Badge
                </h4>
                <ProductPrice
                  product={product}
                  size="md"
                  showDiscount={false}
                />
              </div>
            </div>

            {/* Raw data for debugging */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
              <strong>Raw Data:</strong>
              <br />
              Original Price: {product.price.toLocaleString("vi-VN")}đ<br />
              Discount: {product.discount}%<br />
              Calculated Discounted Price:{" "}
              {Math.round(
                product.price * (1 - product.discount / 100)
              ).toLocaleString("vi-VN")}
              đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountDemo;
