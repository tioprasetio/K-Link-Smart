import axios from "axios";

export interface UserData {
  name: string;
  email: string;
  password: string;
  no_hp: string;
  alamat: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  leader_id?: string; // Bisa opsional
}

// Update fungsi registerUser agar mengirim semua data
export const registerUser = async (userData: UserData) => {
  try {
    console.log("📤 Data dikirim ke backend:", userData); // Debugging
    const response = await axios.post(
      `http://localhost:5000/api/register`,
      userData
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🔥 Error dari backend:", error.response?.data);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// **Login User**
export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (userData: LoginData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/login`,
      userData
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// **Cek apakah user sudah login**
export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token; // Jika token ada, berarti user login
};

// **Logout User**
export const logoutUser = () => {
  localStorage.removeItem("token");
};
