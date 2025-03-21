import { useState } from "react";
import { askMistral } from "../api/mistralApi";
import { useDarkMode } from "../context/DarkMode";

interface ChatbotProps {
  productName: string; // Produk yang sedang dibuka
  productDescription: string;
  productHarga: number;
}

const Chatbot: React.FC<ChatbotProps> = ({
  productName,
  productDescription,
  productHarga,
}) => {
  const { isDarkMode } = useDarkMode();

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Modifikasi pertanyaan dengan menambahkan nama produk & deskripsi
    const enhancedPrompt = `Produk: ${productName}.\nDeskripsi: ${productDescription}.\nHarga: ${productHarga}.\nPertanyaan: ${input}`;

    const botResponse = await askMistral(enhancedPrompt);
    setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    setLoading(false);
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
      } w-full shadow-lg rounded-lg`}
    >
      <div className="p-3 bg-[#28a154] text-white font-bold rounded-t-lg">
        Chatbot AI K-Smart
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block max-w-[75%] p-2 rounded-lg text-sm break-words ${
                msg.role === "user"
                  ? "bg-[#28a154] text-white text-right"
                  : "bg-gray-200 text-gray-900 text-left"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 text-sm">AI sedang berpikir...</div>
        )}
      </div>

      <div className="p-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Tanyakan tentang ${productName}...`}
          className={`${
            isDarkMode
              ? "bg-[#282828] text-[#f0f0f0] border-gray-700"
              : "bg-[#ffffff] text-gray-900 border-gray-300"
          } w-full p-2 border  rounded-md outline-none`}
        />
        <button
          onClick={handleSendMessage}
          className="cursor-pointer ml-2 bg-[#28a154] text-white px-3 py-2 rounded-md hover:bg-[#167e3c]"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
