import Image from 'next/image';
import React from 'react';

interface AiEmployeeCardProps {
  aiName: string;
  industryName: string;
  role: string;
  lastUpdated: string;
  image?: string;
}

const AiEmployeeCard: React.FC<AiEmployeeCardProps> = ({
  aiName,
  industryName,
  role,
  lastUpdated,
  image,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden">
      <div className="text-center text-xl font-semibold text-blue-500 mb-2">
      {industryName}
      </div>
      
      <div className="rounded-lg bg-gray-200 h-[450px] mb-4 flex items-center justify-center">
        <div className="text-gray-500"><img className='w-full h-full object-cover'  alt='' src={image} /></div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-2">
        Last Updated: {lastUpdated}
      </div>

      <div className="flex justify-center gap-10 items-center">
        <button className="border border-[#333333] text-[#333333] uppercase text-sm font-semibold py-3 px-6 rounded-full">
         {role}
        </button>
        <button className="bg-[#333333] text-white text-sm font-semibold py-3 px-6 rounded-full">
        {aiName}        </button>
      </div>
    </div>
  );
  return (
    <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-sky-300 p-4 text-white font-semibold">
        {industryName}
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <img 
            src={image || "/api/placeholder/128/128"} 
            alt={aiName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{aiName}</h3>
        <p className="text-sm text-gray-500 mb-4">Last Updated: {lastUpdated}</p>
      </div>
      <div className="bg-gray-100 p-2 flex justify-between items-center">
        <span className="text-sm font-medium">{role}</span>
        <span className="text-sm font-semibold bg-black text-white px-2 py-1 rounded">
          AI Name
        </span>
      </div>
    </div>
  );
};

export default AiEmployeeCard;