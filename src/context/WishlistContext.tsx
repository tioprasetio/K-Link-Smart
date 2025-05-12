import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  name?: string;
  harga?: number;
  picture?: string;
  bv?: number;
  beratPengiriman?: number;
  terjual?: number;
  average_rating?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  loading: boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth(); // Asumsikan useAuth menyediakan data user
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isLoggedIn, user?.id]);

  const fetchWishlist = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/wishlist?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!isLoggedIn || !user?.id) {
      throw new Error("User harus login untuk menambahkan ke wishlist");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/wishlist`,
        {
          user_id: user.id,
          product_id: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update state dengan data baru
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!isLoggedIn || !user?.id) {
      throw new Error("User harus login untuk menghapus dari wishlist");
    }

    try {
      const wishlistItem = wishlistItems.find(
        (item) => item.product_id === productId
      );
      if (!wishlistItem) return;

      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/wishlist/${
          wishlistItem.id
        }?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state dengan data baru
      await fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
