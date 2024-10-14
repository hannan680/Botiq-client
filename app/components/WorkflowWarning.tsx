import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface WorkflowWarningProps {
  showWarning: boolean;
  missingWorkflows: string[];
  draftWorkflows: string[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function WorkflowWarning({
  showWarning,
  missingWorkflows,
  draftWorkflows,
  showModal,
  setShowModal
}: WorkflowWarningProps) {
  return (
    <>
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-3 shadow-sm z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium text-yellow-700">Some AI workflows are currently missing from your system!</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://example.com/workflow-download', '_blank')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Download Workflows
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-yellow-700 hover:text-yellow-800 text-sm"
              >
                View More
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Workflow Setup Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {missingWorkflows.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="font-medium text-red-700">Missing Workflows:</p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-red-700">
                    {missingWorkflows.map((workflow, index) => (
                      <li key={index} className="text-sm">{workflow}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {draftWorkflows.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="font-medium text-yellow-700">Draft Workflows (Need Publishing):</p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-yellow-700">
                    {draftWorkflows.map((workflow, index) => (
                      <li key={index} className="text-sm">{workflow}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}