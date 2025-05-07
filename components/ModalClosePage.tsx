import React from "react";
import { DialogCloseButton } from "./Modal";
import { useRouter } from "next/navigation";
import { useVisitorStore } from "@/contexts";

export const ModalClosePage = ({
  open,
  setOpen,
  onCleanCart,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCleanCart?: () => void;
}) => {
  const router = useRouter();

  const { setIsVisitorBuying } = useVisitorStore();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleConfirm = () => {
    setOpen(false);

    if (onCleanCart) {
      onCleanCart();
    }

    setIsVisitorBuying(false);
    router.push("/");
  };

  return (
    <DialogCloseButton
      title="Cancelar compra"
      description="Você será redirecionado para a página inicial"
      open={open}
      onOpenChange={handleOpenChange}
      onConfirm={handleConfirm}
      buttonConfirmText="Confirmar"
      buttonCancelText="Continuar comprando"
    />
  );
};
