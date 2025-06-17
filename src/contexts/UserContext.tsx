import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserData {
  identityId: string;
  firstName: string;
  lastName: string;
  country: string;
  mainWalletId?: string;
  cardWalletId?: string;
  currencyCode: string;
  currencySymbol: string;
  currencyPrecision: number;
}

interface UserContextType {
  identityId: string | null;
  firstName: string | null;
  lastName: string | null;
  mainWalletId: string | null;
  cardWalletId: string | null;
  country: string;
  currencyCode?: string;
  currencySymbol?: string;
  currencyPrecision?: number;
  isAuthenticated: boolean;
  setUser: (user: UserData) => void;
  setMainWalletId: (id: string) => void;
  setCardWalletId: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [mainWalletId, setMainWalletId] = useState<string | null>(null);
  const [cardWalletId, setCardWalletId] = useState<string | null>(null);
  const [country, setCountry] = useState<string>("US");
  const [currencyCode, setCurrencyCode] = useState<string>("USD");
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  const [currencyPrecision, setCurrencyPrecision] = useState<number>(100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("walletUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIdentityId(user.identityId);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setMainWalletId(user.mainWalletId);
          setCardWalletId(user.cardWalletId);
          setCountry(user.country || "US");
          setCurrencyCode(user.currencyCode || "USD");
          setCurrencySymbol(user.currencySymbol || "$");
          setCurrencyPrecision(user.currencyPrecision || 100);
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          localStorage.removeItem("walletUser");
        }
      }
    }
  }, []);

  const setUser = (user: UserData) => {
    setIdentityId(user.identityId);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setCountry(user.country || "US");
    setCurrencyCode(user.currencyCode || "USD");
    setCurrencySymbol(user.currencySymbol || "$");
    setCurrencyPrecision(user.currencyPrecision || 100);
    if (user.mainWalletId) setMainWalletId(user.mainWalletId);
    if (user.cardWalletId) setCardWalletId(user.cardWalletId);

    if (typeof window !== "undefined") {
      localStorage.setItem("walletUser", JSON.stringify(user));
    }
  };

  const logout = () => {
    setIdentityId(null);
    setFirstName(null);
    setLastName(null);
    setCountry("US");
    setMainWalletId(null);
    setCardWalletId(null);
    setCurrencyCode("USD");
    setCurrencySymbol("$");
    setCurrencyPrecision(100);

    if (typeof window !== "undefined") {
      localStorage.removeItem("walletUser");
    }
  };

  return (
    <UserContext.Provider
      value={{
        identityId,
        firstName,
        lastName,
        mainWalletId,
        cardWalletId,
        country,
        currencyCode,
        currencySymbol,
        currencyPrecision,
        isAuthenticated: !!identityId,
        setUser,
        setMainWalletId,
        setCardWalletId,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
