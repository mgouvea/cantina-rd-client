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
    }
  };

  return (
    <div className="flex flex-col w-full h-screen px-8 md:px-12 lg:px-96 py-12">
      {/* Header com Logo e Título */}
      <div className="flex flex-col items-center gap-4 pt-8 pb-16">
        <div
          className="cursor-pointer transition-transform active:scale-95"
          onClick={handleFullscreen}
        >
          <Image src="/cantinaRD.png" width={140} height={140} alt="Logo Cantina RD" priority />
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-1">Cantina RD</h1>
          <p className="text-gray-600">Bem-vindo ao sistema de pedidos</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col items-center gap-12">
        <div className="w-full max-w-lg">
          <p className="text-xl text-gray-700 font-semibold mb-6">Quem está comprando?</p>

          <div className="flex flex-col gap-5">
            {/* Botão Sócio */}
            <Button
              onClick={() => handleRedirectClick("socio")}
              className="
                w-full 
                h-[90px] 
                text-xl 
                font-semibold
                rounded-2xl
                bg-white
                border-2
                border-gray-200
                text-gray-900
                shadow-md
                active:scale-[0.98]
                transition-all
              "
              style={{
                background: "linear-gradient(135deg, #005f78 0%, #003d4d 100%)",
                color: "white",
                borderColor: "#005f78",
              }}
            >
              Sou do Realeza
            </Button>

            {/* Botão Visitante */}
            <Button
              onClick={() => handleRedirectClick("visitante")}
              className="
                w-full 
                h-[90px] 
                text-xl 
                font-semibold
                rounded-2xl
                bg-white
                border-2
                text-gray-900
                shadow-md
                active:scale-[0.98]
                transition-all
              "
              style={{
                borderColor: "#005f78",
                color: "#005f78",
              }}
            >
              Sou visitante
            </Button>
          </div>
        </div>

        {/* Descrição */}
        <div className="w-full flex justify-center mt-auto pb-14 lg:pb-20">
          <p className="text-gray-600 text-center max-w-md">
            Registre suas compras de forma simples e rápida
          </p>
        </div>
      </div>
    </div>
  );
};
