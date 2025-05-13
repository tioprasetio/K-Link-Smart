import { Link, useSearchParams } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState } from "react";
import useProducts from "../context/ProductContext";
import CardProduct from "../components/CardProduct";

const AllProduct = () => {
  const { products, loading, error } = useProducts();
  const { isDarkMode } = useDarkMode();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword"); //Ambil keyword dari URL
  const sort = searchParams.get("sort"); // termurah / termahal
  const minRating = parseFloat(searchParams.get("rating") ?? "0");

  useEffect(() => {
    let filtered = [...products];

    // Filter berdasarkan keyword
    if (keyword) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

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
  }, [keyword, sort, minRating, products]);

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
            / Semua Produk
          </span>
        </div>

        <div className="flex gap-4 px-6">
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
            }border p-2 rounded focus:outline-none focus:ring-green-500 focus:border-green-500`}
          >
            <option value="">Urutkan Harga</option>
            <option value="termurah">Termurah ke Termahal</option>
            <option value="termahal">Termahal ke Termurah</option>
          </select>

          <select
            onChange={(e) => {
              searchParams.set("rating", e.target.value);
              setSearchParams(searchParams);
            }}
            defaultValue={minRating || ""}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            }border p-2 rounded focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4">
              <p className="text-left text-gray-500">Produk tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllProduct;
