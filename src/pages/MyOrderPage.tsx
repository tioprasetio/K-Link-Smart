import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ambil data user
import axios from "axios";
import { formatRupiah } from "../utils/formatCurrency";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { Link, useNavigate, useSearchParams } from "react-router";
import Swal from "sweetalert2";
import { useCheckout } from "../context/CheckoutContext";
import { getPlanName } from "../utils/getPlanName";
import usePlans from "../context/PlanContext";

const MyOrderPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { setSelectedProducts } = useCheckout();
  const [comments, setComments] = useState<{ [productId: number]: string }>({});
  const [ratings, setRatings] = useState<{ [productId: number]: number }>({});
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(
    new Set()
  );
  const { plans } = usePlans();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStatus = searchParams.get("filter");
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  const [orders, setOrders] = useState<
    {
      order_id: string;
      gross_amount: number;
      id_plan: number;
      bv_period_id: number;
      bv_period_name: string;
      status: string;
      shipment_status: string;
      created_at: string;
      products: {
        id: number;
        name: string;
        bv: number;
        picture: string;
        harga: number;
        quantity: number;
        variant: string;
      }[]; // Tambahkan products
    }[]
  >([]);

  const dikemasCount = orders.filter(
    (order) => order.shipment_status === "dikemas"
  ).length;
  const dikirimCount = orders.filter(
    (order) => order.shipment_status === "dikirim"
  ).length;

  const filteredOrders = orders
    .filter((order) =>
      filterStatus ? order.shipment_status === filterStatus : true
    )
    .filter((order) =>
      inputValue
        ? order.order_id.toLowerCase().includes(inputValue.toLowerCase())
        : true
    );

  useEffect(() => {
    setInputValue(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      console.log("User Data:", user);
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/transactions/user/${user.id}`
        )
        .then((response) => {
          console.log("Orders Response:", response.data); // Cek data API di console
          setOrders(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ Fetch Orders Failed:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Bersihkan selectedProducts setelah user masuk ke halaman pesanan
    localStorage.removeItem("selectedProducts");
    setSelectedProducts([]);
  }, []);

  const handleOrderComplete = async (order_id: string) => {
    if (!user) return;

    const confirmResult = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Pastikan kamu sudah menerima barang karena pesanan akan dianggap selesai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, selesai",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/transactions/${order_id}/complete`
        );

        // Ambil ulang data pesanan
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/transactions/user/${user.id}`
        );
        setOrders(response.data.data);

        Swal.fire({
          title: "Berhasil!",
          text: "Pesanan telah diselesaikan.",
          icon: "success",
        });
      } catch (error) {
        console.error("❌ Gagal menyelesaikan pesanan:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menyelesaikan pesanan.",
          icon: "error",
        });
      }
    }
  };

  // Saat halaman dimuat, periksa produk mana yang sudah direview
  useEffect(() => {
    if (user) {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/reviews/user/${user.id}`)
        .then((response) => {
          const reviewed = new Set<string>(
            response.data.data.map(
              (review: { product_id: number; order_id: string }) =>
                `${review.product_id}-${review.order_id}`
            )
          );
          setReviewedProducts(reviewed);
        })
        .catch((error) => {
          console.error("Gagal mengambil data review user:", error);
        });
    }
  }, [user]);

  const handleCommentChange = (productId: number, value: string) => {
    setComments((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleRatingChange = (productId: number, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSubmitComment = async (productId: number, orderId: string) => {
    if (!user) return;

    // Cek apakah rating sudah diisi
    if (!ratings[productId]) {
      Swal.fire("Perhatian", "Mohon berikan rating terlebih dahulu", "warning");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/reviews`, {
        user_id: user.id,
        product_id: productId,
        order_id: orderId,
        rating: ratings[productId],
        comment: comments[productId] || "",
      });

      // Tambahkan produk ke daftar yang sudah direview
      setReviewedProducts(
        (prev) => new Set([...prev, `${productId}-${orderId}`])
      );

      Swal.fire("Berhasil!", "Komentar berhasil dikirim.", "success");
      setComments((prev) => ({
        ...prev,
        [productId]: "",
      }));
      setRatings((prev) => ({
        ...prev,
        [productId]: 0,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Gagal kirim komentar:", error);
      if (error.response) {
        console.error("Detail error:", error.response.data);
        Swal.fire(
          "Gagal",
          error.response.data.message ||
            "Terjadi kesalahan saat mengirim komentar.",
          "error"
        );
      } else {
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat mengirim komentar.",
          "error"
        );
      }
    }
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
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10 max-w-4xl mx-auto`} // Klo mau full hapus max-w-4xl mx-auto
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
        </div>
        <div className="flex flex-wrap text-sm md:text-lg gap-4 mb-4">
          {["dikemas", "dikirim", "selesai", null].map((status) => {
            const label = status ?? "semua";
            const badgeCount =
              status === "dikemas"
                ? dikemasCount
                : status === "dikirim"
                ? dikirimCount
                : 0;

            return (
              <div key={label} className="relative">
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (status) {
                      newParams.set("filter", status);
                    } else {
                      newParams.delete("filter");
                    }
                    setSearchParams(newParams);
                  }}
                  className={`hover:scale-105 transition-all px-3 py-1 rounded cursor-pointer ${
                    filterStatus === status || (!filterStatus && !status)
                      ? "bg-green-500 text-white"
                      : isDarkMode
                      ? "bg-[#404040] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </button>

                {/* Badge notif */}
                {badgeCount > 0 &&
                  (status === "dikemas" || status === "dikirim") && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {badgeCount}
                    </span>
                  )}
              </div>
            );
          })}
        </div>
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

            setSearchParams(newParams);
          }}
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0] border-[#282828] placeholder-gray-300"
              : "bg-[#F4F6F9] text-[#353535] border-gray-200 placeholder-gray-400 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
          } mb-4 px-4 py-2 border rounded-lg w-full focus:ring-[#28a154] focus:border-[#28a154]`}
        />

        {!loading && filteredOrders.length === 0 ? (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              <i className="bx bx-x-circle mr-1"></i>
              {filterStatus
                ? `Tidak ada pesanan dengan status "${filterStatus}".`
                : "Tidak ada pesanan."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <div key={order.order_id} className="space-y-4">
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#404040] text-[#f0f0f0]"
                      : "bg-[#FFFFFF] text-[#353535]"
                  } p-4 rounded-lg`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{order.order_id}</h3>
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-white ${
                        order.shipment_status === "dikirim"
                          ? "bg-blue-500"
                          : order.shipment_status === "dikemas"
                          ? "bg-orange-500"
                          : order.shipment_status === "selesai"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {order.shipment_status}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {order.products.map((item) => (
                      <li key={item.id} className="py-1">
                        <div
                          className={`${
                            isDarkMode
                              ? "bg-[#252525]"
                              : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                          } flex p-2 rounded-lg`}
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL}/storage/${
                              item.picture
                            }`}
                            alt={item.name}
                            className="h-16 w-16 rounded-md object-cover mr-3"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <p className="font-semibold truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                                  {item.name}
                                </p>
                                {item.variant && (
                                  <p className="font-semibold text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                                    Variant: {item.variant}
                                  </p>
                                )}
                                {/* Harga per item */}
                                <p className="text-sm">
                                  {formatRupiah(item.harga)}
                                </p>
                              </div>
                              {/* Quantity dan Subtotal (sejajar ke kanan) */}
                              <div className="flex flex-col items-end">
                                <span className="text-sm">
                                  x{item.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatRupiah(item.harga * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Bagian review produk */}
                        {order.shipment_status === "selesai" &&
                          (reviewedProducts.has(
                            `${item.id}-${order.order_id}`
                          ) ? (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-green-600 text-sm">
                                <i className="bx bx-check-circle mr-1"></i>
                                Anda sudah memberikan ulasan untuk produk ini
                              </p>
                            </div>
                          ) : (
                            <div className="mt-4">
                              <div className="flex items-center mb-2">
                                <span className="mr-2 text-sm">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className={`bx ${
                                      (ratings[item.id] || 0) >= star
                                        ? "bxs-star"
                                        : "bx-star"
                                    } text-yellow-500 cursor-pointer text-xl mr-1`}
                                    onClick={() =>
                                      handleRatingChange(item.id, star)
                                    }
                                  ></i>
                                ))}
                              </div>
                              <textarea
                                className={`${
                                  isDarkMode
                                    ? "bg-[#252525] text-[#F0F0F0] placeholder-gray-300 border-gray-700"
                                    : "bg-[#F4F6F9] text-[#353535] placeholder-gray-400 border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                                } w-full border rounded-md p-2 text-sm`}
                                rows={2}
                                placeholder="Tulis komentar untuk produk ini..."
                                value={comments[item.id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(item.id, e.target.value)
                                }
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() =>
                                    handleSubmitComment(item.id, order.order_id)
                                  }
                                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                                >
                                  Kirim Ulasan
                                </button>
                              </div>
                            </div>
                          ))}
                      </li>
                    ))}
                  </ul>
                  {/* Total pesanan */}
                  <hr className="mt-4 border-t border-gray-300" />
                  <div className="my-4 pt-3">
                    <div className="flex justify-between items-center font-normal">
                      <span>BV Plan</span>
                      <span>{getPlanName(order.id_plan, plans)}</span>
                    </div>
                    <div className="flex justify-between items-center font-normal">
                      <span>BV Period</span>
                      <span>{order.bv_period_name}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>BV Didapat:</span>
                      <span>
                        {order.products.reduce(
                          (total, product) =>
                            total + (product.bv ?? 0) * product.quantity,
                          0
                        )}{" "}
                        BV
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Pesanan:</span>
                      <span>{formatRupiah(order.gross_amount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-center font-semibold text-white w-full ${
                        order.status === "success"
                          ? "bg-green-500"
                          : order.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      Pembayaran {order.status}
                    </span>
                  </div>

                  <div className="flex flex-row mt-4 gap-4 text-sm">
                    {order.shipment_status === "dikirim" && (
                      <button
                        onClick={() => handleOrderComplete(order.order_id)}
                        className="p-2 rounded-lg text-center font-semibold w-full border border-green-500 text-green-600 hover:bg-green-50 transition cursor-pointer"
                      >
                        Pesanan Diterima
                      </button>
                    )}
                    <Link
                      to={`/my-order-detail/${order.order_id}`}
                      className="p-2 rounded-lg text-center font-semibold w-full border border-green-500 text-green-600 hover:bg-green-50 transition cursor-pointer"
                    >
                      Detail Pesanan
                    </Link>
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

export default MyOrderPage;
