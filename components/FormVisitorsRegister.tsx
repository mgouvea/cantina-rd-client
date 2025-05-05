import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  // Array com os nomes dos núcleos
  const nucleos = [
    "Canário Verde",
    "Convite aos Encantos",
    "Estrela Matutina",
    "Gaspar",
    "Luz do Oriente",
    "Principe Teceu",
    "Rei Hoasqueiro",
    "Sede Geral",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, telephone, churchCore });
  };

  // Função para formatar o número de telefone
  const formatTelephone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

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

      <div className="space-y-2">
        <Label htmlFor="churchCore" className="text-sm md:text-lg">
          Núcleo
        </Label>
        <select
          id="churchCore"
          className="flex h-[60px] w-full rounded-md border border-input bg-background px-4 py-2 text-base md:text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={churchCore}
          onChange={(e) => setChurchCore(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione seu núcleo
          </option>
          {nucleos.map((nucleo) => (
            <option key={nucleo} value={nucleo}>
              N. {nucleo}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        className="w-full mt-6 text-xl h-[70px] btn-socio hover:brightness-90"
      >
        Registrar
      </Button>
    </form>
  );
};
