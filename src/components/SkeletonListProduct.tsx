import { useDarkMode } from "../context/DarkMode";

const SkeletonListProduct = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`${
        isDarkMode ? "bg-[#303030]" : "bg-white"
      } rounded-lg shadow-lg animate-pulse p-4`}
    >
      {/* Gambar produk skeleton */}
      <div
        className={`${
          isDarkMode ? "bg-[#454545]" : "bg-gray-300"
        } w-full h-40 rounded-md`}
      ></div>

      <div className="mt-4 space-y-2">
        {/* Nama produk */}
        <div
          className={`${
            isDarkMode ? "bg-[#454545]" : "bg-gray-300"
          } h-4 rounded-md w-3/4`}
        ></div>

        {/* Harga */}
        <div
          className={`${
            isDarkMode ? "bg-[#454545]" : "bg-gray-300"
          } h-4 rounded-md w-1/2`}
        ></div>

        {/* Rating dan terjual */}
        <div
          className={`${
            isDarkMode ? "bg-[#454545]" : "bg-gray-300"
          } h-4 rounded-md w-2/3`}
        ></div>

        {/* Tombol */}
        <div
          className={`${
            isDarkMode ? "bg-[#454545]" : "bg-gray-300"
          } h-10 rounded-md mt-4`}
        ></div>
      </div>
    </div>
  );
};

export default SkeletonListProduct;
