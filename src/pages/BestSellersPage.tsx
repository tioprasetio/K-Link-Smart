import { Link, useSearchParams } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useMemo, useState } from "react";
import useProducts from "../context/ProductContext";
import CardProduct from "../components/CardProduct";

const BestSellers = () => {
  const { products, loading, error } = useProducts();
  const { isDarkMode } = useDarkMode();

  // Mengambil query params
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort"); // termurah / termahal
  const minRating = parseFloat(searchParams.get("rating") ?? "0");

  // Filter best sellers
  const bestSellers = useMemo(
    () => products.filter((product) => product.terjual > 2),
    [products]
  );

  // Filter berdasarkan rating dan harga
  const [filteredProducts, setFilteredProducts] = useState(bestSellers);

  useEffect(() => {
    let filtered = [...bestSellers];

    // Filter berdasarkan rating minimal
    filtered = filtered.filter((product) => {
      const rating = product.average_rating || 0;
      return rating >= minRating;
    });

    // Sortir harga
    if (sort === "termurah") {
      filtered.sort((a, b) => a.harga - b.harga);
    } else if (sort === "termahal") {
      filtered.sort((a, b) => b.harga - a.harga);
    }

    setFilteredProducts(filtered);
  }, [bestSellers, sort, minRating]);

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

        <div className="flex gap-4 px-6">
          {/* Filter berdasarkan Harga */}
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                searchParams.delete("sort"); // Hapus param jika kosong
              } else {
                searchParams.set("sort", value);
              }
              setSearchParams(searchParams);
            }}
            value={sort || ""}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            } p-2 rounded-lg text-center font-semibold border border-green-500 text-green-600 focus:ring-green-500 focus:border-green-500 transition cursor-pointer`}
          >
            <option value="">Urutkan Harga</option>
            <option value="termurah">Termurah ke Termahal</option>
            <option value="termahal">Termahal ke Termurah</option>
          </select>

          {/* Filter berdasarkan Rating */}
          <select
            onChange={(e) => {
              searchParams.set("rating", e.target.value);
              setSearchParams(searchParams);
            }}
            value={minRating || ""}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            } p-2 rounded-lg text-center font-semibold border border-green-500 text-green-600 focus:ring-green-500 focus:border-green-500 transition cursor-pointer`}
          >
            <option value="0">Semua Rating</option>
            <option value="1">⭐1</option>
            <option value="2">⭐2</option>
            <option value="3">⭐3</option>
            <option value="4">⭐4</option>
            <option value="5">⭐5</option>
          </select>
        </div>

        <div className="p-6 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
