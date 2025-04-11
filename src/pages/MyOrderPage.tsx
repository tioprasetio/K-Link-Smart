import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ambil data user
import axios from "axios";
import { formatRupiah } from "../utils/formatCurrency";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useNavigate } from "react-router";

const MyOrderPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<
    {
      order_id: string;
      gross_amount: number;
      status: string;
      shipment_status: string;
      created_at: string;
      products: {
        id: number;
        name: string;
        picture: string;
        harga: number;
        quantity: number;
      }[]; // Tambahkan products
    }[]
  >([]);

  useEffect(() => {
    if (user) {
      console.log("User Data:", user);
      axios
        .get(`http://localhost:5000/api/transactions/user/${user.id}`)
        .then((response) => {
          console.log("Orders Response:", response.data); // Cek data API di console
          setOrders(response.data.data);
        })
        .catch((error) => {
          console.error("❌ Fetch Orders Failed:", error);
        });
    }
  }, [user]);


  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140C00] text-[#FFFFFF]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
        </div>
        {orders.length === 0 ? (
          <p>Tidak ada pesanan.</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
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
                  <ul className="mt-2 space-y-2">
                    {order.products.map((item) => (
                      <li key={item.id} className="p-3 rounded-lg flex">
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
                              {/* Harga per item */}
                              <p className="text-sm">
                                {formatRupiah(item.harga)}
                              </p>
                            </div>
                            {/* Quantity dan Subtotal (sejajar ke kanan) */}
                            <div className="flex flex-col items-end">
                              <span className="text-sm">x{item.quantity}</span>
                              <span className="font-medium">
                                {formatRupiah(item.harga * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* Total pesanan */}
                  <hr className="mt-4 border-t border-gray-300" />
                  <div className="my-4 pt-3">
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
