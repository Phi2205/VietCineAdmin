import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      {/* Current page information */}
      <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100">
        <span className="text-sm text-gray-700">
          Page <span className="font-bold text-purple-600 text-base">{currentPage}</span> 
          <span className="text-gray-400 mx-1">of</span> 
          <span className="font-semibold text-gray-800">{totalPages}</span>
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200 hover:border-purple-200 disabled:hover:from-gray-50 disabled:hover:to-gray-100 disabled:hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="font-medium">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm
                ${
                  number === currentPage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-105 border-2 border-purple-400'
                    : 'bg-gradient-to-r from-white to-gray-50 text-gray-700 border border-gray-200 hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 hover:border-purple-200 hover:shadow-md'
                }`}
            >
              {number}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200 hover:border-purple-200 disabled:hover:from-gray-50 disabled:hover:to-gray-100 disabled:hover:text-gray-700"
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Pagination;