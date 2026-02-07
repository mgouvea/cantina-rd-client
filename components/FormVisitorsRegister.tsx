import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import getChurchData from "@/data/churchCore";
import { useVisitorByPhone } from "@/hooks/queries/visitors.query";
import { removerMascaraTelefone } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, X, Check } from "lucide-react";

interface FormVisitorsRegisterProps {
  onSubmit: (data: { name: string; telephone: string; churchCore: string }) => void;
  onExistingVisitor?: (visitor: any) => void;
}

const inputClassName =
  "h-[60px] text-base md:text-lg placeholder:text-base md:placeholder:text-lg px-4";

export const FormVisitorsRegister = ({
  onSubmit,
  onExistingVisitor,
}: FormVisitorsRegisterProps) => {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [churchCore, setChurchCore] = useState("");
  const [isMember, setIsMember] = useState<null | boolean>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableNucleos, setAvailableNucleos] = useState<{ nome: string }[]>([]);
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [foundVisitor, setFoundVisitor] = useState<any>(null);

  // Obter dados das regiões (apenas uma vez)
  const { arrayRegioes } = getChurchData();

  // Query para buscar visitante por telefone
  const { data: visitorData } = useVisitorByPhone(debouncedPhone);

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
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTelephone(e.target.value);
    setTelephone(formattedValue);
  };

  // Debounce para buscar visitante após digitar telefone completo
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanPhone = removerMascaraTelefone(telephone);
      // Telefone completo tem 11 dígitos (DDD + 9 dígitos)
      if (cleanPhone.length === 11) {
        setDebouncedPhone(cleanPhone);
      } else {
        setDebouncedPhone("");
        setShowConfirmation(false);
        setFoundVisitor(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [telephone]);

  // Quando encontrar um visitante, mostrar confirmação
  useEffect(() => {
    if (visitorData && debouncedPhone) {
      setFoundVisitor(visitorData);
      setShowConfirmation(true);
    }
  }, [visitorData, debouncedPhone]);

  const handleConfirmVisitor = () => {
    if (foundVisitor && onExistingVisitor) {
      onExistingVisitor(foundVisitor);
    }
  };

  const handleRejectVisitor = () => {
    setShowConfirmation(false);
    setFoundVisitor(null);
  };

  // Função para validar o nome (apenas letras, espaços e acentos)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Regex que permite letras (incluindo acentuadas), espaços e hífen
    const validNameRegex = /^[\p{L}\s-]*$/u;
    const value = e.target.value;

    if (value === "" || validNameRegex.test(value)) {
      setName(value);
    }
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
          onChange={handleNameChange}
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

      {/* Confirmação de visitante existente */}
      <AnimatePresence>
        {showConfirmation && foundVisitor && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative overflow-hidden rounded-2xl border-2 border-[#005f78] bg-linear-to-br from-[#005f78]/5 via-white to-[#005f78]/10 p-6 shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#005f78]/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#005f78]/5 rounded-full -ml-12 -mb-12" />

            <div className="relative flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#005f78] to-[#003d4d] flex items-center justify-center shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visitante encontrado!</h3>
                <p className="text-lg text-gray-700 mb-4">
                  <span className="font-semibold text-[#005f78]">{foundVisitor.name}</span>, é você?
                </p>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmVisitor}
                    className="flex-1 h-14 rounded-xl bg-linear-to-r from-[#005f78] to-[#003d4d] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Sim, sou eu!
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRejectVisitor}
                    className="flex-1 h-14 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Não sou eu
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <Button type="submit" className="w-full mt-6 text-xl h-[70px] btn-socio hover:brightness-90">
        Registrar
      </Button>
    </form>
  );
};
