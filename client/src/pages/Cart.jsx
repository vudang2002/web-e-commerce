import { useState } from "react";
import CartItem from "../components/cart/CartItem";

const mockCart = [
  {
    shop: "Watsons Vietnam Official Store",
    items: [
      {
        id: 1,
        name: "Dầu Gội Tresemmé Salon",
        image: "/images/products/tresemme.jpg",
        price: 180000,
        oldPrice: 231000,
        quantity: 1,
        voucher: "Giảm 8% đơn 250K",
      },
    ],
    shopVoucher: "Voucher giảm đến 200k",
    shippingPromo:
      "Giảm ₫300.000 phí vận chuyển đơn tối thiểu ₫0; Giảm ₫500.000 phí vận chuyển đơn tối thiểu ₫500.000",
  },
  {
    shop: "Unilever Chăm Sóc Sắc Đẹp",
    items: [
      {
        id: 2,
        name: "Sữa tắm Dove",
        image: "/images/products/dove.jpg",
        price: 120000,
        oldPrice: 150000,
        quantity: 2,
        voucher: "Deal Sốc",
      },
    ],
    shopVoucher: "Voucher giảm đến 100k",
    shippingPromo: "Miễn phí vận chuyển cho đơn từ ₫200.000",
  },
];

export default function Cart() {
  const [cart, setCart] = useState(mockCart);

  // Hàm tăng/giảm/xóa sản phẩm
  const updateQuantity = (shopIdx, itemIdx, delta) => {
    setCart((cart) =>
      cart.map((shop, sIdx) =>
        sIdx === shopIdx
          ? {
              ...shop,
              items: shop.items.map((item, iIdx) =>
                iIdx === itemIdx
                  ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                  : item
              ),
            }
          : shop
      )
    );
  };

  const removeItem = (shopIdx, itemIdx) => {
    setCart((cart) =>
      cart.map((shop, sIdx) =>
        sIdx === shopIdx
          ? { ...shop, items: shop.items.filter((_, iIdx) => iIdx !== itemIdx) }
          : shop
      )
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white rounded shadow p-4">
        <div className="grid grid-cols-6 font-bold border-b pb-2 mb-2">
          <div className="col-span-2">Sản Phẩm</div>
          <div>Đơn Giá</div>
          <div>Số Lượng</div>
          <div>Số Tiền</div>
          <div>Thao Tác</div>
        </div>
        {cart.map((shop, shopIdx) => (
          <div key={shop.shop} className="mb-6">
            <div className="font-semibold text-red-600 mb-2">{shop.shop}</div>
            {shop.items.map((item, itemIdx) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => updateQuantity(shopIdx, itemIdx, 1)}
                onDecrease={() => updateQuantity(shopIdx, itemIdx, -1)}
                onRemove={() => removeItem(shopIdx, itemIdx)}
              />
            ))}
            <div className="text-sm text-gray-500 mt-2">
              {shop.shopVoucher}{" "}
              <a href="#" className="text-blue-500 ml-2">
                Xem thêm voucher
              </a>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {shop.shippingPromo}{" "}
              <a href="#" className="text-blue-500 ml-2">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

