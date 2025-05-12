import { useCheckout } from "../context/CheckoutContext";
import { useDarkMode } from "../context/DarkMode";
import { formatRupiah } from "../utils/formatCurrency";

const ProductInformationCheckout = () => {
  const { selectedProducts } = useCheckout();
  const { isDarkMode } = useDarkMode();
  return (
    <>
      {selectedProducts.length === 0 ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <div className="space-y-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } p-4 rounded-lg flex items-center mt-4`}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/storage/${
                  product.picture
                }`}
                alt={product.name}
                className="h-16 w-16 mr-4 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="font-medium">Variant: {product.variant}</p>
                <p className="font-semibold">{formatRupiah(product.harga)}</p>
                <p>Jumlah: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductInformationCheckout;
