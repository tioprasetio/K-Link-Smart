import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatRupiah } from "../utils/formatCurrency";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";
import { getPlanName } from "../utils/getPlanName";
import usePlans from "../context/PlanContext";
import { formatDate } from "../utils/formatDate";

// Interface yang disesuaikan dengan respons API
interface OrderProduct {
  id: number;
  name: string;
  price: number; // Sesuai dengan yang dikembalikan API
  bv: number;
  quantity: number;
  picture: string;
  variant: string;
}

type OrderDetail = {
  order_id: string;
  status: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  gross_amount: number;
  id_plan: number;
  bv_period_id: number;
  bv_period_name: string;
  shipping_cost: number;
  shipping_method: string;
  shipment_status: string;
  resi: string;
  created_at: string;
  payment_method: string;
  discount: number;
  products: OrderProduct[];
};

export default function MyOrderDetailPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { plans } = usePlans();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (order_id) {
      setLoading(true);
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/transactions/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal mengambil detail pesanan:", err);
          setError("Gagal mengambil detail pesanan. Silakan coba lagi nanti.");
          setLoading(false);
        });
    }
  }, [order_id, token]);

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
  if (error)
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#140C00] text-white" : "bg-[#f4f6f9] text-[#353535]"
        } p-6`}
      >
        <h2 className="text-2xl font-bold mb-2">Oops! Ada masalah</h2>
        <p className="mb-4 text-center max-w-sm">
          {error}
        </p>
        <button
          onClick={() => navigate("/my-order")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Coba Lagi
        </button>
      </div>
    );

  if (!data) return <p>Tidak ada data ditemukan</p>;

  const subtotalProduk = data.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const nominalDiskon = (subtotalProduk * data.discount) / 100;

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140C00] text-[#FFFFFF]"
            : "bg-[#f4f6f9] text-[#353535]"
        } pt-24 sm:pt-28 p-6 w-full min-h-screen pb-10 max-w-4xl mx-auto`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Detail Pesanan</h1>
        </div>
        <div
          className={`rounded-t-lg text-white px-4 py-2 ${
            data.shipment_status === "dikirim"
              ? "bg-blue-500"
              : data.shipment_status === "dikemas"
              ? "bg-orange-500"
              : data.shipment_status === "selesai"
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        >
          Pesanan {data.shipment_status}
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#404040]" : "bg-[#FFFFFF]"
          } rounded-b-lg shadow px-4 py-4 mb-4`}
        >
          <div
            className={`${
              isDarkMode
                ? "bg-[#252525]"
                : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } flex p-2 rounded-lg flex-col`}
          >
            <h3 className="font-bold text-base">
              <i className="bx bx-package"></i> Info Pengiriman
            </h3>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span>{data.shipping_method}</span>
                <span className="text-sm">{data.resi}</span>
              </div>
              <span>{formatRupiah(data.shipping_cost)}</span>
            </div>
          </div>

          <div
            className={`${
              isDarkMode
                ? "bg-[#252525]"
                : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } flex p-2 rounded-lg flex-col mt-4`}
          >
            <h3 className="font-bold text-base">
              <i className="bx bx-wallet"></i> Metode Pembayaran
            </h3>
            <div className="flex">
              <span>Pembayaran - {data.payment_method}</span>
            </div>
          </div>
        </div>

        <div
          className={`${
            isDarkMode ? "bg-[#404040]" : "bg-[#FFFFFF]"
          } rounded-lg shadow p-4 mb-4`}
        >
          <h3 className="font-bold">Order ID: {data.order_id}</h3>
          <p className="mb-2">
            Status Pembayaran:{" "}
            <span
              className={`font-medium ${
                data.status === "success"
                  ? "text-green-500"
                  : data.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {data.status}
            </span>
          </p>
          <p className="mb-2">{formatDate(data.created_at)}</p>
          <hr className="mt-4 border-t border-gray-300" />

          <div className="mt-4">
            <h4 className="font-semibold">Informasi Penerima:</h4>
            <p>Nama Penerima: {data.receiver_name}</p>
            <p>Telepon: {data.receiver_phone}</p>
            <p>Alamat: {data.receiver_address}</p>
          </div>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#FFFFFF]"
              : "bg-[#FFFFFF] text-[#353535]"
          } rounded-lg shadow p-4`}
        >
          <h3 className="font-semibold mb-2">Produk:</h3>
          <ul>
            {data.products.map((product) => (
              <li key={product.id} className="py-2">
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#252525]"
                      : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                  } flex p-2 rounded-lg`}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${
                      product.picture
                    }`}
                    alt={product.name}
                    className="h-16 w-16 rounded-md object-cover mr-3"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                          {product.name}
                        </p>
                        {product.variant && (
                          <p className="font-semibold text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                            Variant: {product.variant}
                          </p>
                        )}
                        <p className="text-sm">{formatRupiah(product.price)}</p>
                      </div>
                      {/* Quantity dan Subtotal (sejajar ke kanan) */}
                      <div className="flex flex-col items-end">
                        <span className="text-sm">x{product.quantity}</span>
                        <span className="font-medium">
                          {formatRupiah(product.price * product.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={`${
              isDarkMode
                ? "bg-[#252525]"
                : "bg-[#f4f6f9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } mt-2 p-3 rounded-lg`}
          >
            <div className="text-right text-sm">
              <div className="flex justify-between">
                <span>BV Plan:</span>
                <span className="font-medium">
                  {getPlanName(data.id_plan, plans)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>BV Period:</span>
                <span className="font-medium">{data.bv_period_name}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>BV Didapat:</span>
                <span className="font-medium">
                  {data.products.reduce(
                    (total, product) =>
                      total + (product.bv ?? 0) * product.quantity,
                    0
                  )}{" "}
                  BV
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Subtotal Produk:</span>
                <span className="font-medium">
                  {formatRupiah(subtotalProduk)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Subtotal Pengiriman:</span>
                <span className="font-medium">
                  {formatRupiah(data.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 mt-1">
                <span>Voucher produk:</span>
                <span>
                  -{formatRupiah(nominalDiskon)} ({data.discount}%)
                </span>
              </div>
            </div>
          </div>
          <hr className="mt-4 border-t border-gray-300" />
          <div className="mt-4 pt-2 font-bold text-right">
            Total Pesanan: {formatRupiah(data.gross_amount)}
          </div>
        </div>
      </div>
    </>
  );
}
