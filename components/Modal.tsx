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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-md">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>
          <div className="flex w-full flex-col gap-3">
            <Button
              type="button"
              variant="default"
              className="cursor-pointer text-lg"
              onClick={onConfirm}
            >
              Confirmar
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer text-lg"
              onClick={() => onOpenChange?.(false)}
            >
              Voltar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
