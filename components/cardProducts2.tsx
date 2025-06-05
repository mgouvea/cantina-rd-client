import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CardProductsProps } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/contexts/cart-store";

export const CardProducts2 = ({
  _id,
  name,
  description,
  price,
  urlImage,
}: CardProductsProps) => {
  const { items, addItem, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const cartItem = items.find((item) => item.id === _id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [_id, items]);

  const handlePlus = () => {
    setQuantity((prev) => prev + 1);
    addItem({ id: _id, name, price });
  };

  const handleMinus = () => {
    if (quantity === 0) return;
    setQuantity((prev) => prev - 1);
    removeItem(_id);
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-md w-[423px] h-[190px] px-3 py-3 items-center mb-2">
      <div className="flex flex-col justify-between items-center w-[130px] h-full">
        <Image
          src={urlImage}
          alt={name}
          width={128}
          height={128}
          className="object-contain mb-2"
        />
        <span className="text-2xl font-bold text-gray-800 antialiased mb-2">
          R$ {price.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="flex-1 flex h-full w-[2/3] flex-col justify-between pl-3">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 antialiased truncate">
            {name}
          </h3>
          <p className="text-gray-500 text-base mt-1 antialiased">
            {description}
          </p>
        </div>
        <div className="flex justify-between items-center h-12 mt-4 bg-white border border-gray-200 rounded-lg">
          <button
            className="flex items-center gap-1 px-1 h-full border border-gray-200 rounded-lg justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleMinus}
            disabled={quantity === 0}
            title="Remover"
          >
            <Minus size={24} color={quantity === 0 ? "#d1d5db" : "#d10c0c"} />
            <span
              className={`text-xs font-medium ${
                quantity === 0 ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Remover
            </span>
          </button>

          <span className="mx-4 text-2xl font-bold text-gray-800 w-10 text-center select-none">
            {quantity}
          </span>

          <button
            className="flex items-center gap-1 px-1 h-full border border-gray-200 rounded-lg justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handlePlus}
            title="Adicionar"
          >
            <Plus size={24} color="#0077b6" />
            <span className="text-xs font-medium text-gray-600">Adicionar</span>
          </button>
        </div>

        {/* <div className="flex justify-between items-center h-12 mt-4 bg-white border border-gray-200 rounded-lg">
          <button
            className="px-1 border border-gray-200 rounded-lg h-full w-12 flex items-center justify-center"
            onClick={handleMinus}
            disabled={quantity === 0}
          >
            <Minus size={32} color={quantity === 0 ? "#d1d5db" : "#d10c0c"} />
          </button>
          <span className="mx-4 text-2xl font-bold text-gray-800 w-12 text-center select-none">
            {quantity}
          </span>
          <button
            className="px-1 border border-gray-200 rounded-lg h-full w-12 flex items-center justify-center"
            onClick={handlePlus}
          >
            <Plus size={32} color="#0077b6" />
          </button>
        </div> */}
      </div>
    </div>
  );
};
