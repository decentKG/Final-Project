import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (auth: boolean) => {},
  user: null, // { name: string, email: string, gender: "male" | "female" }
  setUser: (user: any) => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Demo default user (male)
  const [user, setUser] = useState({ name: "Tawanda Moyo", email: "tawanda.moyo@email.com", gender: "male" });
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
} 