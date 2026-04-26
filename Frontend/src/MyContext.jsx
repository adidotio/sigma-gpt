import { createContext } from "react";

export const MyContext = createContext({
  isAuth: false,
  setIsAuth: () => {},
  showAuth: false,
  setShowAuth: () => {},
  user: null,
  setUser: () => {},
  showProfile: false,
  setShowProfile: () => {}
});