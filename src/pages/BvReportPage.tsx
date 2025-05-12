// Interfaces untuk format respon API
interface TransactionProduct {
  product_id: number;
  product_name: string;
  picture: string | null;
  quantity: number;
  price: number;
  bv: number;
  variant: string;
  item_bv: number;
}

interface Transaction {
  id: number;
  order_id: string;
  created_at: string;
  gross_amount: number;
  status: string;
  total_bv: number;
  products: TransactionProduct[];
}

interface PeriodInfo {
  name: string;
  start_date: string;
  end_date: string;
}

interface BvReportResponse {
  status: string;
  data: {
    transactions: Transaction[];
    total_bv: number;
    period: PeriodInfo;
  };
}

import { useState, useEffect } from "react";
import axios from "axios";
import { Period } from "../types/BvPeriod";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router";
import { formatRupiah } from "../utils/formatCurrency";

const BVReport = () => {
  const [report, setReport] = useState<BvReportResponse["data"] | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { isDarkMode } = useDarkMode();

  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  // Menambahkan efek untuk mengambil period_id dari URL
  useEffect(() => {
    const periodParam = searchParams.get("period_id");
    if (periodParam) {
      setSelectedPeriod(Number(periodParam));
    }
  }, [searchParams]);

  const filteredOrders =
    report?.transactions.filter((transaction) =>
      inputValue
        ? transaction.order_id.toLowerCase().includes(inputValue.toLowerCase())
        : true
    ) || [];

  useEffect(() => {
    const fetchPeriods = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/bv-periods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPeriods(res.data.data);
      // Jika ada period_id di URL, gunakan itu
      const periodParam = searchParams.get("period_id");
      if (
        periodParam &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.data.data.some((p: any) => p.id === Number(periodParam))
      ) {
        setSelectedPeriod(Number(periodParam));
      } else if (res.data.data.length > 0) {
        // Jika tidak ada period_id di URL atau period_id tidak valid, gunakan periode pertama
        setSelectedPeriod(res.data.data[0].id);

        // Update URL dengan period_id periode pertama
        const newParams = new URLSearchParams(searchParams);
        newParams.set("period_id", res.data.data[0].id.toString());
        setSearchParams(newParams);
      }
    };
    fetchPeriods();
  }, []);

  useEffect(() => {
    if (!selectedPeriod) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/bv-report`,
          {
            params: { period_id: selectedPeriod },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReport(res.data.data);
      } catch (error) {
        console.error("Failed to load report", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedPeriod]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handler untuk mengubah periode dan memperbarui URL
  const handlePeriodChange = (periodId: number) => {
    setSelectedPeriod(periodId);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("period_id", periodId.toString());

    // Pertahankan parameter search jika ada
    if (inputValue) {
      newParams.set("search", inputValue);
    }

    setSearchParams(newParams);
  };

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140C00] text-[#FFFFFF]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10 max-w-4xl mx-auto`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Laporan BV Transaksi Saya</h1>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } mb-6 p-4 rounded-lg`}
        >
          <label
            className={`${
              isDarkMode ? "text-[#FFFFFF]" : "text-[#353535]"
            } block text-sm font-mediu mb-2`}
          >
            Pilih Periode
          </label>
          <select
            value={selectedPeriod || ""}
            onChange={(e) => handlePeriodChange(Number(e.target.value))}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            } block text-sm w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
            disabled={loading}
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} ({formatDate(period.start_date)} -{" "}
                {formatDate(period.end_date)})
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#f0f0f0]"
                  : "bg-[#FFFFFF] text-[#353535]"
              }  p-4 rounded-lg`}
            >
              <h3
                className={`${
                  isDarkMode ? "text-[#28a154]" : "text-[#4dd27e]"
                } font-bold text-lg `}
              >
                Ringkasan Periode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-[#F4F6F9] text-[#353535]"
                  } p-3 rounded-lg`}
                >
                  <p className="text-sm text-gray-500">Periode</p>
                  <p className="font-bold">{report.period.name}</p>
                </div>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-[#F4F6F9] text-[#353535]"
                  } p-3 rounded-lg`}
                >
                  <p className="text-sm text-gray-500">Total BV</p>
                  <p className="font-bold">{report.total_bv}</p>
                </div>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-[#F4F6F9] text-[#353535]"
                  } p-3 rounded-lg`}
                >
                  <p className="text-sm text-gray-500">Rentang Waktu</p>
                  <p className="font-bold">
                    {formatDate(report.period.start_date)} -{" "}
                    {formatDate(report.period.end_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Detail Transaksi</h3>

              <input
                type="text"
                placeholder="Cari Order ID..."
                value={inputValue}
                onChange={(e) => {
                  const newSearch = e.target.value;
                  setInputValue(newSearch);
                  const newParams = new URLSearchParams(searchParams);

                  if (newSearch) {
                    newParams.set("search", newSearch);
                  } else {
                    newParams.delete("search");
                  }

                  // Pertahankan parameter period_id
                  if (selectedPeriod) {
                    newParams.set("period_id", selectedPeriod.toString());
                  }

                  setSearchParams(newParams);
                }}
                className={`${
                  isDarkMode
                    ? "bg-[#404040] text-[#f0f0f0] border-[#282828] placeholder-gray-300"
                    : "bg-[#FFFFFF] text-[#353535] border-gray-200 placeholder-gray-400"
                } mb-4 px-4 py-2 border rounded-lg w-full`}
              />

              {filteredOrders.length === 0 ? (
                <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4">
                  <p
                    className={`${
                      isDarkMode ? "text-[#353535]" : "text-[#353535]"
                    } text-left`}
                  >
                    Tidak ada transaksi pada periode ini
                  </p>
                </div>
              ) : (
                filteredOrders.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`${
                      isDarkMode
                        ? "bg-[#404040] text-[#f0f0f0]"
                        : "bg-[#FFFFFF] text-[#353535]"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {transaction.order_id}
                        </h4>
                        <p
                          className={`${
                            isDarkMode ? "text-[#C1C1C1]" : "text-gray-500"
                          } text-sm  flex items-center gap-2`}
                        >
                          {formatDate(transaction.created_at)}{" "}
                          <i className="bx bx-right-arrow-alt"></i>{" "}
                          {transaction.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Total Belanja</p>
                        <p className="font-bold">
                          {formatCurrency(transaction.gross_amount)}
                        </p>
                      </div>
                    </div>

                    <div className="divide-y mt-4">
                      {transaction.products.map((product) => (
                        <div
                          key={`${transaction.id}-${product.product_id}`}
                          className={`${
                            isDarkMode ? "bg-[#252525]" : "bg-[#f4f6f9]"
                          } flex p-3 rounded-lg mb-2`}
                        >
                          <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                            {product.picture && (
                              <img
                                src={`${import.meta.env.VITE_API_URL}/storage/${
                                  product.picture
                                }`}
                                alt={product.product_name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <h5 className="font-medium truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                                  {product.product_name}
                                </h5>
                                {product.variant && (
                                  <h5 className="text-sm">
                                   Variant: {product.variant}
                                  </h5>
                                )}
                                <p className="text-sm">
                                  {formatRupiah(product.price)}
                                </p>
                                <span className="font-medium text-[#28a154]">
                                  {product.item_bv} BV
                                </span>
                              </div>
                              {/* Quantity dan Subtotal (sejajar ke kanan) */}
                              <div className="flex flex-col items-end">
                                <span className="text-sm">
                                  x{product.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatRupiah(
                                    product.price * product.quantity
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`${
                        isDarkMode ? "bg-[#252525]" : "bg-[#f4f6f9]"
                      } p-2 rounded-lg mt-2`}
                    >
                      <div className="flex justify-between items-center">
                        <p
                          className={`${
                            isDarkMode ? "text-[#C1C1C1]" : "text-gray-500"
                          } text-sm`}
                        >
                          Total BV Transaksi
                        </p>
                        <p className="font-bold text-[#28a154]">
                          {transaction.total_bv} BV
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BVReport;
