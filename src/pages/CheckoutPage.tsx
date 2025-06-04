import Swal from "sweetalert2";
import { useCheckout } from "../context/CheckoutContext";
import { formatRupiah } from "../utils/formatCurrency";
import Btn from "../components/Btn";
import { useNavigate } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DestinationResult } from "../types/Destination";
import { ShippingMethod } from "../types/ShippingMethod";
import { ShippingOption } from "../types/ShippingOption";
import PromoProduct from "../components/PromoProduct";
import { Period } from "../types/BvPeriod";
import { useCart } from "../context/CartContext";
import ProductInformationCheckout from "../components/ProductInformationCheckout";
import usePlans from "../context/PlanContext";

const CheckoutPage = () => {
  // Context hooks
  const {
    selectedProducts,
    setSelectedProducts,
    isLoading,
    cancelCheckout,
    checkoutToken,
  } = useCheckout();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, loading } = useAuth();

  const { plans, error } = usePlans();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Tambahkan state baru di bagian atas
  const [periods, setPeriods] = useState<Period[]>([]);
  // Ubah deklarasi state menjadi:
  const [selectedBvPeriod, setSelectedBvPeriod] = useState<string>("");
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

  // Receiver information
  const [receiverName, setReceiverName] = useState(user?.name || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.no_hp || "");
  const [receiverEmail, setReceiverEmail] = useState(user?.email || "");
  const [receiverAddress, setReceiverAddress] = useState(user?.alamat || "");
  const [useDifferentReceiver, setUseDifferentReceiver] = useState(false);

  // Shipping information
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [destinationResults, setDestinationResults] = useState<
    DestinationResult[]
  >([]);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationResult | null>(null);

  // Shipping methods
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(
    null
  );
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [methodsError, setMethodsError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' atau 'cod'

  // Shipping options
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(
    null
  );
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const { clearCheckedOutItems } = useCart();

  // Calculate values
  const totalWeight = useMemo(() => {
    return selectedProducts.reduce(
      (total, item) => total + (item.beratPengiriman / 1000) * item.quantity,
      0
    );
  }, [selectedProducts]);

  const hargaProduct = useMemo(() => {
    return selectedProducts.reduce(
      (total, item) => total + item.harga * item.quantity,
      0
    );
  }, [selectedProducts]);

  const totalHarga = useMemo(() => {
    return (
      hargaProduct * (1 - discount / 100) + (selectedOption?.shipping_cost || 0)
    );
  }, [hargaProduct, discount, selectedOption]);

  const totalBV = useMemo(() => {
    return selectedProducts.reduce(
      (total, item) => total + item.bv * item.quantity,
      0
    );
  }, [selectedProducts]);

  // Initial checks
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!isLoading && selectedProducts.length === 0) {
      navigate("/cart");
    }
  }, [user, loading, navigate, selectedProducts]);

  // Set user data on load
  useEffect(() => {
    if (user) {
      setReceiverName(user.name || "");
      setReceiverPhone(user.no_hp || "");
      setReceiverEmail(user.email || "");
      setReceiverAddress(user.alamat || "");
    }
  }, [user]);

  // Search destination function
  const searchDestination = async () => {
    if (!searchQuery.trim()) {
      Swal.fire("Info", "Please enter destination keyword", "info");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/search-destination`,
        {
          params: { keyword: searchQuery },
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        setDestinationResults(response.data.data);
      } else {
        Swal.fire("Info", "No destinations found", "info");
        setDestinationResults([]);
      }
    } catch {
      Swal.fire("Error", "Failed to search destination", "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch shipping methods when destination changes
  useEffect(() => {
    let isMounted = true;

    const fetchShippingMethods = async () => {
      if (!selectedDestination || totalWeight <= 0 || hargaProduct <= 0) {
        if (isMounted) {
          setShippingMethods([]);
          setSelectedMethod(null);
        }
        return;
      }

      const weight = totalWeight > 0 ? totalWeight : 0.1; // minimum weight
      const value = hargaProduct > 0 ? hargaProduct : 1000; // minimum value

      setIsLoadingMethods(true);
      setMethodsError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/shipping-methods`,
          {
            params: {
              receiver_destination_id: selectedDestination.id,
              weight: weight,
              item_value: value,
            },
          }
        );

        if (isMounted) {
          if (response.data?.success && Array.isArray(response.data.data)) {
            setShippingMethods(response.data.data);
            setSelectedMethod(null);

            // Auto-select if only one method available
            if (response.data.data.length === 1) {
              setSelectedMethod(response.data.data[0]);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading shipping methods:", error);
          setMethodsError("Failed to load shipping methods");
          Swal.fire("Error", "Failed to load shipping methods", "error");
        }
      } finally {
        if (isMounted) {
          setIsLoadingMethods(false);
        }
      }
    };

    fetchShippingMethods();

    return () => {
      isMounted = false;
    };
  }, [selectedDestination, totalWeight, hargaProduct]);

  // Fetch shipping options when method or destination changes
  useEffect(() => {
    let isMounted = true;

    const fetchShippingOptions = async () => {
      if (
        !selectedMethod ||
        !selectedDestination ||
        totalWeight <= 0 ||
        hargaProduct <= 0
      ) {
        if (isMounted) {
          setShippingOptions([]);
          setSelectedOption(null);
        }
        return;
      }

      const weight = totalWeight > 0 ? totalWeight : 0.1; // minimum weight
      const value = hargaProduct > 0 ? hargaProduct : 1000; // minimum value

      setIsLoadingShipping(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/calculate-shipping`,
          {
            params: {
              shipper_destination_id: "17579",
              receiver_destination_id: selectedDestination.id,
              weight: weight,
              item_value: value,
              cod: "no",
            },
          }
        );

        if (isMounted) {
          const filteredOptions = response.data.shipping_options.filter(
            (option: ShippingOption) =>
              option.shipping_name.toLowerCase() ===
              selectedMethod.id.toLowerCase()
          );

          setShippingOptions(filteredOptions);
          setSelectedOption(filteredOptions[0] || null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error:", error);
          Swal.fire("Error", "Failed to calculate shipping cost", "error");
        }
      } finally {
        if (isMounted) {
          setIsLoadingShipping(false);
        }
      }
    };

    fetchShippingOptions();

    return () => {
      isMounted = false;
    };
  }, [selectedMethod, selectedDestination, totalWeight, hargaProduct]);

  useEffect(() => {
    const fetchBvPeriods = async () => {
      setIsLoadingPeriods(true);
      try {
        console.log("Fetching BV periods..."); // <-- Tambahkan ini
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/active-bv-periods`
        );

        console.log("BV periods response:", response.data); // <-- Tambahkan ini

        // Perbaikan disini:
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          setPeriods(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedBvPeriod(response.data.data[0].id.toString()); // Convert ke string
          }
        }
      } catch (error) {
        console.error("Error loading BV periods:", error); // <-- Pastikan ini tercetak jika ada error
      } finally {
        setIsLoadingPeriods(false);
      }
    };

    fetchBvPeriods();
  }, []);

  // Voucher application
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      Swal.fire("Error", "Masukkan kode voucher!", "error");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/vouchers/${voucherCode}`
      );

      if (response.data.valid) {
        setDiscount(response.data.discount);
        Swal.fire(
          "Success",
          `Voucher berhasil digunakan! Diskon ${response.data.discount}%`,
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Voucher tidak valid!",
          "error"
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Terjadi kesalahan saat memeriksa voucher!";
      Swal.fire("Error", message, "error");
    }
  };

  // Cancel checkout
  const handleCancelCheckout = async () => {
    const result = await Swal.fire({
      title: "Batalkan Checkout?",
      text: "Apakah Anda yakin ingin membatalkan checkout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      try {
        await cancelCheckout();
        Swal.fire("Dibatalkan!", "Checkout telah dibatalkan.", "success");
        navigate("/cart");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        Swal.fire("Error", "Gagal membatalkan checkout.", err);
      }
    }
  };

  // Payment processing
  const handlePayment = async () => {
    if (!selectedOption) {
      Swal.fire("Error", "Pilih metode pengiriman terlebih dahulu", "error");
      return;
    }

    if (!selectedPlanId) {
      Swal.fire("Error", "Pilih Plan untuk BV terlebih dahulu", "error");
      return;
    }

    const overStockProducts = selectedProducts.filter(
      (product) => product.quantity > product.stock
    );

    if (overStockProducts.length > 0) {
      const overList = overStockProducts
        .map(
          (p) => `${p.name} (Beli: ${p.quantity}, Stok tersedia: ${p.stock})`
        )
        .join("<br>");

      Swal.fire({
        icon: "error",
        title: "Stok tidak mencukupi!",
        html: `Beberapa produk melebihi stok:<br><br>${overList}`,
      });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setIsProcessing(true);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/create-transaction`,
        {
          userId: user?.id,
          id_plan: selectedPlanId,
          receiver_name: receiverName,
          receiver_phone: receiverPhone,
          receiver_email: receiverEmail,
          receiver_address: `${receiverAddress} (${selectedDestination?.label})`,
          gross_amount: totalHarga,
          voucher_code: voucherCode,
          shipping_cost: selectedOption.shipping_cost,
          shipping_method: `${selectedMethod?.name} - ${selectedOption.service_name}`,
          payment_method: paymentMethod,
          products: selectedProducts,
          bv_period_id: parseInt(selectedBvPeriod, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (paymentMethod === "cod") {
        Swal.fire({
          title: "Pesanan COD Berhasil!",
          text: "Pesanan Anda telah tercatat. Silahkan tunggu barang dikirim.",
          icon: "success",
        }).then(async () => {
          try {
            // Hapus data temporary checkout dari backend
            if (checkoutToken) {
              await axios.delete(
                `${
                  import.meta.env.VITE_APP_API_URL
                }/api/checkout-temp/${checkoutToken}`
              );
            }
            clearCheckedOutItems(selectedProducts);

            // Hapus checkout dari local storage dan state
            localStorage.removeItem("selectedProducts");
            setSelectedProducts([]);
            navigate("/my-order"); // Redirect ke halaman pesanan
          } catch (error) {
            console.error("Gagal hapus data checkout COD:", error);
            Swal.fire("Error", "Gagal memproses pesanan COD.", "error");
          }
        });
      } else {
        // Redirect ke Midtrans untuk pembayaran online
        window.location.href = response.data.transaction.redirect_url;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      const message =
        error.response?.data?.message || "Failed to create transaction";
      Swal.fire("Error", message, "error");
    } finally {
      setIsProcessing(false);
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

  const exampleCode = "DISC10";

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-[#140C00] text-[#FFFFFF]"
          : "bg-[#f4f6f9] text-[#353535]"
      } p-6 mb-16 w-full min-h-screen pb-20`}
    >
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Informasi Pengguna */}
      <div
        className={`${
          isDarkMode ? "bg-[#404040]" : "bg-[#FFFFFF]"
        } p-4 rounded-lg mt-4`}
      >
        <h2 className="text-lg font-bold mb-2">Informasi Penerima</h2>

        {/* Tampilkan data user sebagai default */}
        <div
          className={`${
            isDarkMode
              ? "bg-[#252525]"
              : "bg-[#F4F6F9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
          } mb-4 p-3  rounded-lg`}
        >
          <p className="text-lg font-bold">{user?.name}</p>
          <p className="text-sm mb-4">{user?.no_hp}</p>
          <p className="text-sm">{user?.alamat}</p>
        </div>

        {/* Checkbox untuk toggle form */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="differentReceiver"
            checked={useDifferentReceiver}
            onChange={(e) => {
              setUseDifferentReceiver(e.target.checked);
              // Reset ke data user jika unchecked
              if (!e.target.checked) {
                setReceiverName(user?.name || "");
                setReceiverPhone(user?.no_hp || "");
                setReceiverEmail(user?.email || "");
                setReceiverAddress(user?.alamat || "");
              }
            }}
            className="mr-2 text-green-600 accent-green-600 rounded cursor-pointer"
          />
          <label htmlFor="differentReceiver">
            *Gunakan data penerima berbeda
          </label>
        </div>

        {/* Form muncul ketika checkbox dicentang */}
        {useDifferentReceiver && (
          <div className="space-y-2 animate-fadeIn">
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Nama Penerima"
              required
            />
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Nomor HP"
              required
            />
            <textarea
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Alamat Lengkap"
              required
            ></textarea>

            {/* Tombol reset */}
            <button
              type="button"
              onClick={() => {
                setReceiverName(user?.name || "");
                setReceiverPhone(user?.no_hp || "");
                setReceiverAddress(user?.alamat || "");
              }}
              className={`${
                isDarkMode ? "text-white" : "text-white"
              } bg-[#28a154] p-2 rounded-sm text-sm mt-1 text-left cursor-pointer`}
            >
              Kembalikan ke data profile
            </button>
          </div>
        )}
      </div>

      {/* Metode Pengiriman */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg shadow mb-6 mt-4`}
      >
        <h2 className="text-lg font-bold mb-4">Destinasi Pengiriman</h2>

        <div className="mb-4">
          <label className="block mb-2">Cari alamat</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'Bekasi, Jawa Barat'"
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] placeholder-gray-300 border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] placeholder-gray-400 border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } flex-1 p-2 border rounded-lg`}
            />
            <button
              onClick={searchDestination}
              className="bg-[#28A154] text-white px-4 py-2 rounded cursor-pointer"
              disabled={isSearching}
            >
              {isSearching ? "Loading..." : "Cari"}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {destinationResults.length > 0 && (
          <div className="max-h-40 overflow-y-auto mb-4">
            {destinationResults.map((destination) => (
              <div
                key={destination.id}
                className={`${
                  isDarkMode
                    ? "bg-[#353535] hover:bg-[#252525] text-[#FFFFFF]"
                    : "bg-[#F4F6F9] hover:bg-[#e9eaec] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                } p-3 mb-2 rounded cursor-pointer`}
                onClick={() => {
                  setSelectedDestination(destination);
                  setSearchQuery(destination.label);
                  setDestinationResults([]);
                }}
              >
                <p className="font-medium">{destination.label}</p>
                <p className="text-sm text-gray-400">
                  {destination.subdistrict_name}, {destination.city_name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Selected Destination */}
        {selectedDestination && (
          <div
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#FFFFFF]"
                : "bg-[#FFFFFF] text-[#353535]"
            } p-3 rounded`}
          >
            <p className="font-medium">Dipilih:</p>
            <p>{selectedDestination.label}</p>
          </div>
        )}
      </div>

      {/* Informasi Produk */}
      <ProductInformationCheckout />

      {/* Voucher */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
      >
        <h3 className="font-bold mb-2">Gunakan Voucher</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`(contoh: ${exampleCode})`}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#FFFFFF] placeholder-gray-300 border-gray-700"
                : "bg-[#F4F6F9] text-[#353535] placeholder-gray-400 border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } border p-2 rounded w-full`}
          />
          <button
            onClick={handleApplyVoucher}
            className="bg-[#28A154] text-white p-2 rounded cursor-pointer"
          >
            Gunakan
          </button>
        </div>
      </div>
      <PromoProduct />

      {/* Letakkan setelah bagian Voucher */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg shadow mb-6 mt-4 left-0 flex-col md:flex-row md:justify-between`}
      >
        <h3 className="font-bold mb-4">Periode BV</h3>
        <div className="w-full md:w-auto">
          {isLoadingPeriods ? (
            <p>Memuat periode BV...</p>
          ) : (
            <select
              value={selectedBvPeriod || ""}
              onChange={(e) => setSelectedBvPeriod(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full cursor-pointer`}
            >
              <option value="">Pilih Periode BV</option>
              {periods.map((period: Period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          )}
          <p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            } text-sm mt-2`}
          >
            *Pilih periode untuk memasukkan BV dari pembelian ini
          </p>
        </div>
      </div>

      {/* Plan BV */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg shadow mb-6 mt-4 left-0`}
      >
        <h2 className="text-lg font-bold mb-3">BV Plan</h2>

        {loading ? (
          <p>Memuat Plan...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex-1 p-4 hover:scale-101 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPlanId === plan.id
                    ? isDarkMode
                      ? "border-2 border-green-500 bg-[#1e3a26]"
                      : "border-2 border-green-500 bg-green-50"
                    : isDarkMode
                    ? "border border-gray-600 bg-[#353535]"
                    : "border border-gray-300"
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlanId === plan.id
                        ? "border-green-500"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedPlanId === plan.id && (
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <p className="font-semibold">{plan.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p
          className={`${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          } text-sm mt-2`}
        >
          *Pilih Plan untuk memasukkan BV dari pembelian ini
        </p>
      </div>

      {/* Shipping Method */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg shadow mb-6`}
      >
        <h2 className="text-lg font-bold mb-4">Metode Pengiriman</h2>

        <div className="mb-4">
          <label className="block mb-2">Ekspedisi</label>
          {isLoadingMethods ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
              <span className="ml-2">Loading ekspedisi...</span>
            </div>
          ) : methodsError ? (
            <div className="p-4 bg-red-50 rounded-lg flex flex-col items-center">
              <p className="text-red-500">{methodsError}</p>
              <button
                onClick={() => setMethodsError(null)}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <select
              value={selectedMethod?.id || ""}
              onChange={(e) => {
                const method = shippingMethods.find(
                  (m) => m.id === e.target.value
                );
                setSelectedMethod(method || null);
              }}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } w-full p-2 border rounded-lg cursor-pointer`}
              disabled={!selectedDestination}
            >
              <option value="">Pilih Ekspedisi</option>
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} - {method.description}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Shipping Options */}
        {isLoadingShipping && (
          <div className="flex items-center justify-center p-4">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
            <span className="ml-2">Loading ekspedisi...</span>
          </div>
        )}
        {!isLoadingShipping && selectedMethod && shippingOptions.length > 0 && (
          <div>
            <label className="block mb-2">Kategori</label>
            <select
              value={selectedOption?.service_name || ""}
              onChange={(e) => {
                const option = shippingOptions.find(
                  (o) => o.service_name === e.target.value
                );
                setSelectedOption(option || null);
              }}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } w-full p-2 border rounded`}
            >
              {shippingOptions.map((option, index) => (
                <option key={index} value={option.service_name}>
                  {option.service_name} - {formatRupiah(option.shipping_cost)}{" "}
                  (ETA: {option.etd})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex mt-4 flex-col gap-2`}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">Metode Pembayaran</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className={`flex-1 p-4 hover:scale-101 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                paymentMethod === "online"
                  ? isDarkMode
                    ? "border-2 border-green-500 bg-[#1e3a26]"
                    : "border-2 border-green-500 bg-green-50"
                  : isDarkMode
                  ? "border border-gray-600 bg-[#353535]"
                  : "border border-gray-300"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "online"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {paymentMethod === "online" && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
                <p className="font-semibold">Pembayaran Online</p>
              </div>
              <p className="text-sm ml-7">Transfer Bank, E-Wallet, QRIS, dll</p>
            </div>

            <div
              className={`flex-1 p-4 hover:scale-101 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                paymentMethod === "cod"
                  ? isDarkMode
                    ? "border-2 border-green-500 bg-[#1e3a26]"
                    : "border-2 border-green-500 bg-green-50"
                  : isDarkMode
                  ? "border border-gray-600 bg-[#353535]"
                  : "border border-gray-300"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cod"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {paymentMethod === "cod" && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
                <p className="font-semibold">COD (Bayar di Tempat)</p>
              </div>
              <p className="text-sm ml-7">Bayar saat barang diterima</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Pembayaran */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex mt-4 flex-col gap-2`}
      >
        <div className="flex justify-between">
          <p className="font-medium">Total BV didapat</p>
          <p className="font-medium">{totalBV}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Total Berat</p>
          <p className="font-medium">{totalWeight} Kg</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Subtotal untuk produk</p>
          <p className="font-medium">{formatRupiah(hargaProduct)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Subtotal pengiriman</p>
          <p className="font-medium">
            {selectedOption ? formatRupiah(selectedOption.shipping_cost) : "-"}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Voucher Diskon</p>
          <p className="font-medium">{discount}%</p>
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex justify-between">
          <p className="font-semibold">Total Pembayaran</p>
          <p className="font-semibold">{formatRupiah(totalHarga)}</p>
        </div>
      </div>

      {/* Tombol Bayar & Batal */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } fixed bottom-0 left-0 w-full p-4 shadow-xl flex flex-col gap-2 z-999`}
      >
        <h2 className="text-lg font-semibold">
          Total: {formatRupiah(totalHarga)}
        </h2>
        <div className="flex gap-2">
          <Btn
            onClick={handleCancelCheckout}
            className={`${
              isDarkMode
                ? "bg-[#cb2525] text-[#f0f0f0]"
                : "bg-[#cb2525] text-[#f0f0f0]"
            } px-4 py-2 hover:bg-[#a12828] font-semibold rounded w-1/2`}
          >
            Batal
          </Btn>
          <Btn
            onClick={handlePayment}
            disabled={isProcessing}
            className={`${
              isDarkMode
                ? "bg-[#28a154] text-[#f0f0f0]"
                : "bg-[#28a154] text-[#f0f0f0]"
            } px-4 py-2 font-semibold rounded w-1/2 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
