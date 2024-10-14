

import React, { useState, useEffect } from 'react';
import AiEmployeeCard from './AiEmployeeCard';
import { usePublishedAiEmployees } from '../hooks/useAiEmployee';
import { useAiEmployeesByCategory } from '../hooks/useAiEmployee'; // Import your new hook
import AiEmployeeModal from "./AiEmployeeModal";
import { AiEmployee } from '../interfaces/aiEmployeeInterface';
import { useAiEmployeesContext } from '../providers/aiEmployeesProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CategoryList from './CategoryList';

const AiEmployeeGrid: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Default to 'all'
  const limit = 2; 
  const { data, isLoading, error, isFetching } = 
    selectedCategory === 'all' 
      ? usePublishedAiEmployees(page, limit) 
      : useAiEmployeesByCategory(selectedCategory, page, limit); // Use your category hook

  const [isShowAiEmployeeModal, setIsShowAiEmployeeModal] = useState<boolean>(false);
  const { selectedAiEmployee, setSelectedAiEmployee } = useAiEmployeesContext();

  if (isLoading) { 
    return <div className="text-center py-4 h-[400px] flex items-center justify-center">   
      <DotLottieReact
        src="/lottie/loader.lottie"
        loop
        autoplay
      />
    </div>;
  }
  if (error) return <div className="text-center py-4 text-red-500">Error: {error.message}</div>;

  const handleAiEmployeeClick = (employee: AiEmployee) => {
    setIsShowAiEmployeeModal(true);
    setSelectedAiEmployee(employee);
  }

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (data && data.data.length === limit) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="py-9">
        <CategoryList 
          selectedCategory={selectedCategory}
          onSelect={(id) => {
            setSelectedCategory(id); // Set the selected category
            setPage(1); // Reset to the first page when category changes
          }} 
        />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((employee: AiEmployee) => (
            <div key={employee._id} onClick={() => handleAiEmployeeClick(employee)} className='cursor-pointer'>
              <AiEmployeeCard
                aiName={employee.aiName}
                industryName={employee.industryName}
                role={employee.role}
                lastUpdated={new Date(employee.updatedAt).toLocaleDateString()}
                image={`${employee.image}`}
              />
            </div>
          ))}
        </div>
        {/* <div className="flex justify-center gap-8 items-center mt-6 py-8">
  <button
    onClick={handlePrevPage}
    disabled={page === 1}
    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
  >
    Previous
  </button>
  <span className="text-gray-600 text-sm font-medium">Page {page}</span>
  <button
    onClick={handleNextPage}
    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
    disabled={data?.data.length! < limit}
  >
    Next
  </button>
</div> */}

        {isFetching && <div className="text-center py-4">Fetching more data...</div>}
        <AiEmployeeModal
          show={isShowAiEmployeeModal}
          onClose={() => {
            setIsShowAiEmployeeModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default AiEmployeeGrid;
