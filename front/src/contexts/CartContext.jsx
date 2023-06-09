import axios from "axios";
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    try {
      const updatedCartItems = [...cartItems];
      const existingItemIndex = updatedCartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Si el producto ya existe en el carrito, actualizamos la cantidad
        const existingItem = updatedCartItems[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          amount: existingItem.amount + 1,
        };
        updatedCartItems[existingItemIndex] = updatedItem;
      } else {
        // Si el producto no existe en el carrito, lo agregamos con cantidad 1
        const newItem = {
          ...product,
          amount: 1,
        };
        updatedCartItems.push(newItem);
      }
      // Lo cambiamos al context
      setCartItems(updatedCartItems);
      // Cambiamos el order del la base de datos

      await axios.post("http://localhost:8000/api/cart/add", {
        userId: JSON.parse(localStorage).id, // Asegúrate de obtener el ID del usuario logeado
        productId: product.id,
      });

      // Otras acciones después de agregar el producto al carrito...
    } catch (error) {
      // Manejo de errores
    }
  };

  const removeFromCart = (productId) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex(
      (item) => item.id === productId
    );

    if (existingItemIndex !== -1) {
      const existingItem = updatedCartItems[existingItemIndex];

      // Si la cantidad es mayor a 1, restamos 1 a la cantidad
      if (existingItem.amount > 1) {
        const updatedItem = {
          ...existingItem,
          amount: existingItem.amount - 1,
        };
        updatedCartItems[existingItemIndex] = updatedItem;
      } else {
        // Si la cantidad es igual a 1, eliminamos el producto del carrito
        updatedCartItems.splice(existingItemIndex, 1);
      }

      setCartItems(updatedCartItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);

    // Borramos el order de la base de datos
  };

  const getTotalCost = () => {
    let total = 0;
    cartItems?.map((product) => {
      return (total += product.price * product.quantity);
    });
    return total;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCost,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
