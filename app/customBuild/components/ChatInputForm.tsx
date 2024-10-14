// import React from 'react';

// interface ChatInputFormProps {
//   inputValue: string;
//   handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
//   streamingMessage: string | null;
// }

// const ChatInputForm: React.FC<ChatInputFormProps> = ({
//   inputValue,
//   handleInputChange,
//   handleSubmit,
//   streamingMessage
// }) => {
//   return (
//     <form
//       className="flex w-full items-center"
//       onSubmit={handleSubmit}
//     >
//       <div className="relative w-full">
//         <input
//           type="text"
//           placeholder="Type your messages here..."
//           className="w-full py-3 pl-4 pr-12 bg-[#F5F5F5] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
//           value={inputValue}
//           onChange={handleInputChange}
//           disabled={!!streamingMessage}
//         />
//         <button
//           type="submit"
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors duration-300"
//           disabled={!!streamingMessage}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="w-6 h-6"
//           >
//             <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
//           </svg>
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ChatInputForm;

import React from 'react';

interface ChatInputFormProps {
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  streamingMessage: string | null;
  isLoading: boolean; // New prop for loading state
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  streamingMessage,
  isLoading
}) => {
  return (
    <form
      className="flex w-full items-center"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Type your messages here..."
          className="w-full py-3 pl-4 pr-12 bg-[#F5F5F5] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          value={inputValue}
          onChange={handleInputChange}
          disabled={!!streamingMessage || isLoading}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors duration-300 ${
            (!!streamingMessage || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!!streamingMessage || isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInputForm;