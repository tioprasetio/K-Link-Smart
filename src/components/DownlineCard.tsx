import React from "react";
import { useDarkMode } from "../context/DarkMode";

type Downline = {
  id: number;
  uid: string;
  name: string;
  email: string;
  profile_picture?: string;
  leader_id?: string | null;
};

type Props = {
  downline: Downline;
};

const DownlineCard: React.FC<Props> = ({ downline }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`${
        isDarkMode ? "bg-[#404040] text-[#f0f0f0]" : "bg-white text-[#353535]"
      } rounded-xl shadow-md p-4 flex items-center gap-4`}
    >
      <img
        src={
          downline.profile_picture
            ? `http://localhost:5000/uploads/profile/${downline.profile_picture}`
            : "/assets/images/health_accessories.png"
        }
        alt={downline.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{downline.name}</h3>
        <p className="text-sm text-gray-400">{downline.uid}</p>
        <p className="text-sm text-gray-400 mb-2">{downline.email}</p>
        {downline.leader_id && (
          <p className="text-sm italic">
            Recruiter: <span className="font-medium">{downline.leader_id}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DownlineCard;
