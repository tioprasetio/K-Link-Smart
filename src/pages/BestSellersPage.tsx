import { Link } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useMemo } from "react";
import useProducts from "../context/ProductContext";
import CardProduct from "../components/CardProduct";

const BestSellers = () => {
  const { products, loading, error } = useProducts();
  const { isDarkMode } = useDarkMode();

  // Filter best sellers
  const bestSellers = useMemo(
    () => products.filter((product) => product.terjual > 2),
    [products]
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={`${isDarkMode ? "text-white" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
        } overflow-x-hidden w-full min-h-screen pt-16 sm:pt-24`}
      >
        <div className="text-[#353535] text-xl font-medium p-6">
          <span
            className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}
          >
            <Link className="text-[#28a154]" to="/">
              Home
            </Link>{" "}
            / Best Sellers
          </span>
        </div>

        <div className="p-6 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Produk tidak ditemukan.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BestSellers;
