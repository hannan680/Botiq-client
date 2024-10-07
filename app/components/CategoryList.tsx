// components/CategoryList.tsx
import React from 'react';
import { useGetCategories } from '../hooks/useGetCategory';
import CategoryBadge from './CategoryBadge';

const CategoryList: React.FC<{selectedCategory :string,  onSelect: (id: string) => void }> = ({selectedCategory, onSelect }) => {
  const { data, error, isLoading } = useGetCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div className="flex justify-center overflow-x-auto my-4 scrollbar-hide">
      {/* Add default "All" category */}
      <CategoryBadge 
        id="all" // Unique ID for the "All" category
        name="All" 
        isSelected={selectedCategory == "all"}
        onClick={onSelect} 
      />
      {data!.data.length > 0 && (
        data?.data.map((category) => (
          <CategoryBadge 
            key={category._id} 
            id={category._id} 
            name={category.name} 
            isSelected={selectedCategory === category._id}
            onClick={onSelect} // Pass the onClick handler
          />
        ))
      ) }
    </div>
  );
};

export default CategoryList;
