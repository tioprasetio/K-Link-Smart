import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkMode";

type BVRuleModalProps = {
  show: boolean;
  onClose: () => void;
};

const BVRuleModal: React.FC<BVRuleModalProps> = ({ show, onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      // Delay unmounting for smooth close
      setTimeout(() => setVisible(false), 200);
    }
  }, [show]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000b5] backdrop-blur-sm p-4 w-full transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg max-w-3xl w-full overflow-y-auto max-h-[90vh] transform transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h1
          className={`${
            isDarkMode ? "text-[#353535]" : "text-[#353535]"
          } text-2xl font-bold mb-4 text-center`}
        >
          Rules Alokasi BV
        </h1>
        <table
          className={`${
            isDarkMode ? "text-[#353535]" : "text-[#353535]"
          } w-full mt-4 text-sm border`}
        >
          <thead>
            <tr>
              <th className="border p-2">Rule</th>
              <th className="border p-2">Kondisi</th>
              <th className="border p-2">Then</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-center">1</td>
              <td className="border p-2">Total BV = 400</td>
              <td className="border p-2">
                Split BV Plan A = 200, BV Plan B = 200
              </td>
            </tr>
            <tr>
              <td className="border p-2 text-center">2</td>
              <td className="border p-2">Total BV &gt; 400</td>
              <td className="border p-2">
                Max BV Plan B = 200, BV Plan A &gt; 200
              </td>
            </tr>
            <tr>
              <td className="border p-2 text-center">3</td>
              <td className="border p-2">Total BV &lt; 200</td>
              <td className="border p-2">All BV to BV Plan A</td>
            </tr>
            <tr>
              <td className="border p-2 text-center">4</td>
              <td className="border p-2">
                Total BV &lt; 200 &amp; BV Plan A &gt; BV Plan B
              </td>
              <td className="border p-2">All BV to BV Plan A</td>
            </tr>
            <tr>
              <td className="border p-2 text-center">5</td>
              <td className="border p-2">
                Total BV &gt; 200 &amp; BV Plan B &gt;= 200
              </td>
              <td className="border p-2">
                Max BV Plan B = 200, sisa ke BV Plan A
              </td>
            </tr>
            <tr>
              <td className="border p-2 text-center">6</td>
              <td className="border p-2">
                Total BV &gt; 200 &amp; BV Plan B &gt; BV Plan A &amp; BV Plan B
                &lt; 200 &amp; BV Plan A &lt; 200
              </td>
              <td className="border p-2">
                Max BV Plan B = 200, sisa ke BV Plan A
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-center font-semibold w-full border border-green-500 text-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BVRuleModal;
