import React from "react";
import Image from "next/image";
import { capitalizeFirstLastName } from "@/utils/helpers";

export const CardUser = ({
  name,
  telephone,
  groupFamily,
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
        className="inline-block size-14 rounded-full ring-2 ring-[#104e64]"
      />

      <div className="flex flex-col gap-1">
        <p className="text-light-800 text-md font-semibold">
          {capitalizeFirstLastName(name)}
        </p>

        <div>
          <p className="text-light-800 text-sm">{telephone}</p>
          <p className="text-light-800 text-[12px]">{groupFamily}</p>
        </div>
      </div>
    </div>
  );
};
