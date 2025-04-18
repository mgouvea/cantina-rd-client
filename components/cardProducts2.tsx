"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";

interface ProdutoProps {
  imageBase64: string;
  name: string;
  tag?: string;
  price: number;
}

export const CardProducts2 = ({ imageBase64, name, price }: ProdutoProps) => {
  const [quantity, setQuantity] = useState(1);

  const handlePlus = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleMinus = () => {
    if (quantity === 1) {
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  return (
    <div className="flex w-full bg-white border border-gray-200 rounded-lg justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <Image src={imageBase64} alt={name} width={94} height={94} />

        <div className="flex flex-col gap-1">
          <p className="text-[#574f4d] text-xl font-bold">{name}</p>
          <p className="text-[#574f4d] text-xl">{`R$ ${price.toFixed(2)}`}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 px-9 py-2 rounded-lg">
        <button className="cursor-pointer" onClick={handleMinus}>
          <CircleMinus size={33} color="#2b7fff" />
        </button>
        <span className="text-[#574f4d] font-bold text-2xl">{quantity}</span>
        <button className="cursor-pointer" onClick={handlePlus}>
          <CirclePlus size={33} color="#2b7fff" />
        </button>
      </div>
    </div>
  );
};
