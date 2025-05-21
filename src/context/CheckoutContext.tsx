import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Product {
  id: number;
  product_id: number;
  name: string;
  harga: number;
  stock: number;
  quantity: number;
  picture: string;
  bv: number;
  beratPengiriman: number;
  variant?: string;
}

interface CheckoutContextType {
  selectedProducts: Product[];
  isLoading: boolean;
  setSelectedProducts: (products: Product[]) => void;
  checkoutToken: string | null;
  setCheckoutToken: (token: string | null) => void;
  cancelCheckout: () => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <--- tambah loading state

  useEffect(() => {
    const token = localStorage.getItem("checkoutToken");
    if (token) setCheckoutToken(token);
  }, []);

  useEffect(() => {
    if (checkoutToken) {
      localStorage.setItem("checkoutToken", checkoutToken);
    }
  }, [checkoutToken]);

  useEffect(() => {
    if (!checkoutToken) {
      setIsLoading(false); // token gak ada berarti gak perlu loading data
      return;
    }

    async function fetchTemporaryCheckout() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/checkout-temp/${checkoutToken}`
        );
        setSelectedProducts(res.data.selected_products);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Gagal load temporary checkout:", error);
        setSelectedProducts([]); // reset kalau gagal
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemporaryCheckout();
  }, [checkoutToken]);

  useEffect(() => {
    if (selectedProducts.length === 0) return;

    async function saveTemporaryCheckout() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/checkout-temp`,
          {
            selected_products: selectedProducts,
            checkout_token: checkoutToken,
          }
        );

        setCheckoutToken(res.data.checkout_token);
      } catch (error) {
        console.error("Gagal simpan temporary checkout:", error);
      }
    }

    saveTemporaryCheckout();
  }, [selectedProducts]);

  const cancelCheckout = async () => {
    if (!checkoutToken) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/checkout-temp/${checkoutToken}`
      );
      localStorage.removeItem("checkoutToken");
      setSelectedProducts([]);
      setCheckoutToken(null);
    } catch (error) {
      console.error("Gagal membatalkan checkout:", error);
      throw error; // biar bisa di-handle dari luar
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        isLoading,
        checkoutToken,
        setCheckoutToken,
        cancelCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
