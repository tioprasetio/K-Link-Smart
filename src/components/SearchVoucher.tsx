import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Voucher } from "../types/Voucher";
import { useDarkMode } from "../context/DarkMode"; // Perbaikan: gunakan hook untuk fetch voucher
import useVouchers from "../context/VoucherContext";

const SearchVoucher = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Voucher[]>([]);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Gunakan custom hook untuk mendapatkan voucher
  const { vouchers, loading, error } = useVouchers();

  // Debounce pencarian (delay 300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) {
        const filteredVouchers = vouchers.filter((voucher) =>
          voucher.code?.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredVouchers);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer); // Cleanup timer untuk mencegah delay tumpang tindih
  }, [query, vouchers]);

  // Fungsi navigasi ke hasil pencarian
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      navigate(`/voucher?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  // Navigasi ke halaman voucher berdasarkan slug
  const handleSuggestionClick = (voucher: Voucher) => {
    navigate(`/voucher/${voucher.id}-${voucher.code.replace(/\s+/g, "-")}`, {
      state: voucher,
    });
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative pb-6 z-30">
      <form onSubmit={handleSearchSubmit} className="w-full mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            className={`${
              isDarkMode
                ? "bg-[#303030] text-white border-gray-700"
                : "bg-white text-[#353535] border-gray-300"
            } block w-full p-4 ps-10 text-sm border rounded-lg focus:ring-[#28a154] focus:border-[#28a154]`}
            placeholder="Cari voucher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="text-white cursor-pointer absolute end-2.5 bottom-2.5 bg-[#28a154] hover:bg-[#167e3c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Tampilkan loading jika data masih dimuat */}
      {loading && <p className="text-gray-500 mt-2">Memuat voucher...</p>}

      {/* Tampilkan error jika gagal memuat data */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Tampilkan hasil pencarian */}
      {suggestions.length > 0 && (
        <ul
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-white text-[#353535]"
          } absolute mt-1 w-full rounded-md shadow-lg`}
        >
          {suggestions.map((voucher) => (
            <li
              key={voucher.id} // Perbaikan: Pastikan ID voucher valid
              className={`${
                isDarkMode ? "hover:bg-[#252525]" : "hover:bg-gray-100"
              } p-2 cursor-pointer`}
              onClick={() => handleSuggestionClick(voucher)}
            >
              {voucher.code}
            </li>
          ))}
        </ul>
      )}

      {/* Tampilkan jika tidak ada hasil */}
      {suggestions.length === 0 && query.length > 0 && (
        <ul
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-white text-[#353535]"
          } absolute mt-1 w-full rounded-md shadow-lg`}
        >
          <p className="p-2">Voucher tidak ditemukan.</p>
        </ul>
      )}
    </div>
  );
};

export default SearchVoucher;
