import { createContext, useContext, useState, ReactNode } from "react";

type RouteContextType = {
  previousPath: string | null;
  setPreviousPath: (path: string) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  return (
    <RouteContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};
