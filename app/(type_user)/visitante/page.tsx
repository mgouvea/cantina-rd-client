"use client";
import { useEffect, useMemo, useState } from "react";
import { NormalizeText } from "@/utils";
import { Search, Users, UserPlus } from "lucide-react";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useVisitors } from "@/hooks/queries";
import { useVisitorStore } from "@/contexts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModalRegisterVisitors } from "@/components/ModalRegisterVisitors";
import { CardVisitors } from "@/components/cardVisitors";
import { Visitor } from "@/types";

const Page = () => {
  const router = useRouter();
  const { data: visitors, isLoading } = useVisitors();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { updateVisitor } = useVisitorStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredVisitors = useMemo(() => {
    if (!visitors || debouncedSearch.length < 3) {
      return debouncedSearch.length > 0 && debouncedSearch.length < 3 ? [] : visitors || [];
    }

    const normalizedSearch = NormalizeText(debouncedSearch.trim());
    return visitors.filter((visitor: Visitor) => {
      const normalizedName = NormalizeText(visitor.name);
      const normalizedTelephone = NormalizeText(visitor.telephone);
      return (
        normalizedName.includes(normalizedSearch) || normalizedTelephone.includes(normalizedSearch)
      );
    });
  }, [visitors, debouncedSearch]);

  const handleSelectVisitor = (visitor: Visitor) => {
    updateVisitor(visitor);
    router.push("/store");
  };

  const EmptyState = ({ message, subtitle }: { message: string; subtitle?: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Users className="w-10 h-10" style={{ color: "#005f78" }} />
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pb-28">
      {/* Header */}
      <div className="padding-container pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: "linear-gradient(to bottom, #005f78, #003d4d)" }}
          />
          <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Visitantes Registrados
          </h1>
        </div>
        <p className="text-gray-600 text-base ml-4">
          Selecione seu nome abaixo para registrar seu pedido
        </p>
      </div>

      {/* Search Bar */}
      <div className="padding-container pb-4">
        <div className="relative w-full lg:max-w-2xl group">
          <div
            className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to right, rgba(0, 95, 120, 0.2), rgba(0, 61, 77, 0.2))",
            }}
          />
          <div className="relative">
            <Input
              type="text"
              placeholder="Digite pelo menos 3 caracteres para buscar..."
              className="pr-16 bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-100 h-14 text-base rounded-xl transition-all duration-300 relative z-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = "#005f78";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 95, 120, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md bg-linear-to-br from-[#005f78] to-[#003d4d]">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Contador */}
        {!isLoading && filteredVisitors.length > 0 && (
          <div className="mt-3 ml-1">
            <p className="text-sm text-gray-500 font-medium">
              {filteredVisitors.length}{" "}
              {filteredVisitors.length === 1 ? "visitante encontrado" : "visitantes encontrados"}
            </p>
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="flex-1 padding-container overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-2 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                glassColor="#c0efff"
                color="#005f78"
              />
            </div>
          ) : filteredVisitors.length > 0 ? (
            <div className="space-y-3 animate-fade-in">
              {filteredVisitors
                .sort((a: Visitor, b: Visitor) => a.name.localeCompare(b.name))
                .map((visitor: Visitor) => (
                  <div
                    key={visitor._id}
                    className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <CardVisitors {...visitor} onUserSelect={() => handleSelectVisitor(visitor)} />
                  </div>
                ))}
            </div>
          ) : debouncedSearch.length > 0 && debouncedSearch.length < 3 ? (
            <EmptyState
              message="Continue digitando..."
              subtitle="Digite pelo menos 3 caracteres para buscar"
            />
          ) : debouncedSearch.length >= 3 ? (
            <EmptyState
              message={`Nenhum visitante encontrado com "${debouncedSearch}"`}
              subtitle="Tente outro termo de pesquisa"
            />
          ) : (
            <EmptyState message="Nenhum visitante recente" subtitle="Registre-se para começar" />
          )}
        </div>
      </div>

      {/* Botão fixo no bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent pointer-events-none">
        <Button
          className="
            w-full 
            h-20 
            text-lg 
            font-semibold
            rounded-2xl 
            shadow-2xl
            pointer-events-auto
            transition-all 
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            active:scale-[0.98]
            flex
            items-center
            justify-center
            gap-3
          "
          style={{
            background: "linear-gradient(135deg, #005f78 0%, #003d4d 100%)",
          }}
          onClick={() => setOpen(true)}
        >
          <UserPlus className="w-6 h-6" />
          Novo por aqui? Registre-se!
        </Button>
      </div>

      <ModalRegisterVisitors open={open} setOpen={setOpen} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #005f78, #003d4d);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #003d4d, #002a38);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Page;
