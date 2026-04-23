import Image from "next/image";

interface LoadingAnimationProps {
  showImage?: boolean;
  title?: string;
  titleSize?: string;
}

export const LoadingAnimation = ({
  showImage = false,
  title = "Cantina RD",
  titleSize = "text-4xl",
}: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      {showImage && (
        <div className="animate-fade-in">
          <div className="animate-pulse-slow">
            <Image src="/cantinaRD.png" width={200} height={200} alt="Cantina RD Logo" priority />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-3 animate-fade-in-delay">
        <h1 className={`text-light-800 ${titleSize} font-bold`}>{title}</h1>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-1"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-2"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-3"></div>
        </div>
      </div>
    </div>
  );
};
