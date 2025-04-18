"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/contexts/cart-store";

export const CartButton = ({ onCartClick }: { onCartClick: () => void }) => {
  const productCount = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  return (
    <div className="relative cursor-pointer" onClick={onCartClick}>
      <div className="flex items-center justify-end gap-2">
        <ShoppingCart size={30} className="text-gray-500" />
      </div>
      {productCount > 0 && (
        <span className="text-md font-medium text-light-800">
          R$ {totalPrice.toFixed(2)}
        </span>
      )}

      {productCount > 0 && (
        <div className="absolute -top-4 -right-4 rounded-full h-6 w-6 flex-center text-md font-medium text-white bg-red-500">
          {productCount}
        </div>
      )}
    </div>
  );
};
