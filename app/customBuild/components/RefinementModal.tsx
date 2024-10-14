import { useState } from "react";

interface RefinementSidePanelProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

const RefinementSidePanel: React.FC<RefinementSidePanelProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Content */}
      <div className="bg-white p-8 rounded-3xl shadow-lg relative max-w-lg w-full">
        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Refine the Prompt
        </h2>

        {/* Instruction */}
        <p className="text-center text-gray-600 mb-4">
          What didn’t you like about the response?
        </p>

        {/* Feedback Textarea */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide your feedback here..."
          className="w-full h-24 p-4 mb-4 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-800 resize-none"
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefinementSidePanel;
