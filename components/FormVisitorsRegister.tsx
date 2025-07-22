import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import getChurchData from "@/data/churchCore";

interface FormVisitorsRegisterProps {
  onSubmit: (data: {
    name: string;
    telephone: string;
    churchCore: string;
  }) => void;
}

const inputClassName =
  "h-[60px] text-base md:text-lg placeholder:text-base md:placeholder:text-lg px-4";

export const FormVisitorsRegister = ({
  onSubmit,
}: FormVisitorsRegisterProps) => {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [churchCore, setChurchCore] = useState("");
  const [isMember, setIsMember] = useState<null | boolean>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableNucleos, setAvailableNucleos] = useState<{ nome: string }[]>(
    []
  );

  // Obter dados das regiões (apenas uma vez)
  const { arrayRegioes } = getChurchData();

  // Efeito para carregar núcleos quando a região muda
  useEffect(() => {
    if (!selectedRegion) {
      setAvailableNucleos([]);
      setChurchCore("");
      return;
    }

    // Obter dados das regiões e núcleos dentro do useEffect
    const churchData = getChurchData();
    const {
      SedeGeral,
      nucleos1,
      nucleos2,
      nucleos3,
      nucleos4,
      nucleos5,
      nucleos6,
      nucleos7,
      nucleos8,
      nucleos9,
      nucleos10,
      nucleos11,
      nucleos12,
      nucleos13,
      nucleos14,
      nucleos15,
      nucleos16,
      nucleos17,
      nucleos18,
      nucleos19,
    } = churchData;

    // Mapeamento dos núcleos por região
    const nucleosByRegion: { [key: string]: { nome: string }[] } = {
      "0": SedeGeral,
      "1": nucleos1,
      "2": nucleos2,
      "3": nucleos3,
      "4": nucleos4,
      "5": nucleos5,
      "6": nucleos6,
      "7": nucleos7,
      "8": nucleos8,
      "9": nucleos9,
      "10": nucleos10,
      "11": nucleos11,
      "12": nucleos12,
      "13": nucleos13,
      "14": nucleos14,
      "15": nucleos15,
      "16": nucleos16,
      "17": nucleos17,
      "18": nucleos18,
      "19": nucleos19,
    };

    setAvailableNucleos(nucleosByRegion[selectedRegion] || []);
    setChurchCore(""); // Limpa o núcleo selecionado quando muda a região
  }, [selectedRegion]);

  // Função para lidar com mudança de região
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, telephone, churchCore });
  };

  // Função para formatar o número de telefone
  const formatTelephone = (value: string) => {
    // Remove todos os caracteres não numéricos
    let numbers = value.replace(/\D/g, "");

    // Verifica se precisa adicionar o dígito 9 após o DDD
    if (numbers.length >= 3) {
      const ddd = numbers.slice(0, 2);
      const firstDigitAfterDDD = numbers.slice(2, 3);
      const restOfNumber = numbers.slice(3);

      // Se o primeiro dígito após o DDD não é 9 e temos pelo menos 8 dígitos no total
      // (2 DDD + 8 dígitos = 10), então adiciona o 9
      if (firstDigitAfterDDD !== "9" && numbers.length >= 10) {
        numbers = ddd + "9" + firstDigitAfterDDD + restOfNumber;
      }
    }

    // Aplica a formatação
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTelephone(e.target.value);
    setTelephone(formattedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm md:text-lg">
          Nome completo
        </Label>
        <Input
          id="name"
          placeholder="Digite seu nome completo"
          className={inputClassName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone" className="text-sm md:text-lg">
          Telefone
        </Label>
        <Input
          id="telephone"
          placeholder="(61) 99999-9999"
          className={inputClassName}
          value={telephone}
          onChange={handleTelephoneChange}
          required
        />
      </div>

      {/* Radio para sócio/não sócio */}
      <div className="space-y-2">
        <Label className="text-sm md:text-lg">Você é sócio?</Label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="isMember"
              value="yes"
              checked={isMember === true}
              onChange={() => setIsMember(true)}
              className="accent-blue-600 w-5 h-5"
            />
            Sócio
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="isMember"
              value="no"
              checked={isMember === false}
              onChange={() => setIsMember(false)}
              className="accent-blue-600 w-5 h-5"
            />
            Não sócio
          </label>
        </div>
      </div>

      {/* Selects de região e núcleo, só aparecem se for sócio */}
      {isMember === true && (
        <>
          {/* Select de Região */}
          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm md:text-lg">
              Região
            </Label>
            <select
              id="region"
              className="flex h-[60px] w-full rounded-md border border-input bg-background px-4 py-2 text-base md:text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedRegion}
              onChange={handleRegionChange}
              required={isMember === true}
            >
              <option value="" disabled>
                Selecione sua região
              </option>
              {arrayRegioes.map((regiao) => (
                <option key={regiao.value} value={regiao.value}>
                  {regiao.regiao}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Núcleo */}
          {selectedRegion && (
            <div className="space-y-2">
              <Label htmlFor="churchCore" className="text-sm md:text-lg">
                Núcleo
              </Label>
              <select
                id="churchCore"
                className="flex h-[60px] w-full rounded-md border border-input bg-background px-4 py-2 text-base md:text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={churchCore}
                onChange={(e) => setChurchCore(e.target.value)}
                required={isMember === true}
              >
                <option value="" disabled>
                  Selecione seu núcleo
                </option>
                {availableNucleos.map((nucleo) => (
                  <option key={nucleo.nome} value={nucleo.nome}>
                    {nucleo.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      <Button
        type="submit"
        className="w-full mt-6 text-xl h-[70px] btn-socio hover:brightness-90"
      >
        Registrar
      </Button>
    </form>
  );
};
