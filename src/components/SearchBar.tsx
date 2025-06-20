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

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) {
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;
  }

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

  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Browser tidak mendukung Speech Recognition");
      return;
    }

    recognition.start();

    recognition.onstart = () => {
      setQuery("Mendengarkan...");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
        .trim()
        .replace(/[.,!?]$/, "");

      setQuery(transcript);

      // Tunggu 500ms lalu jalankan pencarian otomatis
      setTimeout(() => {
        navigate(
          `/all-product?keyword=${encodeURIComponent(transcript.trim())}`
        );
      }, 500);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Voice recognition error:", event.error);
      setQuery("");
    };
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
                ? "bg-[#303030] text-white border-gray-700 placeholder-gray-300"
                : "bg-[#f4f6f9] text-[#353535] border-gray-300 placeholder-gray-400 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } block w-full p-4 ps-10 text-sm border rounded-lg focus:ring-[#28a154] focus:border-[#28a154]`}
            placeholder="Cari produk"
            value={query}
            onChange={handleSearch}
            required
            disabled={loading} // Nonaktifkan input saat loading
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`${
              isDarkMode
                ? "text-[#f0f0f0] bg-[#140C00]"
                : "text-[#353535] bg-[#f0f0f0]"
            } cursor-pointer absolute end-[65px] top-1/2 transform -translate-y-1/2 hover:text-white hover:bg-[#28a154] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2`}
          >
            <i className="bx bx-microphone"></i>
          </button>

          <button
            type="submit"
            className={`${
              isDarkMode
                ? "text-[#f0f0f0] bg-[#140C00]"
                : "text-[#f0f0f0] bg-[#28a154]"
            } cursor-pointer absolute end-2.5 top-1/2 transform -translate-y-1/2  hover:bg-[#167e3c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2`}
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? "Loading..." : <i className="bx bx-search"></i>}
          </button>
        </div>
      </form>

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
