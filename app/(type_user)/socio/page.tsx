"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NormalizeText } from "@/utils";
import { Search } from "lucide-react";
import { Triangle } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts";
import { Input } from "@/components/ui/input";
import { CardUser } from "@/components/cardUser";

const Page = () => {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { update } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredUsers = useMemo(() => {
    if (!users || debouncedSearch.length < 3) {
      return debouncedSearch.length > 0 && debouncedSearch.length < 3
        ? []
        : users || [];
    }

    const normalizedSearch = NormalizeText(debouncedSearch.trim());

    return users.filter((user: User) => {
      const normalizedName = NormalizeText(user.name);
      const normalizedTelephone = NormalizeText(user.telephone);

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedTelephone.includes(normalizedSearch)
      );
    });
  }, [users, debouncedSearch]);

  const handleUserSelect = (user: User) => {
    update(user);
    router.push("/store");
  };

  return (
    <div className="flex flex-col py-12 padding-container">
      <h1 className="text-2xl font-bold">Sócios Registrados</h1>
      <p className="text-light-800 text-sm md:text-md">
        Selecione seu nome abaixo para registrar seu pedido.
      </p>

      <div className="relative w-full lg:max-w-2xl mt-12">
        <Input
          type="text"
          placeholder="Pesquise seu nome"
          className="pr-8 bg-white shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center mt-12">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#007dc5"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user: User) => (
            <CardUser
              key={user._id}
              {...user}
              onUserSelect={() => handleUserSelect(user)}
            />
          ))
        ) : debouncedSearch.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-dark-300">
              Nenhum sócio encontrado com &ldquo;{debouncedSearch}&rdquo;
            </p>
            <p className="text-sm mt-1 text-dark-300">
              Tente outro termo de pesquisa
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-300">Nenhum sócio cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
