import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

interface User {
  id?: number;
  uid?: string;
  id_plan?: number;
  name?: string;
  email: string;
  no_hp?: string;
  BV?: number;
  alamat?: string;
  bank?: string;
  rekening_bank?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  leader_id?: string;
  profile_picture?: File | string | null;
}

interface AuthContextType {
  user: User | null;
  register: (userData: User) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ token: string; user: User }>;
  updateProfile: (userData: FormData) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Helper function untuk membuat FormData
  const createFormData = (userData: Partial<User>): FormData => {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    return formData;
  };

  const checkTokenExpiration = (token: string): boolean => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Waktu sekarang dalam detik

      return decodedToken.exp >= currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Token tidak valid
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token || !checkTokenExpiration(token)) {
        logout();
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.user);
        setIsLoggedIn(true);
      } catch {
        logout();
      }
      setLoading(false);
    };

    checkUser();
  }, [isLoggedIn]); // Tambahkan dependensi isLoggedIn agar data user diperbarui otomatis

  // Cek token setiap 60 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");

      if (token && !checkTokenExpiration(token)) {
        const result = await Swal.fire({
          title: "Sesi berakhir",
          text: "Sesi Anda telah berakhir. Silakan login kembali.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Oke!",
          allowOutsideClick: false, // Prevent clicking outside to close
          allowEscapeKey: false, // Prevent ESC key to close
        });

        if (result.isConfirmed) {
          logout();
        } else {
          logout(); // Logout anyway if somehow dismissal happens differently
        }
      }
    }, 1860000); // Cek setiap 30 detik

    return () => clearInterval(interval);
  }, []);

  // Interceptor Axios untuk mengecek token sebelum request API
  axios.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token");

    if (token && !checkTokenExpiration(token)) {
      const result = await Swal.fire({
        title: "Sesi berakhir",
        text: "Sesi Anda telah berakhir. Silakan login kembali.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Oke!",
        allowOutsideClick: false, // Prevent clicking outside to close
        allowEscapeKey: false, // Prevent ESC key to close
      });
      if (result.isConfirmed) {
        logout();
      } else {
        logout(); // Logout anyway if somehow dismissal happens differently
      }
    }

    return config;
  });

  const register = async (userData: User) => {
    try {
      const formData = createFormData(userData);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const updateProfile = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `${import.meta.env.VITE_APP_API_URL}/api/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Refresh user data setelah update
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUser(response.data.user);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      setUser(user);
      setIsLoggedIn(true);
      setLoading(false);

      return { token, user };
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat login";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          (error.response?.status === 401
            ? "Email atau password salah"
            : error.response?.status === 429
            ? "Terlalu banyak percobaan login. Coba lagi nanti."
            : errorMessage);
      }

      // Lempar object error lengkap untuk komponen
      throw {
        message: errorMessage,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        original: error,
      };
    }
  };

  const logout = () => {
    // window.dispatchEvent(new Event("userLoggedOut"));
    localStorage.removeItem("token"); // Hapus token yang sudah expired
    setIsLoggedIn(false);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isLoggedIn,
        setIsLoggedIn,
        updateProfile,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
