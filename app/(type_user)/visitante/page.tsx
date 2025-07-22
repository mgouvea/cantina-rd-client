"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NormalizeText } from "@/utils";
import { Search } from "lucide-react";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useVisitors } from "@/hooks/queries";
import { useVisitorStore } from "@/contexts";
import { Input } from "@/components/ui/input";
import { Visitor } from "@/types";
import { Button } from "@/components/ui/button";
import { ModalRegisterVisitors } from "@/components/ModalRegisterVisitors";
import { CardVisitors } from "@/components/cardVisitors";

const Page = () => {
  const router = useRouter();
  const { data: visitors, isLoading } = useVisitors();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [open, setOpen] = useState<boolean>(false);

  const { updateVisitor } = useVisitorStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredVisitors = useMemo(() => {
    if (!visitors || debouncedSearch.length < 3) {
      return debouncedSearch.length > 0 && debouncedSearch.length < 3
        ? []
        : visitors || [];
    }

    const normalizedSearch = NormalizeText(debouncedSearch.trim());

    return visitors.filter((visitor: Visitor) => {
      const normalizedName = NormalizeText(visitor.name);
      const normalizedTelephone = NormalizeText(visitor.telephone);

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedTelephone.includes(normalizedSearch)
      );
    });
  }, [visitors, debouncedSearch]);

  const handleSelectVisitor = (visitor: Visitor) => {
    updateVisitor(visitor);
    router.push("/store");
  };

  return (
    <div className="flex flex-col relative min-h-[88dvh] py-12 padding-container pb-[110px]">
      <div>
        <h1 className="text-2xl font-bold">Visitantes Registrados</h1>
        <p className="text-light-800 text-sm md:text-lg">
          Selecione seu nome abaixo para registrar seu pedido.
        </p>

        <div className="relative w-full lg:max-w-2xl mt-12">
          <Input
            type="text"
            placeholder="Pesquise seu nome"
            className="pr-8 bg-white shadow-md h-[50px] md:text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-muted-foreground" />
        </div>

        <div className="mt-5 flex flex-col h-full">
          {/* Header fixo */}
          <div className="flex-shrink-0 mb-4">
            <p className="text-gray-400 text-sm md:text-lg">
              Visitantes recentes
            </p>
          </div>

          {/* Área de conteúdo com scroll */}
          <div
            className="flex-1 overflow-y-auto pb-4"
            style={{ maxHeight: "calc(93vh - 280px - 90px - 2rem)" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center mt-12">
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              </div>
            ) : filteredVisitors.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredVisitors
                  .sort((a: Visitor, b: Visitor) =>
                    a.name.localeCompare(b.name)
                  )
                  .map((visitor: Visitor) => (
                    <CardVisitors
                      key={visitor._id}
                      {...visitor}
                      onUserSelect={() => handleSelectVisitor(visitor)}
                    />
                  ))}
              </div>
            ) : debouncedSearch.length > 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-300">
                  Nenhum visitante encontrado com &ldquo;{debouncedSearch}
                  &rdquo;
                </p>
                <p className="text-sm mt-1 text-dark-300">
                  Tente outro termo de pesquisa
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-300">Nenhum visitante recente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="default"
        className="w-full btn-socio hover:brightness-90 h-[90px] text-xl fixed bottom-5 left-0 right-0 z-10 max-w-[calc(100%-2rem)] mx-auto padding-container"
        onClick={() => setOpen(true)}
      >
        Novo por aqui? Registre-se!
      </Button>

      <ModalRegisterVisitors open={open} setOpen={setOpen} />
    </div>
  );
};

export default Page;
