import { trackProductEvent } from "./analytics";
import { useEffect, useState } from "react";
import { products } from "./catalog";
import { productRoute } from "./catalogPaths";
export const CART_KEY = "baa-cart-v2";
const available = new Set(products.map(productRoute));
export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  const result = new Map();
  for (const row of value) {
    if (
      !row ||
      !available.has(row.id) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    )
      continue;
    result.set(row.id, {
      id: row.id,
      quantity: Math.min(
        99,
        (result.get(row.id)?.quantity || 0) + row.quantity,
      ),
    });
  }
  return [...result.values()];
}
export function useCart() {
  const [cart, setCart] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      localStorage.removeItem("baa-cart-v1");
      setCart(sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]")));
    } catch {
      setStorageError(true);
    } finally {
      setStorageReady(true);
    }
  }, []);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [cart, storageReady]);
  useEffect(() => {
    const sync = (e) => {
      if (e.key !== CART_KEY && e.key !== null) return;
      try {
        setCart(sanitizeCart(JSON.parse(e.newValue || "[]")));
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const add = (product) => {
    trackProductEvent("add_to_cart", product, 1);
    setCart((rows) =>
      sanitizeCart([...rows, { id: productRoute(product), quantity: 1 }]),
    );
  };
  const quantity = (id, value) => {
    if (!Number.isInteger(value) || value < 1 || value > 99) return;
    const row = cart.find((l) => l.id === id),
      product = products.find((p) => productRoute(p) === id);
    if (row && product && row.quantity !== value)
      trackProductEvent(
        value > row.quantity ? "add_to_cart" : "remove_from_cart",
        product,
        Math.abs(value - row.quantity),
      );
    setCart((rows) =>
      rows.map((row) => (row.id === id ? { ...row, quantity: value } : row)),
    );
  };
  const remove = (id) => {
    const row = cart.find((l) => l.id === id),
      product = products.find((p) => productRoute(p) === id);
    if (row && product)
      trackProductEvent("remove_from_cart", product, row.quantity);
    setCart((rows) => rows.filter((row) => row.id !== id));
  };
  const lines = cart.map((row) => ({
    ...row,
    product: products.find((p) => productRoute(p) === row.id),
  }));
  return {
    lines,
    count: cart.reduce((n, row) => n + row.quantity, 0),
    total: lines.reduce((n, row) => n + row.quantity * row.product.price, 0),
    add,
    quantity,
    remove,
    clear: () => {
      for (const line of lines)
        trackProductEvent("remove_from_cart", line.product, line.quantity);
      setCart([]);
    },
    storageError,
  };
}
