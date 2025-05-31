"use client";

import React, { ReactNode, useState } from "react";
import { ArrowLeftIcon, X } from "lucide-react";
import { ModalClosePage } from "@/components/ModalClosePage";
import { useRouter } from "next/navigation";
import { useVisitorStore } from "@/contexts";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { setIsVisitorBuying } = useVisitorStore();

  const handleBack = () => {
    setIsVisitorBuying(false);
    router.back();
  };

  const handleOpenModal = () => {
    setOpen(true);
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
          onClick={handleOpenModal}
          size={45}
          className="cursor-pointer"
        />
      </div>
      {children}
      <ModalClosePage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Layout;
