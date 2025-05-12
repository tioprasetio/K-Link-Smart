// src/pages/DownlinePage.tsx
import { useEffect, useState } from "react";
import DownlineCard from "../components/DownlineCard";
import axios from "axios";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useNavigate } from "react-router";

type Downline = {
  id: number;
  uid: string;
  name: string;
  email: string;
  profile_picture?: string;
};

const DownlinePage: React.FC = () => {
  const [downlines, setDownlines] = useState<Downline[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDownlines = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/downlines`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDownlines(res.data.downlines);
      } catch (err) {
        console.error("Gagal fetch downlines", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDownlines();
  }, []);

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140C00] text-white" : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 sm:pt-28 w-full min-h-screen pb-10`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Info Jaringan</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : downlines.length === 0 ? (
          <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4">
            <p
              className={`${
                isDarkMode ? "text-[#353535]" : "text-[#353535]"
              } text-left`}
            >
              Belum ada downline.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downlines.map((downline) => (
              <DownlineCard key={downline.uid} downline={downline} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DownlinePage;
