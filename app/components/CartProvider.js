'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const savedCart = localStorage.getItem('aerocove_cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart');
        }
      }
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aerocove_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Cart key is productId + phoneModelId (so same product + different model = separate items)
  const getCartKey = (productId, phoneModelId) => phoneModelId ? `${productId}_${phoneModelId}` : productId;

  const addToCart = (product, quantity = 1, phoneModel = null) => {
    setCartItems(prev => {
      const cartKey = getCartKey(product.id, phoneModel?.id);
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        ...product,
        cartKey,
        quantity,
        phoneModelId: phoneModel?.id || null,
        phoneModelName: phoneModel?.name || null,
      }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) return removeFromCart(cartKey);
    setCartItems(prev =>
      prev.map(item => item.cartKey === cartKey ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
