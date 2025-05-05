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
  buttonConfirmText?: string;
  buttonCancelText?: string;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
}

export function DialogCloseButton({
  title,
  description,
  children,
  open,
  buttonConfirmText,
  buttonCancelText,
  onOpenChange,
  onConfirm,
}: ModalProps) {
  const confirmClickedRef = React.useRef(false);

  React.useEffect(() => {
    confirmClickedRef.current = false;
  }, [open]);

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmClickedRef.current) {
      console.log("Confirm already clicked, preventing duplicate action");
      return;
    }

    confirmClickedRef.current = true;

    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl [&_svg]:h-8 [&_svg]:w-8 [&_svg]:text-red-600">
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
              className="cursor-pointer btn-socio hover:brightness-90 text-xl h-[55px]"
              onClick={handleConfirmClick}
            >
              {buttonConfirmText || "Concluir compra"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer text-lg h-[55px]"
              onClick={() => onOpenChange?.(false)}
            >
              {buttonCancelText || "Continuar comprando"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
