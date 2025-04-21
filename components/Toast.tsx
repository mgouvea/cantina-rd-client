import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

// Exportar toast e Bounce para uso direto
export { toast, Bounce };

interface ToastProps {
  position?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
  time?: number;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export const Toast = ({
  position = "top-center",
  time = 3000,
  message,
  type = "success",
}: ToastProps) => {
  useEffect(() => {
    toast[type](message, {
      position: position,
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, [message, position, time, type]);

  return null;
};

export const ToastProvider = () => {
  return <ToastContainer />;
};
