import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormVisitorsRegister } from "./FormVisitorsRegister";
import { Triangle } from "react-loader-spinner";
import { toast } from "./Toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddVisitor } from "@/hooks/mutations";
import { removerMascaraTelefone } from "@/utils";
import { useVisitorStore } from "@/contexts";

export const ModalRegisterVisitors = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: addVisitor } = useAddVisitor();
  const { updateVisitor } = useVisitorStore();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleSubmit = async (formData: {
    name: string;
    telephone: string;
    churchCore: string;
  }) => {
    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        telephone: removerMascaraTelefone(formData.telephone),
        churchCore: formData.churchCore,
      };
      console.log("Dados do formulário:", payload);

      await addVisitor(payload);

      toast.success(
        "Registro realizado com sucesso! Você já pode fazer seu pedido."
      );

      updateVisitor(payload);
      setOpen(false);

      setTimeout(() => {
        router.push("/store");
      }, 1000);
    } catch (err) {
      console.error("Erro ao registrar:", err);
      toast.error("Ocorreu um erro ao tentar registrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">Novo visitante</DialogTitle>
          <DialogDescription className="text-lg">
            Registre-se para fazer seu pedido
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <p className="mt-4 text-center text-sm text-gray-500">
              Registrando seus dados...
            </p>
          </div>
        ) : (
          <FormVisitorsRegister onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};
