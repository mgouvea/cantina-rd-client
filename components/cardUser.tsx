import Image from "next/image";
import { capitalizeFirstLastName, PhoneMask } from "@/utils/helpers";
import { User } from "@/types";
import { Phone, ChevronRight } from "lucide-react";

export const CardUser = ({
  name,
  telephone,
  urlImage,
  onUserSelect,
}: User & { onUserSelect?: () => void }) => {
  return (
    <div
      onClick={onUserSelect}
      className="
        flex 
        items-center 
        w-full
        py-4 
        px-4 
        gap-4 
        rounded-2xl 
        shadow-sm 
        bg-white
        border 
        border-gray-200
        active:scale-[0.98]
        active:shadow-inner
        transition-all 
        duration-150
        touch-manipulation
      "
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Avatar */}
      <Image
        src={urlImage || "/avatar.png"}
        alt={name}
        width={64}
        height={64}
        className="
          size-16 
          rounded-full 
          object-cover
          ring-2 
          ring-[#005f78]
          shrink-0
        "
      />

      {/* Info */}
      <div className="flex flex-col flex-1">
        <p className="text-gray-900 text-xl font-semibold">{capitalizeFirstLastName(name)}</p>

        {telephone && (
          <div className="flex items-center gap-2 text-gray-600 mt-0.5">
            <Phone className="w-4 h-4 text-[#005f78]" />
            <span className="text-base">{PhoneMask(telephone)}</span>
          </div>
        )}
      </div>

      {/* Seta de navegação */}
      <div
        className="
          w-10 
          h-10 
          rounded-full
          bg-gray-100
          flex 
          items-center 
          justify-center
          shrink-0
        "
      >
        <ChevronRight className="w-6 h-6 text-gray-300" />
      </div>
    </div>
  );
};
