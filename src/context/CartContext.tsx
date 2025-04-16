import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getEmailFromToken, isUserLoggedIn } from "../utils/authUtils";
import Swal from "sweetalert2";

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  stock: number;
  harga: number;
  picture: string;
  quantity: number;
  beratPengiriman: number;
  bv: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  decreaseQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (cartId: number) => void;
  fetchCart: () => void;
  clearCheckedOutItems: (selectedProducts: CartItem[]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const userEmail = getEmailFromToken();
  // Ambil data keranjang saat komponen dimuat atau saat userEmail berubah
  useEffect(() => {
    if (isUserLoggedIn() && userEmail) {
      console.log("Fetching cart for user:", userEmail); // Debugging
      fetchCart();
    }
  }, [userEmail]);

  // Fungsi untuk mengambil data keranjang
  const fetchCart = async () => {
    const userEmail = getEmailFromToken(); // Ambil email dari token
    if (!userEmail) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cart?email=${userEmail}`
      );
      setCart(response.data); // Perbarui state cart
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!userEmail) {
      console.error("User email not found in token");
      return;
    }

    const product = cart.find((item) => item.product_id === productId);
    if (product && quantity > product.stock) {
      Swal.fire(
        "Error",
        "Jumlah yang dibeli melebihi stok yang tersedia",
        "error"
      );
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/cart`, {
        user_email: userEmail,
        product_id: productId,
        quantity,
      });
      fetchCart(); // Refresh data keranjang
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const decreaseQuantity = async (productId: number, quantity: number) => {
    if (!userEmail) {
      console.error("User email not found in token");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/cart/decrease`, {
        user_email: userEmail,
        product_id: productId,
        quantity,
      });
      fetchCart(); // Refresh data keranjang
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/${cartId}`
      );
      fetchCart(); // Refresh data keranjang
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = () => {
    setCart([]); // Kosongkan cart
  };

  const clearCheckedOutItems = async (selectedProducts: CartItem[]) => {
    try {
      // Loop melalui selectedProducts dan hapus dari cart
      for (const product of selectedProducts) {
        await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/${product.id}`
        );
      }

      // Refresh data keranjang setelah menghapus item
      fetchCart();
    } catch (error) {
      console.error("Error clearing checked out items:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        fetchCart,
        clearCheckedOutItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
