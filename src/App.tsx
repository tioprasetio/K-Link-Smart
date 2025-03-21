import { useEffect } from "react";
import { Route, Routes } from "react-router";
import { useDarkMode } from "./context/DarkMode";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/protectedRoute";
import Register from "./pages/Register";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import AllProduct from "./pages/AllProductPage";
import CategoryPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import CheckoutPage from "./pages/CheckoutPage";
import EditProfile from "./pages/EditProfile";

function App() {
  // const location = useLocation(); // Mengambil lokasi saat ini di React Router
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    // Tambahkan atau hapus class sesuai mode
    if (isDarkMode) {
      document.body.classList.add("bg-[#140c00]", "text-[#f0f0f0]");
      document.body.classList.remove("bg-[#f4f6f9]", "text-[#353535]");
    } else {
      document.body.classList.remove("bg-[#140c00]", "text-[#f0f0f0]");
      document.body.classList.add("bg-[#f4f6f9]", "text-[#353535]");
    }
  }, [isDarkMode]); // Akan berjalan setiap kali `isDarkMode` berubah

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <CheckoutProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/all-product" element={<AllProduct />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
              </Route>

              {/* Dynamic Route */}
              <Route
                path="/product/:productSlug"
                element={<ProductDetailPage />}
              />
              {/* Fungsi untuk not found jika tidak ada routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
