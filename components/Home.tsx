"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const Home = () => {
  const router = useRouter();

  const handleRedirectClick = (type: "socio" | "visitante") => {
    router.push(`/${type}`);
  };

  return (
    <div className="flex flex-col w-full h-screen px-12 md:px-28 lg:px-96 lg:pt-10">
      <div className="flex-center flex-col gap-2 pt-2 w-full h-[25%]">
        <h1 className="text-light-800 text-2xl">Bem vindo à</h1>
        <Image src="/cantinaRD.png" width={120} height={120} alt="Logo" />
        <p className="text-light-800 text-md">Cantina RD</p>
      </div>
      <div className="flex flex-col items-center justify-between pt-16 pb-20 md:py-24 w-full h-[75%]">
        <div className="flex flex-col gap-3 w-full lg:w-[70%]">
          <p className="text-light-800 text-md">Quem está comprando?</p>
          <Button
            variant="default"
            className="w-full btn-socio hover:brightness-90"
            onClick={() => handleRedirectClick("socio")}
          >
            Sócio
          </Button>
          <Button
            variant="outline"
            className="w-full btn-visitante"
            onClick={() => handleRedirectClick("visitante")}
          >
            Visitante
          </Button>
        </div>

        <p className="text-light-800 text-sm text-center">
          Registre suas compras de forma simples e rápida
        </p>
      </div>
    </div>
  );
};
