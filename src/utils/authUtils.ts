import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  id: number;
  // Tambahkan properti lain yang ada di payload token
}

export const getEmailFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.email;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token; // Mengembalikan `true` jika token ada, `false` jika tidak
};
