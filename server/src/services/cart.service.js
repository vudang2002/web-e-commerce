import Cart from "../models/cart.model.js";

export const getCartByUserId = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("cartItems.product");
};

export const addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, cartItems: [] });
  }

  const existingItem = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.cartItems.push({ product: productId, quantity });
  }

  return await cart.save();
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  const item = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (!item) throw new Error("Product not found in cart");

  item.quantity = quantity;

  return await cart.save();
};

export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  return await cart.save();
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  cart.cartItems = [];

  return await cart.save();
};
