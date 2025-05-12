"use client";

import { useUser } from "@/contexts/UserContext";
import WalletDashboard from "@/components/WalletDashboard";
import AuthContainer from "@/components/Auth/AuthContainer";

export default function Home() {
  const { isAuthenticated } = useUser();

  return (
    <main className="min-h-screen">
      {isAuthenticated ? <WalletDashboard /> : <AuthContainer />}
    </main>
  );
}
