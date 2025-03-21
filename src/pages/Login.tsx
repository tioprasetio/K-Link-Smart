import { useState } from "react";
import { loginUser } from "../api/authService";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { fetchCart } = useCart();
  const { setIsLoggedIn, setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });

      console.log("🟢 Login berhasil, token:", data.token); // Debugging

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);

      setUser(data.user); // 🔥 Update user di global state
      setIsLoggedIn(true); // 🔥 Update status login di AuthContext

      await fetchCart(); // Panggil fetchCart setelah login
      navigate("/"); // Redirect ke halaman dashboard
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("🔴 Error login:", err.message);
      setError(err.message);
    }
  };


  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
