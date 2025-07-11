import React from "react";
import Image from "next/image";
import { capitalizeFirstLastName, PhoneMask } from "@/utils/helpers";
import { Visitor } from "@/types";

export const CardVisitors = ({
  name,
  telephone,
  churchCore,
  onUserSelect,
}: Visitor & { onUserSelect?: () => void }) => {
  return (
    <div
      className="flex items-center min-h-24 w-auto py-3 px-3 gap-5 border border-primary-100 bg-white rounded-2xl cursor-pointer shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
      onClick={onUserSelect}
    >
      <Image
        src={"/avatar.png"}
        alt={name}
        width={50}
        height={50}
        className="inline-block size-16 object-cover rounded-full ring-2 ring-[#104e64]"
      />

      <div className="flex flex-col gap-1">
        <p className="text-light-800 text-lg font-semibold">
          {capitalizeFirstLastName(name)}
        </p>

        <div>
          <p className="text-light-800 text-md">{PhoneMask(telephone)}</p>
          <p className="text-light-800 text-md">{churchCore}</p>
        </div>
      </div>
    </div>
  );
};
