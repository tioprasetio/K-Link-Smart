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
import CheckoutPage from "./pages/CheckoutPage";
import EditProfile from "./pages/EditProfile";
import GuestRoute from "./routes/guestRoute";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import ProfilePage from "./pages/ProfilePage";
import MyOrderPage from "./pages/MyOrderPage";
import BestSellers from "./pages/BestSellersPage";
import VoucherPage from "./pages/VoucherPage";
import VoucherDetailPage from "./pages/VoucherDetailPage";
import HistoryBvPage from "./pages/HistoryBvPage";
import AboutUsPage from "./pages/AboutUsPage";
import DownlinePage from "./pages/DownlinePage";
import WhyUsPage from "./pages/WhyUsPage";
import ShippingRatePage from "./pages/ShippingRatePage";
import ReplacemenetPage from "./pages/ReplacementPage";
import DeliveryPage from "./pages/DeliveryPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import HowToOrderPage from "./pages/HowToOrder";
import MyOrderDetailPage from "./pages/MyOrderDetailPage";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage from "./pages/WishlistPage";
import { ReviewProvider } from "./context/ReviewContext";
import BVReport from "./pages/BvReportPage";

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
        <ReviewProvider>
          <WishlistProvider>
            <CartProvider>
              <CheckoutProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/why" element={<WhyUsPage />} />
                  <Route path="/shipping-rate" element={<ShippingRatePage />} />
                  <Route path="/replacement" element={<ReplacemenetPage />} />
                  <Route path="/delivery" element={<DeliveryPage />} />
                  <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route path="/how-to-order" element={<HowToOrderPage />} />
                  <Route element={<GuestRoute />}>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                  </Route>
                  <Route path="/all-product" element={<AllProduct />} />
                  <Route path="/best-sellers" element={<BestSellers />} />
                  <Route path="/voucher" element={<VoucherPage />} />
                  {/* Dynamic Route */}
                  <Route
                    path="/voucher/:voucherSlug"
                    element={<VoucherDetailPage />}
                  />
                  <Route
                    path="/category/:category"
                    element={<CategoryPage />}
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/payment-callback"
                    element={<PaymentCallbackPage />}
                  />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-order" element={<MyOrderPage />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/history-bv" element={<HistoryBvPage />} />
                    <Route path="/downline" element={<DownlinePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route
                      path="/bv-report"
                      element={<BVReport />}
                    />
                    <Route
                      path="/my-order-detail/:order_id"
                      element={<MyOrderDetailPage />}
                    />
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
          </WishlistProvider>
        </ReviewProvider>
      </AuthProvider>
    </>
  );
}

export default App;
