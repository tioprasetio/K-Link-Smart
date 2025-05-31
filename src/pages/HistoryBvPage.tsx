/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useAuth } from "../context/AuthContext";
import { getPlanName } from "../utils/getPlanName";
import usePlans from "../context/PlanContext";

interface BVItem {
  transaction_product_id: number;
  transaction_id: number;
  created_at: string;
  product_name: string;
  checkout_plan: number;
  quantity: number;
  product_bv: number;
  total_bv: number;
  member_name: string;
  member_email: string;
}

const HistoryBvPage = () => {
  const [bvItems, setBvItems] = useState<BVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBV, setTotalBV] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, isLoggedIn } = useAuth();
  const { plans } = usePlans();

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      Swal.fire(
        "Akses Ditolak",
        "Anda harus login untuk mengakses halaman ini.",
        "error"
      ).then(() => {
        navigate("/login");
      });
      return;
    }

    const fetchBVHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/history-bv`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setBvItems(data.history);
          setTotalBV(data.total_bv);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Gagal memuat data BV:", error);
        Swal.fire("Gagal", "Tidak dapat memuat data BV.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBVHistory();
  }, [user, isLoggedIn, navigate]);

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
          isDarkMode ? "bg-[#140C00] text-white" : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10 max-w-4xl mx-auto`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate("/profile")}
          ></i>
          <h1 className="text-2xl font-bold">History BV</h1>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-white text-[#353535]"
          } p-6 rounded-lg mb-6 text-left shadow-sm`}
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <i className="bx bx-wallet text-6xl"></i>
            <div className="flex flex-col">
              <p className="text-sm font-normal">Total BV Kamu</p>
              <p className="text-2xl font-bold">{totalBV}</p>
            </div>
          </div>
        </div>

        {bvItems.length === 0 ? (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600 text-sm">
              <i className="bx bx-x-circle mr-1"></i>
              Tidak ada riwayat BV dari downline.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bvItems.map((item) => (
              <div
                key={item.transaction_product_id}
                className={`${
                  isDarkMode
                    ? "bg-[#404040] text-[#f0f0f0]"
                    : "bg-white text-[#353535]"
                } p-4 rounded-lg shadow-sm`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {getPlanName(item.checkout_plan, plans)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity} | BV/item: {item.product_bv}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#28a154]">
                      <i className="bx bxs-chevrons-up"></i>
                      {item.total_bv} BV
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mt-4 border-t pt-3 text-sm text-gray-400">
                  <div className="flex flex-row gap-2">
                    <i
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      } bx bxs-user text-base`}
                    ></i>{" "}
                    <span className="font-medium">{item.member_name}</span>
                  </div>

                  <div className="flex flex-row gap-2 mt-2 items-center">
                    <i
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      } bx bx-envelope text-base`}
                    ></i>{" "}
                    <p>{item.member_email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryBvPage;
