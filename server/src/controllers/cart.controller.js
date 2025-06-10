import * as cartService from "../services/cart.service.js";
import { createResponse } from "../utils/response.util.js";

export const getCart = async (req, res) => {
  const cart = await cartService.getCartByUserId(req.user._id);
  res.json(createResponse(true, "Cart retrieved successfully", cart));
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user._id, productId, quantity);
  res.status(201).json(createResponse(true, "Product added to cart", cart));
};

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(
    req.user._id,
    productId,
    quantity
  );
  res.json(createResponse(true, "Cart item updated", cart));
};

export const removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.removeCartItem(req.user._id, productId);
  res.json(createResponse(true, "Product removed from cart", cart));
};

export const clearCart = async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json(createResponse(true, "Cart cleared successfully", cart));
};
