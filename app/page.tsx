"use client";
import { Home } from "@/components/Home";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useLogin } from "@/hooks/mutations/login.mutation";
import { authStorage } from "@/utils/auth";
import { useEffect, useState } from "react";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { mutate: login } = useLogin();

  useEffect(() => {
    const token = authStorage.getToken();

    if (token) {
      // Já tem token? Entra direto, sem delay!
      setIsAuthenticated(true);
      setShowLoading(false);
      return;
    }

    // Não tem token? Faz login com delay de 3s
    const email = process.env.NEXT_PUBLIC_APP_EMAIL_LOGIN;
    const password = process.env.NEXT_PUBLIC_APP_PASSWORD_LOGIN;

    if (!email || !password) {
      console.error("Login credentials not found in environment variables");
      setShowLoading(false);
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (data?.access_token) {
            authStorage.setToken(data.access_token);
            // Delay de 3s apenas no primeiro login
            setTimeout(() => {
              setIsAuthenticated(true);
              setShowLoading(false);
            }, 3000);
          }
        },
        onError: (error) => {
          console.error("Auto-login failed:", error);
          setShowLoading(false);
        },
      },
    );
  }, [login]);

  if (!isAuthenticated || showLoading) {
    return (
      <div className="w-full h-screen bg-white">
        <LoadingAnimation showImage={true} title="Cantina RD" titleSize="text-4xl" />
      </div>
    );
  }

  return <Home />;
};

export default Page;
