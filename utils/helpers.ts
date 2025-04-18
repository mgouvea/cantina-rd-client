export const formatarTelefone = (numero: string) => {
  const numeros = numero.replace(/\D/g, "");
  const formatado = numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return formatado;
};

interface FormDataValidation {
  formData: Record<string, string | number | boolean>;
}

export const validarInputsObrigatorios = ({
  formData,
}: FormDataValidation): boolean => {
  return Object.values(formData).every((value) => value !== "");
};

export function capitalizeFirstLastName(str?: string) {
  if (!str) return "";

  const words = str.split(" ");

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  const firstName =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const lastName =
    words[words.length - 1].charAt(0).toUpperCase() +
    words[words.length - 1].slice(1).toLowerCase();

  return `${firstName} ${lastName}`;
}

export const NormalizeText = (text: string = ""): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};