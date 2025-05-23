import { useEffect, useState } from "react";
import axios from "axios";
import NavbarComponent from "../components/Navbar";
import { Bonus } from "../types/Bonus";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkMode";
import { useNavigate, useSearchParams } from "react-router";
import { Period } from "../types/BvPeriod";
import { formatDate } from "../utils/formatDate";
import { formatRupiah } from "../utils/formatCurrency";

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

const BonusPage = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBonus = bonuses.find((b) => b.bv_period_id === selectedPeriod);

  // New state for downline BV data
  const [downlineBvSummary, setDownlineBvSummary] =
    useState<DownlineBvSummary | null>(null);
  const [downlineBvLoading, setDownlineBvLoading] = useState<boolean>(false);
  const [showDownlineDetails, setShowDownlineDetails] =
    useState<boolean>(false);

  // Menambahkan efek untuk mengambil period_id dari URL
  useEffect(() => {
    const periodParam = searchParams.get("period_id");
    if (periodParam) {
      setSelectedPeriod(Number(periodParam));
    }
  }, [searchParams]);

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

  // Handler untuk mengubah periode dan memperbarui URL
  const handlePeriodChange = (periodId: number) => {
    setSelectedPeriod(periodId);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("period_id", periodId.toString());

    setSearchParams(newParams);
  };

  const toggleDownlineDetails = () => {
    setShowDownlineDetails(!showDownlineDetails);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get<Bonus[]>(`${import.meta.env.VITE_APP_API_URL}/api/bonuses/`, {
          params: {
            bv_period_id: selectedPeriod || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBonuses(res.data);
        })
        .catch((err) => {
          console.error("Gagal ambil bonus", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, token, selectedPeriod]);

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
    <div>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140C00] text-[#FFFFFF]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10 max-w-4xl mx-auto`} // Klo mau full hapus max-w-4xl mx-auto
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Bonus Saya</h1>
        </div>

        {bonuses.map((bonus) => (
          <div
            key={bonus.id}
            className={`text-[#FFFFFF] p-4 rounded-lg flex flex-col gap-4 mb-4 mt-4 ${
              bonus.status === "paid" ? "bg-[#28A154]" : "bg-gray-500"
            }`}
          >
            <div className="flex flex-row justify-between w-full">
              <h1 className="text-sm font-bold">Bonus bulan</h1>
              <p className="text-sm">
                {periods.find((p) => p.id === selectedPeriod)?.name}
              </p>
            </div>
            <h1 className="text-2xl font-bold">
              {formatRupiah(bonus.bonus_rupiah)}
            </h1>
          </div>
        ))}

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
              {period.name} ({formatDate(period.start_date as string)} -{" "}
              {formatDate(period.end_date as string)})
            </option>
          ))}
        </select>

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Rincian Detail</h3>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex flex-col gap-4 mb-4 mt-4`}
        >
          <div
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } p-3 rounded-lg flex justify-between items-center`}
          >
            <h1 className="">Downline Bv</h1>
            <p>{selectedBonus?.total_downline_bv || 0}</p>
          </div>

          <div
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } p-3 rounded-lg flex justify-between items-center`}
          >
            <h1 className="">Bonus Didapat</h1>
            <p>{formatRupiah(selectedBonus?.bonus_rupiah || 0)}</p>
          </div>

          <div
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } p-3 rounded-lg flex justify-between items-center`}
          >
            <h1 className="">Status</h1>
            <p>
              {selectedBonus?.status === "paid"
                ? "Sudah dibayar"
                : "Belum dibayar"}
            </p>
          </div>

          <div
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } p-3 rounded-lg flex justify-between items-center`}
          >
            <h1 className="">Bukti</h1>
            <p>
              {selectedBonus?.proof_transfer ? (
                <div
                  className="text-blue-500 underline cursor-pointer"
                  onClick={() => {
                    setSelectedImage(
                      `${import.meta.env.VITE_API_URL}/storage/${
                        selectedBonus?.proof_transfer
                      }`
                    );
                    setShowImageModal(true);
                  }}
                >
                  Lihat
                </div>
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">BV Dari downline</h3>
        </div>

        {downlineBvLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              Memuat data BV dari downline...
            </p>
          </div>
        ) : (
          downlineBvSummary && (
            <div
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#f0f0f0]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } p-4 rounded-lg flex flex-col gap-4 mb-4 mt-4`}
            >
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
                      {downlineBvSummary.downlines.map((downline, index) => (
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
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tidak ada data BV dari downline
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        )}

        {showImageModal && selectedImage && (
          <div
            className="fixed inset-0 backdrop-blur-xs bg-[#000000b5] flex items-center justify-center z-99 p-4 w-full"
            onClick={() => setShowImageModal(false)}
          >
            <div className="w-full max-w-md rounded-lg p-4 relative">
              <button
                className="absolute top-2 right-2 cursor-pointer text-white p-1 rounded-full"
                onClick={() => setShowImageModal(false)}
              >
                <i className="bx bxs-x-circle text-5xl"></i>
              </button>
              <img
                src={selectedImage}
                alt="Bukti Transfer"
                className="w-full max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()} // biar klik gambar tidak menutup
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusPage;
