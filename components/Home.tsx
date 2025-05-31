"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useVisitorStore } from "@/contexts";

export const Home = () => {
  const router = useRouter();

  const { setIsVisitorBuying } = useVisitorStore();

  const handleRedirectClick = (type: "socio" | "visitante") => {
    if (type === "visitante") {
      setIsVisitorBuying(true);
    }
    router.push(`/${type}`);
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      alert("This browser does not support fullscreen mode.");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen px-12 md:px-28 lg:px-96 md:py-12 lg:py-10">
      <div className="flex-center flex-col gap-2 pt-2 w-full h-[25%]">
        <h1 className="text-light-800 text-4xl">Bem vindo à</h1>
        <Image
          src="/cantinaRD.png"
          width={150}
          height={150}
          alt="Logo"
          onClick={handleFullscreen}
        />
        <p className="text-light-800 text-3xl">Cantina RD</p>
      </div>
      <div className="flex flex-col items-center justify-between pt-16 pb-20 md:py-24 w-full h-[75%]">
        <div className="flex flex-col gap-3 w-full lg:w-[70%]">
          <p className="text-light-800 text-xl mb-2">Quem está comprando?</p>
          <div className="flex flex-col gap-7">
            <Button
              variant="default"
              className="w-full btn-socio hover:brightness-90 h-[90px] text-xl"
              onClick={() => handleRedirectClick("socio")}
            >
              Sócio Realeza
            </Button>
            <Button
              variant="outline"
              className="w-full btn-visitante h-[90px] text-xl"
              onClick={() => handleRedirectClick("visitante")}
            >
              Visitante
            </Button>
          </div>
        </div>

        <p className="text-light-800 text-xl text-center">
          Registre suas compras de forma simples e rápida
        </p>
      </div>
    </div>
  );
};
