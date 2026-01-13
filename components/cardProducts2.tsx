import Image from "next/image";
import { useMemo, useCallback, startTransition } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/contexts/cart-store";
import { CardProductsProps } from "@/types";

export const CardProducts2 = ({ _id, name, description, price, urlImage }: CardProductsProps) => {
  const { items, addItem, removeItem } = useCartStore();

  const quantity = useMemo(() => {
    const cartItem = items.find((i) => i.id === _id);
    return cartItem ? cartItem.quantity : 0;
  }, [items, _id]);

  const handlePlus = useCallback(() => {
    startTransition(() => {
      addItem({ id: _id, name, price });
    });
  }, [_id, name, price, addItem]);

  const handleMinus = useCallback(() => {
    if (quantity === 0) return;
    startTransition(() => {
      removeItem(_id);
    });
  }, [quantity, _id, removeItem]);

  return (
    <div
      className="
        flex 
        bg-white 
        rounded-2xl 
        shadow-md 
        border 
        border-gray-100
        w-full
        h-[170px]
        px-4 
        py-4 
        gap-4
        relative
        active:scale-[0.99]
        transition-all
      "
    >
      {/* IMAGEM */}
      <div className="w-[110px] flex flex-col justify-between items-center flex-shrink-0">
        <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden bg-gray-50">
          <Image src={urlImage} alt={name} fill className="object-contain p-2" />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm text-gray-500">R$</span>
          <span className="text-xl font-bold text-[#005f78]">
            {price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* TEXTO */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center justify-between mt-3">
          {/* BOTÃO REMOVER */}
          <button
            onClick={handleMinus}
            disabled={quantity === 0}
            className="
              w-28 h-12
              flex items-center justify-center gap-2
              rounded-xl
              border-2
              text-sm font-medium
              active:scale-95
              transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
            "
            style={{
              borderColor: quantity === 0 ? "#e5e7eb" : "#dc2626",
              backgroundColor: quantity === 0 ? "#f9fafb" : "#fee2e2",
            }}
          >
            <Minus size={18} color={quantity === 0 ? "#9ca3af" : "#dc2626"} />
            Remover
          </button>

          {/* QUANTIDADE */}
          <span className="text-2xl font-bold w-12 text-center">{quantity}</span>

          {/* BOTÃO ADICIONAR */}
          <button
            onClick={handlePlus}
            className="
              w-28 h-12
              flex items-center justify-center gap-2
              rounded-xl
              border-2
              text-sm font-medium
              active:scale-95
              transition-all
            "
            style={{
              borderColor: "#005f78",
              backgroundColor: "#e6f7fc",
              color: "#005f78",
            }}
          >
            <Plus size={18} color="#005f78" />
            Adicionar
          </button>
        </div>
      </div>

      {/* BADGE CARRINHO */}
      {quantity > 0 && (
        <div
          className="
            absolute 
            -top-2 
            -right-2 
            w-8 h-8
            rounded-full
            flex items-center justify-center
            shadow-lg
          "
          style={{
            background: "linear-gradient(135deg, #005f78, #003d4d)",
          }}
        >
          <ShoppingCart size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};
