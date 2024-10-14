import React from 'react';

interface CategoryProps {
  id: string;
  name: string;
  isSelected: boolean; // Add isSelected prop
  onClick: (id: string) => void; // Function to handle category click
}

const CategoryBadge: React.FC<CategoryProps> = ({ id, name, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={`cursor-pointer px-6 py-4 mx-2 -skew-x-12 ${
        isSelected ? 'bg-[#202938] text-white' : 'bg-app-gradient-x text-white shadow-lg'
      } transition-all duration-300 ease-in-out`}
    >
      <span className="skew-x-12 inline-block">
        {name}
      </span>
    </div>
  );
};

export default CategoryBadge;
