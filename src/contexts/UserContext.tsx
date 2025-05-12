import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  identityId: string | null;
  firstName: string | null;
  lastName: string | null;
  mainWalletId: string | null;
  cardWalletId: string | null;
  isAuthenticated: boolean;
  setUser: (user: {
    identityId: string;
    firstName: string;
    lastName: string;
    mainWalletId?: string;
    cardWalletId?: string;
  }) => void;
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


  useEffect(() => {
    // Only run on client-side
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
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          localStorage.removeItem("walletUser");
        }
      }
    }
  }, []);

  const setUser = (user: {
    identityId: string;
    firstName: string;
    lastName: string;
    mainWalletId?: string;
    cardWalletId?: string;
  }) => {
    setIdentityId(user.identityId);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    if (user.mainWalletId) setMainWalletId(user.mainWalletId);
    if (user.cardWalletId) setCardWalletId(user.cardWalletId);

    // Store in localStorage for persistence (only in browser)
    if (typeof window !== "undefined") {
      localStorage.setItem("walletUser", JSON.stringify(user));
    }
  };

  const logout = () => {
    setIdentityId(null);
    setFirstName(null);
    setLastName(null);
    setMainWalletId(null);
    setCardWalletId(null);

    // Remove from localStorage (only in browser)
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
