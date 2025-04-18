import Image from "next/image";
import React, { useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useCartStore } from "@/contexts/cart-store";

interface CardProductsProps {
  name: string;
  price: number;
  imageBase64: string;
  _id: string;
}

export const CardProducts = ({
  _id,
  name,
  price,
  imageBase64,
}: CardProductsProps) => {
  const { addItem, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState(0);

  const handlePlus = () => {
    setQuantity((prev) => prev + 1);
    addItem({ id: _id, name, price });
  };

  const handleMinus = () => {
    if (quantity === 0) {
      return;
    }
    setQuantity((prev) => prev - 1);
    removeItem(_id);
  };

  return (
    <div className="bg-white rounded-2xl max-w-[246px] flex flex-col items-center px-2 pb-3 pt-0 text-center shadow-lg">
      <div className="-mt-6">
        <Image
          src={imageBase64 || "/cafe.svg"}
          alt={name}
          width={84}
          height={84}
          className="h-28 w-auto rounded-full object-cover"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-2 antialiased">
        {name}
      </h3>
      {/* <span className="bg-yellow-500 antialiased text-orange-900 text-xs font-bold px-2 py-1 rounded-full mt-3">
        {tag}
      </span> */}

      <div className="flex items-center justify-between gap-2 mt-3 w-full">
        <p className="text-sm text-[#574f4d] antialiased">
          <span className="text-sm font-bold">R$</span>{" "}
          <span className="text-2xl font-extrabold antialiased">
            {price.toFixed(2)}
          </span>
        </p>

        <div className="flex items-center gap-4 bg-gray-200 px-4 py-2 rounded-lg">
          <button className="cursor-pointer" onClick={handleMinus}>
            <CircleMinus size={30} color="#005f78" />
          </button>
          <span className="text-[#574f4d] antialiased font-bold text-xl">
            {quantity}
          </span>
          <button className="cursor-pointer" onClick={handlePlus}>
            <CirclePlus size={30} color="#005f78" />
          </button>
        </div>
      </div>
    </div>
  );
};
