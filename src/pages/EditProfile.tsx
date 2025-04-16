import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    no_hp: "",
    alamat: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_SIZE_MB = 2;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    setError("");

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Hanya file gambar yang diperbolehkan (jpg, jpeg, png, webp)."
        );
        e.target.value = ""; // reset input file
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file maksimal ${MAX_SIZE_MB}MB!`);
        e.target.value = ""; // reset input file
        return;
      }

      setProfilePicture(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("no_hp", formData.no_hp);
      data.append("alamat", formData.alamat);
      data.append("jenis_kelamin", formData.jenis_kelamin);
      data.append("tanggal_lahir", formData.tanggal_lahir);
      if (profilePicture) {
        data.append("profile_picture", profilePicture);
      }

      await updateProfile(data); // Sesuaikan agar fungsi ini menerima FormData

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("🔥 Error updating profile:", error);
      setError("Gagal menyimpan perubahan.");
    }
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
        } flex flex-col h-full p-6 pt-28 sm:pt-32 items-center justify-center`}
      >
        <div className="flex items-center gap-2 mb-4 w-full justify-start">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)} // Tambahkan fungsi kembali
          ></i>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#303030]" : "bg-white"
          } w-full max-w-md p-8 shadow-md rounded-lg`}
        >
          <div className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
            <Link to="/">
              <img
                src="https://k-net.co.id/assets/images/logo.png"
                className="h-8 inline-block"
                alt="K-Link"
              />
              <span
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } inline-block`}
              >
                Edit Profile
              </span>
            </Link>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 space-y-4"
          >
            <div>
              <label
                className={`${
                  isDarkMode ? "text-white" : "text-gray-800"
                } block mb-1`}
              >
                Foto
              </label>

              <div className="flex gap-4 items-center justify-center">
                {user?.profile_picture && !profilePicture && (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}/uploads/profile/${
                      user.profile_picture
                    }`}
                    alt="Current Profile"
                    className="w-20 h-20 rounded-lg"
                  />
                )}
                {profilePicture && (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg"
                  />
                )}

                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className={`w-full border rounded ${
                    isDarkMode
                      ? "bg-[#252525] text-[#f0f0f0]"
                      : "bg-white text-[#353535]"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`${
                  isDarkMode ? "text-white" : "text-gray-800"
                } block mb-1`}
              >
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-4 border-none rounded-xl ${
                  isDarkMode
                    ? "bg-[#252525] text-[#f0f0f0]"
                    : "bg-[#f0f0f0] text-[#353535]"
                }`}
              />
            </div>

            <div>
              <label
                className={`${
                  isDarkMode ? "text-white" : "text-gray-800"
                } block mb-1`}
              >
                No Hp
              </label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                required
                className={`w-full p-4 border-none rounded-xl ${
                  isDarkMode
                    ? "bg-[#252525] text-[#f0f0f0]"
                    : "bg-[#f0f0f0] text-[#353535]"
                }`}
              />
            </div>

            <div>
              <label
                className={`${
                  isDarkMode ? "text-white" : "text-gray-800"
                } block mb-1`}
              >
                Alamat
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                className={`w-full p-4 border-none rounded-xl ${
                  isDarkMode
                    ? "bg-[#252525] text-[#f0f0f0]"
                    : "bg-[#f0f0f0] text-[#353535]"
                }`}
              />
            </div>

            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
              className={`w-full p-4 border-none rounded-xl ${
                isDarkMode
                  ? "bg-[#252525] text-[#f0f0f0]"
                  : "bg-[#f0f0f0] text-[#353535]"
              }`}
            >
              <option value="">Pilih</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>

            <div>
              <label
                className={`${
                  isDarkMode ? "text-white" : "text-gray-800"
                } block mb-1`}
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
                className={`w-full p-4 border-none rounded-xl ${
                  isDarkMode
                    ? "bg-[#252525] text-[#f0f0f0]"
                    : "bg-[#f0f0f0] text-[#353535]"
                }`}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 text-white rounded-xl bg-[#28a154] hover:bg-[#167e3c] cursor-pointer"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
