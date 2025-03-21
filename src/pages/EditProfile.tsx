import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    no_hp: "",
    alamat: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
  });

  // Perbarui formData setelah user tersedia
  useEffect(() => {
    console.log("Tanggal lahir sebelum masuk ke state:", user?.tanggal_lahir);
    if (user) {
      setFormData({
        name: user.name || "",
        no_hp: user.no_hp || "",
        alamat: user.alamat || "",
        jenis_kelamin: user.jenis_kelamin || "",
        tanggal_lahir: user.tanggal_lahir
          ? user.tanggal_lahir.split("T")[0] // Ambil hanya bagian "YYYY-MM-DD"
          : "",
      });
    }
  }, [user]); // Hanya dijalankan ketika `user` berubah

  useEffect(() => {
    console.log("Tanggal lahir di formData:", formData.tanggal_lahir);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put("http://localhost:5000/api/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setUser((prevUser) => ({
        ...prevUser!,
        ...formData,
      }));
    } catch (error) {
      console.error("🔥 Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          No HP:
          <input
            type="text"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
          />
        </label>
        <label>
          Alamat:
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
          />
        </label>
        <label>
          Jenis Kelamin:
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </label>
        <label>
          Tanggal Lahir:
          <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
