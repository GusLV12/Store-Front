// src/Context/CartContext/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const setProductQuantity = (product, quantity) => {
    if (quantity < 1) {
      setCart(prev => prev.filter(item => item.barcode !== product.barcode));
    } else {
      setCart(prev => {
        const exists = prev.find(item => item.barcode === product.barcode);
        if (exists) {
          return prev.map(item =>
            item.barcode === product.barcode ? { ...item, quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const getQuantity = (barcode) => {
    const item = cart.find(p => p.barcode === barcode);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCart([]);
  const removeFromCart = (barcode) =>
    setCart(prev => prev.filter(item => item.barcode !== barcode));

  return (
    <CartContext.Provider value={{ cart, setProductQuantity, getQuantity, clearCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
