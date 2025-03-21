import { Link, useParams } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState } from "react";
import useProducts from "../context/ProductContext";// Tambahkan ini
import CardProduct from "../components/CardProduct";
import { Product } from "../types/Product";
import useCategories from "../context/CategoriesContext";

const CategoryPage = () => {
  const { isDarkMode } = useDarkMode();
  const { category } = useParams(); // Ambil kategori dari URL
  const decodedCategory = decodeURIComponent(category || ""); // Dekode jika ada spasi
  const { products, loading, error } = useProducts();
  const { categories } = useCategories(); // Ambil daftar kategori
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (decodedCategory && categories.length > 0 && products.length > 0) {
      // Cari category_id berdasarkan nama kategori
      const matchedCategory = categories.find(
        (cat) => cat.name === decodedCategory
      );

      if (matchedCategory) {
        const categoryId = matchedCategory.id; // Ambil category_id
        console.log("Found category ID:", categoryId);

        // Filter produk berdasarkan category_id
        const filtered = products.filter(
          (product) => product.category_id === categoryId
        );
        console.log("Filtered Products:", filtered);
        setFilteredProducts(filtered);
      } else {
        console.log("Category not found!");
        setFilteredProducts([]);
      }
    }
  }, [decodedCategory, products, categories]); // Tambahkan categories sebagai dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
        } overflow-x-hidden w-full min-h-screen pt-16 sm:pt-24`}
      >
        <div className="text-[#353535] text-xl font-medium p-6">
          <span
            className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}
          >
            <Link className="text-[#28a154]" to="/">
              Home
            </Link>{" "}
            / {decodedCategory}
          </span>
        </div>

        <div className="p-6 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <CardProduct key={index} {...product} isDarkMode={isDarkMode} />
              ))
            ) : (
              <p
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-center`}
              >
                Maaf, tidak ada produk tersedia untuk kategori ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
