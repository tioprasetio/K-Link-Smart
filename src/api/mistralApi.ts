import axios from "axios";

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY; // Simpan di .env

export const askMistral = async (message: string) => {
  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny", // Bisa juga "mistral-medium" atau "mistral-large"
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data.choices[0]?.message?.content || "Maaf, tidak ada jawaban."
    );
  } catch (error) {
    console.error("Error fetching Mistral AI:", error);
    return "Maaf, terjadi kesalahan.";
  }
};
