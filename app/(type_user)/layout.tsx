"use client";
import React from "react";
import { ArrowLeftIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col py-5 px-3 min-h-screen h-full w-auto bg-gray-100">
      <div className="flex justify-between w-full h-fit py-1">
        <div
          className="flex items-center gap-0.5 cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeftIcon size={35} />
          <p className="text-light-800 text-2xl">Voltar</p>
        </div>
        <X
          color="red"
          onClick={handleBack}
          size={45}
          className="cursor-pointer"
        />
      </div>
      {children}
    </div>
  );
};

export default Layout;
