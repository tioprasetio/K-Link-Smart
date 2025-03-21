import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

// 1. Definisikan tipe context
interface DarkModeContextType {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Buat context
const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: ReactNode;
}

const DarkModeContextProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  // 3. Ambil nilai awal dari localStorage atau default ke false
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 4. Simpan ke localStorage setiap kali isDarkMode berubah
  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      "useDarkMode must be used within a DarkModeContextProvider"
    );
  }
  return context;
};

export { DarkModeContext };
export default DarkModeContextProvider;
