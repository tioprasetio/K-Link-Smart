import { useDarkMode } from "../context/DarkMode";

const SkeletonReviewCard = () => {
  const { isDarkMode } = useDarkMode();

  const bgCard = isDarkMode ? "bg-[#303030]" : "bg-white";
  const bgPlaceholder = isDarkMode ? "bg-[#454545]" : "bg-gray-300";

  return (
    <div
      className={`p-4 rounded-xl shadow-md animate-pulse flex flex-col items-start gap-2 ${bgCard}`}
    >
      {/* Profile + Name */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${bgPlaceholder}`}></div>
        <div className={`h-4 w-24 rounded ${bgPlaceholder}`}></div>
      </div>

      {/* Star rating */}
      <div className={`h-4 w-28 rounded ${bgPlaceholder}`}></div>

      {/* Comment */}
      <div className={`h-4 w-full rounded ${bgPlaceholder}`}></div>
      <div className={`h-4 w-3/4 rounded ${bgPlaceholder}`}></div>
    </div>
  );
};

export default SkeletonReviewCard;
