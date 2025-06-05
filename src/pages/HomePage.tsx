// pages/HomePage.tsx
import { useMemo } from "react";
import { Link } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import useProducts from "../context/ProductContext";
import SkeletonListProduct from "../components/SkeletonListProduct";
import CardProduct from "../components/CardProduct";
import NavbarComponent from "../components/Navbar";
import Banner from "../components/Banner";
import SearchBar from "../components/SearchBar";
import Category from "../components/Categories";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";
import Payment from "../components/Payment";
import PopupVoucher from "../components/PopupVoucher";

const HomePage = () => {
  const { products, loading } = useProducts();
  const { isDarkMode } = useDarkMode();

  // Filter best sellers
  const bestSellers = useMemo(
    () => products.filter((product) => product.terjual > 2),
    [products]
  );

  // Batasi tampilan menjadi 4 produk
  const displayedBestSellers = useMemo(
    () => bestSellers.slice(0, 4),
    [bestSellers]
  );

  const displayedProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
      } pt-16 sm:pt-24 overflow-x-hidden w-full min-h-screen`}
    >
      <PopupVoucher />
      <NavbarComponent />
      <div className="p-4">
        <Banner />
        <SearchBar />
        {/* Kategori */}
        <div className="w-full">
          <div className="mx-auto">
            <h2
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } text-xl font-bold mb-4`}
            >
              Kategori
            </h2>
            <Category />
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="w-full">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-xl font-bold`}
              >
                Paling Laris
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#28a154] font-medium">
                  <Link to="/best-sellers">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedBestSellers.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* All Products Section */}
        <div className="w-full mt-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-xl font-bold`}
              >
                Semua Produk
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#28a154] font-medium">
                  <Link to="/all-product">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedProducts.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>
        <Payment />
      </div>
      <Footer />
      <Copyright />
    </div>
  );
};

export default HomePage;
