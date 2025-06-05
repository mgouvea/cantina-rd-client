"use client";
import React from "react";
import { ArrowLeftIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModalClosePage } from "@/components/ModalClosePage";
import { useCartStore } from "@/contexts/cart-store";
import { useUserStore, useVisitorStore } from "@/contexts";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { clearCart } = useCartStore();
  const { update } = useUserStore();
  const { updateVisitor } = useVisitorStore();

  const handleBack = () => {
    router.back();
    clearCart();
    update(null);
    updateVisitor(null);
  };

  const handleCleanCart = () => {
    clearCart();
    update(null);
    updateVisitor(null);
  };

  return (
    <div className="flex flex-col py-3 px-5 min-h-screen h-full w-auto bg-gray-100 overflow-y-hidden">
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
          onClick={() => setOpen(true)}
          className="cursor-pointer"
          size={45}
        />
      </div>
      {children}
      <ModalClosePage
        open={open}
        setOpen={setOpen}
        onCleanCart={handleCleanCart}
      />
    </div>
  );
};

export default Layout;
