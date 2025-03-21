import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    jenis_kelamin: "L", // Default "L" (Laki-laki)
    tanggal_lahir: "",
    leader_id: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { register } = useAuth(); // Gunakan useAuth hook

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login"); // Redirect ke login setelah sukses register
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="no_hp"
          placeholder="Nomor HP"
          value={formData.no_hp}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="alamat"
          placeholder="Alamat"
          value={formData.alamat}
          onChange={handleChange}
          required
        />
        <select
          name="jenis_kelamin"
          value={formData.jenis_kelamin}
          onChange={handleChange}
          required
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <input
          type="date"
          name="tanggal_lahir"
          value={formData.tanggal_lahir}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="leader_id"
          placeholder="Leader ID"
          value={formData.leader_id}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
