import { Image } from "../ui/image";

type Props = {
  onCTAClick: () => void;
};

/* eslint-disable max-len */
export function Hero({ onCTAClick }: Props) {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          path="hero-compressed.png?updatedAt=1720111569535"
          alt="Cocktail background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative container h-[50rem] mx-auto px-6 py-20 md:py-32 flex flex-col justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Shake Up Your Night with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover unique cocktails tailored just for you by our smart
            mixologist
          </p>
          <button onClick={onCTAClick} className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Mix Your Magic
          </button>
        </div>
      </div>
    </div>
  );
}
