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
    <div className="bg-white rounded-2xl max-w-[170px] sm:max-w-[210px] md:max-w-[236px] flex flex-col items-center px-1.5 sm:px-2 pb-2 sm:pb-3 pt-0 text-center shadow-lg transition-all">
      <div className="-mt-6">
        <Image
          src={urlImage}
          alt={name}
          width={64}
          height={64}
          className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full object-cover mx-auto"
        />
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-1 sm:mt-2 antialiased truncate w-full px-1">
        {name}
      </h3>

      <div className="flex flex-col items-center justify-between gap-1 sm:gap-2 mt-2 sm:mt-3 w-full">
        <p className="text-xs sm:text-sm text-[#574f4d] antialiased">
          <span className="text-xs sm:text-sm font-bold">R$</span>{" "}
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold antialiased">
            {price.toFixed(2)}
          </span>
        </p>

        <div className="flex flex-nowrap justify-between items-center gap-2 sm:gap-4 bg-gray-200 px-1 sm:px-3 py-1.5 sm:py-2 rounded-lg overflow-hidden mx-auto w-fit min-w-[120px] sm:min-w-[170px] mx-2 sm:mx-3">
          <button
            className="cursor-pointer flex-shrink-0"
            onClick={handleMinus}
          >
            <CircleMinus size={28} className="sm:size-[40px]" color="#C11A00" />
          </button>
          <span
            className={`text-[#574f4d] antialiased font-bold text-center min-w-[40px] sm:min-w-[70px] text-2xl sm:text-3xl px-1.5 sm:px-2 py-1 sm:py-2 ${
              quantity > 0 && "bg-white rounded-lg"
            }`}
          >
            {quantity}
          </span>
          <button className="cursor-pointer flex-shrink-0" onClick={handlePlus}>
            <CirclePlus size={28} className="sm:size-[40px]" color="#005f78" />
          </button>
        </div>
      </div>
    </div>
  );
};
