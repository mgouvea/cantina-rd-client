import React from "react";
import Image from "next/image";
import { capitalizeFirstLastName, PhoneMask } from "@/utils/helpers";
import { User } from "@/types";

export const CardUser = ({
  name,
  telephone,
  imageBase64,
  onUserSelect,
}: User & { onUserSelect?: () => void }) => {
  return (
    <div
      className="flex items-center min-h-24 w-auto py-3 px-3 gap-5 border border-primary-100 bg-white rounded-2xl cursor-pointer shadow-sm"
      onClick={onUserSelect}
    >
      <Image
        src={imageBase64}
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
        </div>
      </div>
    </div>
  );
};
