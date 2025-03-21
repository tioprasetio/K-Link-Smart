import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Product {
  id: number;
  name: string;
  harga: number;
  quantity: number;
  picture: string;
  bv: number;
}

interface CheckoutContextType {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    // Cek localStorage saat pertama kali render
    const storedProducts = localStorage.getItem("selectedProducts");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });

  // Simpan ke localStorage setiap kali `selectedProducts` berubah
  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  return (
    <CheckoutContext.Provider value={{ selectedProducts, setSelectedProducts }}>
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
