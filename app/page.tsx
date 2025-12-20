"use client";

import { Home } from "@/components/Home";
import { useLogin } from "@/hooks/mutations/login.mutation";
import { authStorage } from "@/utils/auth";
import { useEffect, useState } from "react";
import Image from "next/image";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { mutate: login } = useLogin();

  useEffect(() => {
    const token = authStorage.getToken();

    if (token) {
      setTimeout(() => {
        setIsAuthenticated(true);
        setShowLoading(false);
      }, 3000);
      return;
    }

    const email = process.env.NEXT_PUBLIC_APP_EMAIL_LOGIN;
    const password = process.env.NEXT_PUBLIC_APP_PASSWORD_LOGIN;

    if (!email || !password) {
      console.error("Login credentials not found in environment variables");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (data?.access_token) {
            authStorage.setToken(data.access_token);
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
      }
    );
  }, [login]);

  if (!isAuthenticated || showLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 w-full h-screen bg-white">
        <div className="animate-fade-in">
          <div className="animate-pulse-slow">
            <Image src="/cantinaRD.png" width={200} height={200} alt="Cantina RD Logo" priority />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 animate-fade-in-delay">
          <h1 className="text-light-800 text-4xl font-bold">Cantina RD</h1>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-1"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-2"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-3"></div>
          </div>
        </div>
      </div>
    );
  }

  return <Home />;
};

export default Page;
