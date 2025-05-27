export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="grid grid-cols-6 items-center border-b py-2">
      <div className="col-span-2 flex items-center gap-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-14 h-14 object-cover rounded"
        />
        <span className="line-clamp-2">{item.name}</span>
      </div>
      <div>
        <span className="line-through text-gray-400 text-xs mr-1">
          {item.oldPrice && `₫${item.oldPrice.toLocaleString()}`}
        </span>
        <span className="text-red-500 font-bold">
          ₫{item.price.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="border px-2">
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={onIncrease} className="border px-2">
          +
        </button>
      </div>
      <div className="text-red-500 font-bold">
        ₫{(item.price * item.quantity).toLocaleString()}
      </div>
      <div>
        <button onClick={onRemove} className="text-red-500">
          Xóa
        </button>
        <div>
          <a href="#" className="text-orange-500 text-xs">
            Tìm sản phẩm tương tự
          </a>
        </div>
      </div>
    </div>
  );
}
