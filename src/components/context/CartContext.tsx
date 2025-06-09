import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Product = {
  name: string;
  price: number;
  image: string;
  slug: string;
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
};

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number | null;
  calculateShipping: (postalCode: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [shippingCost, setShippingCost] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(slug: string) {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setCart([]);
    setShippingCost(null);
  }

  async function calculateShipping(postalCode: string) {
    try {
      const response = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: postalCode.replace(/\D/g, ''),
          products: cart.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            width: item.width,
            height: item.height,
            length: item.length,
            weight: item.weight,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate shipping.");
      }

      const data = await response.json();
      setShippingCost(data.shippingCost); // Ajuste conforme o retorno real da sua API
    } catch (error) {
      console.error("Shipping calculation failed:", error);
      setShippingCost(null);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        shippingCost,
        calculateShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
