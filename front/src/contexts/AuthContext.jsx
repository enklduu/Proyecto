import { createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    const login = (userData) => {
      // console.log("Entro");
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem('user');
      setUser(null);
      window.location.reload();
    };
  
    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, setUser,  login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  