import { createContext } from "react";

type ThemeContextType = {
  filters: {
    filterByName: string
  }
  handleFilter: (value: string) => void;
};

const themeContext = createContext({} as ThemeContextType);

export default themeContext;