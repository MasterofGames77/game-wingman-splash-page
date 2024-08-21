import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the authentication context
type AuthContextType = {
  token: string | null;
  setAuth: (token: string | null) => void;
};

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps your app and provides the auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const setAuth = (newToken: string | null) => {
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
