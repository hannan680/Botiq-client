import Image from "next/image";
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({
  subsets: ['latin'], 
  weight: '400', 
});

interface ModelCardProps {
    name: string;
    icon: string;
    onClick?: () => void;
    comingSoon?: boolean;
  }
  
  const ModelCard: React.FC<ModelCardProps> = ({ name, icon, onClick, comingSoon = false }) => (
    <div
      className={`flex flex-col items-center justify-center px-12 py-4 bg-[#0D1F50] rounded-xl shadow-sm transition-all duration-300 ${
        comingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-1 cursor-pointer'
      } ${russoOne.className}`}
      onClick={comingSoon ? undefined : onClick}
    >
      <div className="relative w-16 h-16 mb-4">
        <Image src={icon} alt={`${name} icon`} layout="fill" objectFit="contain" />
      </div>
      <h2 className="text-lg font-medium text-white mb-1">{name}</h2>
      {comingSoon && (
        <span className="text-xs font-medium text-gray-50">Coming Soon</span>
      )}
    </div>
  );
  

  export default ModelCard;