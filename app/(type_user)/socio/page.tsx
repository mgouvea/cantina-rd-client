"use client";
import { useEffect, useMemo, useState, startTransition } from "react";
import { NormalizeText } from "@/utils";
import { Search, Users } from "lucide-react";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts";
import { Input } from "@/components/ui/input";
import { CardUser } from "@/components/cardUser";
import { User } from "@/types";

const Page = () => {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { update } = useUserStore();

  useEffect(() => {
    router.prefetch("/store");
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a: User, b: User) => a.name.localeCompare(b.name));
  }, [users]);

  const normalizedUsers = useMemo(() => {
    return sortedUsers.map((user) => ({
      ...user,
      _normalizedName: NormalizeText(user.name),
      _normalizedTelephone: NormalizeText(user.telephone),
    }));
  }, [sortedUsers]);

  const filteredUsers = useMemo(() => {
    if (debouncedSearch.length > 0 && debouncedSearch.length < 2) {
      return [];
    }

    if (debouncedSearch.length < 2) {
      return normalizedUsers;
    }

    const normalizedSearch = NormalizeText(debouncedSearch.trim());
    return normalizedUsers.filter(
      (user) =>
        user._normalizedName.includes(normalizedSearch) ||
        user._normalizedTelephone.includes(normalizedSearch)
    );
  }, [normalizedUsers, debouncedSearch]);

  const handleUserSelect = (user: User) => {
    update(user);
    startTransition(() => {
      router.push("/store");
    });
  };

  const EmptyState = ({ message, subtitle }: { message: string; subtitle?: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-100 to-green-50 flex items-center justify-center mb-4">
        <Users className="w-10 h-10 text-green-600" />
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-50 via-white to-green-50/30">
      {/* Header com gradiente sutil */}
      <div className="padding-container pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-linear-to-b from-[#005f78] to-[#003d4d] rounded-full" />
          <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sócios Registrados
          </h1>
        </div>
        <p className="text-gray-600 text-base ml-4">
          Selecione seu nome abaixo para registrar seu pedido
        </p>
      </div>

      {/* Search Bar modernizada */}
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
              placeholder="Digite pelo menos 2 caracteres para buscar..."
              className="pr-12 bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-100 h-14 text-base rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#005f78] to-[#003d4d] flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="mt-3 ml-1">
            <p className="text-sm text-gray-500 font-medium">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "sócio encontrado" : "sócios encontrados"}
            </p>
          </div>
        )}
      </div>

      {/* Lista de usuários */}
      <div className="flex-1 padding-container pb-8 overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 space-y-3 custom-scrollbar">
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
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3 animate-fade-in">
              {filteredUsers.map((user: User) => (
                <div
                  key={user._id}
                  className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <CardUser {...user} onUserSelect={() => handleUserSelect(user)} />
                </div>
              ))}
            </div>
          ) : debouncedSearch.length > 0 && debouncedSearch.length < 2 ? (
            <EmptyState
              message="Continue digitando..."
              subtitle="Digite pelo menos 2 caracteres para buscar"
            />
          ) : debouncedSearch.length >= 3 ? (
            <EmptyState
              message={`Nenhum sócio encontrado com "${debouncedSearch}"`}
              subtitle="Tente outro termo de pesquisa"
            />
          ) : (
            <EmptyState
              subtitle="Cadastre um sócio para continuar"
              message="Nenhum sócio cadastrado"
            />
          )}
        </div>
      </div>

      {/* CSS customizado para scrollbar */}
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
