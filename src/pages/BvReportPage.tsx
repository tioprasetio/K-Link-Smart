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

interface BvSummary {
  user_id: string;
  bv_period_id: string;
  total_bv: number;
  plan_a: number;
  plan_b: number;
  total_downline_bv: number; // Added field for downline BV
  grand_total_bv: number; // Added field for combined total
}

interface DownlineBvDetail {
  from_user_id: string;
  downline_name: string;
  downline_email: string;
  total_bv: number;
}

interface DownlineBvSummary {
  period_id: number;
  period_name: string;
  downlines: DownlineBvDetail[];
  total_downline_bv: number;
}

interface Transaction {
  id: number;
  order_id: string;
  id_plan: number;
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

// Interface untuk menampung BV per plan
interface BvByPlan {
  id_plan: number;
  plan_name: string;
  total_bv: number;
  transactions: Transaction[];
}

interface BvSummary {
  user_id: string;
  bv_period_id: string;
  total_bv: number;
  plan_a: number;
  plan_b: number;
}

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Period } from "../types/BvPeriod";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router";
import { formatRupiah } from "../utils/formatCurrency";
import { getPlanName } from "../utils/getPlanName";
import usePlans from "../context/PlanContext";
import BVRuleModal from "../components/BvRuleModal";

const BVReport = () => {
  const [report, setReport] = useState<BvReportResponse["data"] | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { plans } = usePlans();
  const [bvSummary, setBvSummary] = useState<BvSummary | null>(null);
  const [bvSummaryError, setBvSummaryError] = useState<string | null>(null);
  const [bvLoading, setBvLoading] = useState<boolean>(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  // New state for downline BV data
  const [downlineBvSummary, setDownlineBvSummary] =
    useState<DownlineBvSummary | null>(null);
  const [downlineBvLoading, setDownlineBvLoading] = useState<boolean>(false);
  const [showDownlineDetails, setShowDownlineDetails] =
    useState<boolean>(false);

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

  const bvByPlan = useMemo(() => {
    if (!report || !plans) return [];

    // Membuat grup transaksi berdasarkan plan
    const planGroups = new Map<number, BvByPlan>();

    filteredOrders.forEach((transaction) => {
      const planId = transaction.id_plan;
      const planName = getPlanName(planId, plans) || "Unknown Plan";

      // Menambahkan plan ke grup jika belum ada
      if (!planGroups.has(planId)) {
        planGroups.set(planId, {
          id_plan: planId,
          plan_name: planName,
          total_bv: 0,
          transactions: [],
        });
      }

      // Menambahkan BV transaksi ke total plan
      const group = planGroups.get(planId)!;
      group.total_bv += Number(transaction.total_bv);
      group.transactions.push(transaction);
    });

    // Mengubah Map menjadi array dan mengurutkan berdasarkan BV tertinggi
    return Array.from(planGroups.values()).sort(
      (a, b) => b.total_bv - a.total_bv
    );
  }, [filteredOrders, plans]);

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
  }, [selectedPeriod, token]);

  useEffect(() => {
    if (!selectedPeriod) return;

    const fetchDownlineBvSummary = async () => {
      setDownlineBvLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/downline-bv-summary`,
          {
            params: { period_id: selectedPeriod },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDownlineBvSummary(res.data.data);
      } catch (error) {
        console.error("Failed to load downline BV summary", error);
      } finally {
        setDownlineBvLoading(false);
      }
    };

    fetchDownlineBvSummary();
  }, [selectedPeriod, token]);

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

  useEffect(() => {
    if (!selectedPeriod) return;

    const fetchBvSummary = async () => {
      try {
        setBvLoading(true);
        setBvSummaryError(null);
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/bv-summary?bv_period_id=${selectedPeriod}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data?.is_calculated === false) {
          setBvSummary(null);
          setBvSummaryError(res.data.message || "Periode belum dikalkulasi.");
        } else {
          setBvSummary(res.data);
        }
        setBvSummary(res.data);
      } catch (error) {
        console.error("Failed to load BV summary", error);
        setBvSummaryError("Gagal memuat data BV Summary");
      } finally {
        setBvLoading(false);
      }
    };

    fetchBvSummary();
  }, [selectedPeriod, token]);

  const toggleDownlineDetails = () => {
    setShowDownlineDetails(!showDownlineDetails);
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex gap-2 justify-center items-center min-h-screen z-9999`}
      >
        <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );
  }

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
            onClick={() => navigate("/profile")}
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
                : "bg-[#F4F6F9] text-[#353535] border-gray-200 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
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
                      : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                  } p-3 rounded-lg`}
                >
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-sm`}
                  >
                    Periode
                  </p>
                  <p className="font-bold">{report.period.name}</p>
                </div>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                  } p-3 rounded-lg`}
                >
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-sm`}
                  >
                    Total BV
                  </p>
                  <p className="font-bold">{report.total_bv}</p>
                </div>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                  } p-3 rounded-lg`}
                >
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-sm`}
                  >
                    Rentang Waktu
                  </p>
                  <p className="font-bold">
                    {formatDate(report.period.start_date)} -{" "}
                    {formatDate(report.period.end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian baru: Tampilan BV per Plan */}
            {bvByPlan.length > 0 && (
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
                  } font-bold text-lg mb-3`}
                >
                  BV Plan {report.period.name}
                </h3>
                <div className="space-y-3">
                  {bvByPlan.map((planData) => (
                    <div
                      key={planData.id_plan}
                      className={`${
                        isDarkMode
                          ? "bg-[#252525] text-[#f0f0f0]"
                          : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                      } p-3 rounded-lg flex justify-between items-center`}
                    >
                      <div>
                        <p className="font-medium">{planData.plan_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#28a154]">
                          {planData.total_bv} BV
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alokasi BV Plan dari endpoint bv-summary */}
                <hr
                  className={`${
                    isDarkMode ? "border-gray-500" : "border-gray-300"
                  } mt-4 mb-4 border-t`}
                />
                <div className="flex flex-row items-center mb-3">
                  <h3
                    className={`${
                      isDarkMode ? "text-[#28a154]" : "text-[#4dd27e]"
                    } font-bold text-lg`}
                  >
                    Alokasi BV Plan {report.period.name}
                  </h3>
                  <button
                    onClick={() => setShowRuleModal(true)}
                    type="button"
                    className="ml-auto text-xl text-primary cursor-pointer"
                  >
                    <i className="text-xl bx bx-info-circle text-[#28a154]"></i>
                  </button>
                </div>

                <BVRuleModal
                  show={showRuleModal}
                  onClose={() => setShowRuleModal(false)}
                />

                {bvLoading ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">
                      Memuat data kalkulasi BV...
                    </p>
                  </div>
                ) : bvSummaryError ? (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">
                      <i className="bx bx-x-circle mr-1"></i>
                      {bvSummaryError}
                    </p>
                  </div>
                ) : bvSummary ? (
                  <div className="space-y-3">
                    <div className="flex flex-row gap-4">
                      <div
                        className={`${
                          isDarkMode
                            ? "bg-[#252525] text-[#f0f0f0]"
                            : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                        } p-3 rounded-lg w-full flex justify-between items-center`}
                      >
                        <div>
                          <p className="font-medium">Plan A</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#28a154]">
                            {bvSummary.plan_a} BV
                          </p>
                        </div>
                      </div>

                      <div
                        className={`${
                          isDarkMode
                            ? "bg-[#252525] text-[#f0f0f0]"
                            : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                        } p-3 rounded-lg w-full flex justify-between items-center`}
                      >
                        <div>
                          <p className="font-medium">Plan B</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#28a154]">
                            {bvSummary.plan_b} BV
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode
                          ? "bg-[#252525] text-[#f0f0f0]"
                          : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                      } p-3 rounded-lg flex justify-between items-center`}
                    >
                      <div>
                        <p className="font-medium">Total BV</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#28a154]">
                          {bvSummary.total_bv} BV
                        </p>
                      </div>
                    </div>
                    {downlineBvLoading ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Memuat data BV dari downline...
                        </p>
                      </div>
                    ) : (
                      downlineBvSummary && (
                        <>
                          <div
                            className={`${
                              isDarkMode
                                ? "bg-[#252525] text-[#f0f0f0]"
                                : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                            } p-3 rounded-lg flex justify-between items-center`}
                          >
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={toggleDownlineDetails}
                            >
                              <p className="font-medium">BV dari Downline</p>
                              <button className="ml-2 text-sm text-[#28a154] cursor-pointer">
                                <i
                                  className={`bx ${
                                    showDownlineDetails
                                      ? "bx-chevron-up"
                                      : "bx-chevron-down"
                                  } text-xl`}
                                ></i>
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#28a154]">
                                {downlineBvSummary.total_downline_bv} BV
                              </p>
                            </div>
                          </div>

                          {showDownlineDetails && (
                            <div className="mt-2">
                              {downlineBvSummary.downlines.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto pl-4 pr-4 space-y-2">
                                  {downlineBvSummary.downlines.map(
                                    (downline, index) => (
                                      <div
                                        key={index}
                                        className={`${
                                          isDarkMode
                                            ? "bg-[#252525] text-[#f0f0f0]"
                                            : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                                        } p-3 rounded-lg flex justify-between items-center`}
                                      >
                                        <div>
                                          <p className="font-medium">
                                            {downline.downline_name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {downline.downline_email}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-bold text-[#28a154]">
                                            {downline.total_bv} BV
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Tidak ada data BV dari downline
                                </p>
                              )}
                            </div>
                          )}
                          <div className="p-3 bg-[#28a154] text-[#FFFFFF] rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                Grand Total BV (Personal + Downline)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#FFFFFF] text-lg">
                                {bvSummary.total_bv +
                                  downlineBvSummary.total_downline_bv}{" "}
                                BV
                              </p>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            )}

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
                    ? "bg-[#303030] text-[#FFFFFF] border-gray-700 placeholder-gray-300"
                    : "bg-[#f4f6f9] text-[#353535] border-gray-300 placeholder-gray-400 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                } mb-4 px-4 py-2 border rounded-lg w-full focus:ring-[#28a154] focus:border-[#28a154]`}
              />

              {filteredOrders.length === 0 ? (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-600 text-sm">
                    <i className="bx bx-x-circle mr-1"></i>
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
                          <i className="bx bx-right-arrow-alt"></i>{" "}
                          {getPlanName(transaction.id_plan, plans)}
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
                            isDarkMode
                              ? "bg-[#252525]"
                              : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
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
                        isDarkMode
                          ? "bg-[#252525]"
                          : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
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
