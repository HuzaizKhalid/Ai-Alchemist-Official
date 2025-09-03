import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  isSearchActive: boolean;
  setSearchActive: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchActive, setSearchActive] = useState(false);

  return (
    <SearchContext.Provider value={{ isSearchActive, setSearchActive }}>
      {children}
    </SearchContext.Provider>
  );
}

// 4️⃣ Custom Hook
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
