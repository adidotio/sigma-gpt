import { createContext } from "react";

export const MyContext = createContext({
  theme: "light",
  toggleTheme: () => {}
})