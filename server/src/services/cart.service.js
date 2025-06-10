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
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) throw new Error("Product not found in cart");

  item.quantity = quantity;

  return await cart.save();
};

export const removeCartItem = async (userId, productId) => {
  try {
    const result = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    ).populate("cartItems.product");

    if (!result) {
      throw new Error("Cart not found");
    }

    return result;
  } catch (error) {
    // If it's a version error, retry once
    if (error.name === "VersionError") {
      const result = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { cartItems: { product: productId } } },
        { new: true }
      ).populate("cartItems.product");

      if (!result) {
        throw new Error("Cart not found");
      }

      return result;
    }
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    const result = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { cartItems: [] } },
      { new: true }
    ).populate("cartItems.product");

    if (!result) {
      throw new Error("Cart not found");
    }

    return result;
  } catch (error) {
    // If it's a version error, retry once
    if (error.name === "VersionError") {
      const result = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { cartItems: [] } },
        { new: true }
      ).populate("cartItems.product");

      if (!result) {
        throw new Error("Cart not found");
      }

      return result;
    }
    throw error;
  }
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  return cart;
};
