import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";

// Fungsi untuk mengambil semua produk
export const getProducts = async () => {
  try {
    const response = await axios.get(
      `tioyudhoprasetio33@student.esaunggul.ac.id/products`
    );
    return response.data; // Pastikan response.data berisi array produk
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
