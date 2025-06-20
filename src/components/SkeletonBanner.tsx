import { useDarkMode } from "../context/DarkMode";

const SkeletonBanner = () => {
  const { isDarkMode } = useDarkMode();

  const bgPlaceholder = isDarkMode ? "bg-[#454545]" : "bg-gray-300";

  return (
    <div className="w-full mb-8 animate-pulse">
      <div
        className={`w-full rounded-lg ${bgPlaceholder}`}
        style={{ aspectRatio: "1560 / 531" }}
      />
    </div>
  );
};

export default SkeletonBanner;
