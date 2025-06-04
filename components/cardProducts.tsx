import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useCartStore } from "@/contexts/cart-store";

interface CardProductsProps {
  name: string;
  price: number;
  urlImage: string;
  _id: string;
  tag?: string;
}

export const CardProducts = ({
  _id,
  name,
  price,
  urlImage,
}: CardProductsProps) => {
  const { items, addItem, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState(0);

  // Update quantity when component mounts or when cart items change
  useEffect(() => {
    const cartItem = items.find((item) => item.id === _id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [_id, items]);

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
    <div className="bg-white rounded-2xl max-w-[226px] flex flex-col items-center px-2 pb-3 pt-0 text-center shadow-lg">
      <div className="-mt-6">
        <Image
          src={urlImage}
          alt={name}
          width={84}
          height={84}
          className="h-28 w-auto rounded-full object-cover"
        />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mt-2 antialiased">
        {name}
      </h3>

      <div className="flex flex-col items-center justify-between gap-2 mt-3 w-full">
        <p className="text-sm text-[#574f4d] antialiased">
          <span className="text-sm font-bold">R$</span>{" "}
          <span className="text-3xl font-extrabold antialiased">
            {price.toFixed(2)}
          </span>
        </p>

        <div className="flex w-full justify-between items-center gap-4 bg-gray-200 px-4 py-2 rounded-lg">
          <button className="cursor-pointer" onClick={handleMinus}>
            <CircleMinus size={40} color="#C11A00" />
          </button>
          <span
            className={`text-[#574f4d] antialiased font-bold text-center min-w-[70px] text-3xl px-2 py-2 ${
              quantity > 0 && "bg-white rounded-lg"
            }`}
          >
            {quantity}
          </span>
          <button className="cursor-pointer" onClick={handlePlus}>
            <CirclePlus size={40} color="#005f78" />
          </button>
        </div>
      </div>
    </div>
  );
};
