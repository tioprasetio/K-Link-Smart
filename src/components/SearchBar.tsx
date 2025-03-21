// components/SearchBar.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import { Product } from "../types/Product";
import useProducts from "../context/ProductContext";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Ambil data produk dari custom hook
  const { products, loading } = useProducts();

  // Debounce pencarian (delay 300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) {
        const filteredProducts = products.filter((product) =>
          product.name?.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredProducts);
      } else {
        setSuggestions([]);
      }
    }, 300); // Delay 300ms

    return () => clearTimeout(timer); // Cleanup timer agar tidak ada delay tumpang tindih
  }, [query, products]);

  // Membuat slug dari nama produk
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  // Gunakan useCallback untuk menghindari re-render yang tidak perlu
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  // Navigasi ke hasil pencarian
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      navigate(`/all-product?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  // Navigasi ke halaman produk dengan ID + Slug
  const handleSuggestionClick = (product: Product) => {
    navigate(`/product/${product.id}-${generateSlug(product.name)}`, {
      state: product,
    });
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative pb-6 z-30">
      <form onSubmit={handleSearchSubmit} className="w-full mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className={`${
              isDarkMode
                ? "bg-[#303030] text-white border-gray-700"
                : "bg-white text-[#353535] border-gray-300"
            } block w-full p-4 ps-10 text-sm border rounded-lg focus:ring-[#28a154] focus:border-[#28a154]`}
            placeholder="Cari produk"
            value={query}
            onChange={handleSearch}
            required
            disabled={loading} // Nonaktifkan input saat loading
          />
          <button
            type="submit"
            className="text-white cursor-pointer absolute end-2.5 bottom-2.5 bg-[#28a154] hover:bg-[#167e3c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? "Loading..." : "Cari"}
          </button>
        </div>
      </form>

      {/* Tampilkan indikator loading */}
      {loading && (
        <div className="absolute mt-2 w-full text-center">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      )}

      {/* Tampilkan hasil pencarian */}
      {!loading && suggestions.length > 0 && (
        <ul
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0] shadow-xl"
              : "bg-white text-[#353535]"
          } absolute mt-1 w-full rounded-md shadow-lg`}
        >
          {suggestions.map((product) => (
            <li
              key={product.id}
              className={`${
                isDarkMode
                  ? "hover:bg-[#252525] rounded-md"
                  : "hover:bg-gray-100 rounded-md"
              } p-2 cursor-pointer`}
              onClick={() => handleSuggestionClick(product)}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}

      {/* Tampilkan jika tidak ada hasil */}
      {!loading && suggestions.length === 0 && query.length > 0 && (
        <ul
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-white text-[#353535]"
          } absolute mt-1 w-full rounded-md shadow-lg`}
        >
          <p
            className={`${
              isDarkMode ? "hover:bg-[#252525]" : "hover:bg-gray-100"
            } p-2 cursor-pointer`}
          >
            Produk tidak ditemukan.
          </p>
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
