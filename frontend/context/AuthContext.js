import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export function AuthProvider({children}){
  const [token,setToken] = useState(null);
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if(t) setToken(t);
    if(u) setUser(JSON.parse(u));
  },[]);

  const save = (t,u)=>{
    if(t){ localStorage.setItem("token",t); setToken(t); }
    if(u){ localStorage.setItem("user",JSON.stringify(u)); setUser(u); }
  };

  const clear = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); setUser(null);
  };

  return <AuthCtx.Provider value={{token,user,save,clear}}>{children}</AuthCtx.Provider>
}
export const useAuth = ()=>useContext(AuthCtx);
