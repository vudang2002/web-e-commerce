import {
  createOrder,
  updateOrderStatus,
  getOrdersByUser,
} from "../../src/services/order.service.js";
import Order from "../../src/models/order.model.js";

jest.mock("../../src/models/order.model.js");

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      const orderData = {
        user: "123",
        orderItems: [{ product: "456", quantity: 2 }],
        totalAmount: 200,
      };

      const mockOrder = { _id: "789", ...orderData };

      Order.create.mockResolvedValue(mockOrder);

      const result = await createOrder(orderData);

      expect(Order.create).toHaveBeenCalledWith(orderData);
      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status successfully", async () => {
      const mockOrder = {
        _id: "123",
        orderStatus: "Pending",
        save: jest.fn().mockResolvedValue({
          _id: "123",
          orderStatus: "Processing",
        }),
      };

      Order.findById.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus("123", "Processing");

      expect(mockOrder.orderStatus).toBe("Processing");
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it("should throw error when order not found", async () => {
      Order.findById.mockResolvedValue(null);

      await expect(updateOrderStatus("123", "Processing")).rejects.toThrow(
        "Order not found"
      );
    });

    it("should set deliveredAt when status is Delivered", async () => {
      const mockOrder = {
        orderStatus: "Processing",
        save: jest.fn().mockResolvedValue({}),
      };

      Order.findById.mockResolvedValue(mockOrder);

      await updateOrderStatus("123", "Delivered");

      expect(mockOrder.orderStatus).toBe("Delivered");
      expect(mockOrder.deliveredAt).toBeInstanceOf(Date);
    });
  });

  describe("getOrdersByUser", () => {
    it("should return paginated orders for user", async () => {
      const mockOrders = [
        { _id: "1", user: "123", orderStatus: "Pending" },
        { _id: "2", user: "123", orderStatus: "Delivered" },
      ];

      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockOrders),
            }),
          }),
        }),
      });

      Order.countDocuments.mockResolvedValue(10);

      const result = await getOrdersByUser("123", 1, 5);

      expect(Order.find).toHaveBeenCalledWith({ user: "123" });
      expect(result).toEqual({
        orders: mockOrders,
        total: 10,
        page: 1,
        pages: 2,
      });
    });
  });
});
