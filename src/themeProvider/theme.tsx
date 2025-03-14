import { useState } from "react";
import themeContext from "../theme/themeContext";

type ChildrenProps = {
  children: React.ReactNode
};

function ThemeProvider({children}: ChildrenProps) {
  const [name, setName] = useState("");

  const handleFilter = (value: string) => {
    setName(value);
  };

  const values = {
    filters: {
      filterByName: name,
     
    },
    handleFilter,
  };

  return (
    <themeContext.Provider value={values}>
      {children}
    </themeContext.Provider>
  )
};

export default ThemeProvider;