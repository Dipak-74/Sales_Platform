import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "smart-sales-cart";
const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  const persist = (nextItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  const addItem = (product) => {
    setItems((current) => {
      const next = [...current];
      const productId = product.productId ?? product.id;
      const index = next.findIndex((item) => (item.productId ?? item.id) === productId);

      if (index >= 0) {
        next[index] = { ...next[index], quantity: Number(next[index].quantity || 1) + 1 };
      } else {
        next.push({ ...product, productId, quantity: 1 });
      }

      persist(next);
      return next;
    });
  };

  const removeItem = (productId) => {
    setItems((current) => {
      const next = current.filter((item) => (item.productId ?? item.id) !== productId);
      persist(next);
      return next;
    });
  };

  const updateQuantity = (productId, delta) => {
    setItems((current) => {
      const next = current
        .map((item) => {
          if ((item.productId ?? item.id) !== productId) {
            return item;
          }

          const updatedQty = Math.max(0, Number(item.quantity || 1) + delta);
          return { ...item, quantity: updatedQty };
        })
        .filter((item) => Number(item.quantity || 0) > 0);

      persist(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.sellingPrice ?? item.price ?? 0) * Number(item.quantity || 1), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      subtotal,
      count: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
