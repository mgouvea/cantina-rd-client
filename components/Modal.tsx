import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ModalProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
}

export function DialogCloseButton({
  title,
  description,
  children,
  open,
  onOpenChange,
  onConfirm,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-lg">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>
          <div className="flex w-full flex-col gap-4">
            <Button
              type="button"
              variant="default"
              className="cursor-pointer text-xl h-[55px]"
              onClick={onConfirm}
            >
              Concluir compra
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer text-lg h-[55px]"
              onClick={() => onOpenChange?.(false)}
            >
              Continuar comprando
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
