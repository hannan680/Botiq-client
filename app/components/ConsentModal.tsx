"use client"; 
import React from 'react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  calendarName: string;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose, onConfirm, calendarName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Are you sure you want to select this calendar?</h2>
        <p className="mb-6">{calendarName}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">No</button>
          <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
