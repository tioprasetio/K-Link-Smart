import { useDarkMode } from "../context/DarkMode";
import useProducts from "../context/ProductContext";
import CardProduct from "./CardProduct";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { isDarkMode } = useDarkMode();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={`${isDarkMode ? "text-white" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );

  if (error) return <p>{error}</p>;

  // Filter best sellers
  const bestSellers = products.filter((product) => product.terjual > 2);

  return (
    <div>
      {/* Best Sellers Section */}
      <h2 className="text-2xl font-bold mb-4">Best Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {bestSellers.map((product) => (
          <CardProduct key={product.id} {...product} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* All Products Section */}
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <CardProduct key={product.id} {...product} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
