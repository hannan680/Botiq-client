import { useMutation } from "@tanstack/react-query";

// // Define types for the function parameters
// type ClaudeRequestParams = {
//   message: string;
//   previousMessages: string[];
//   onChunk: (chunk: string) => void;
// };

// // Define the type for the API response
// type ClaudeResponse = {
//   role: "assistant";
//   content: { type: "text"; text: string }[];
// };

// // Function to make the API request to Claude and handle streaming
// const claudeRequest = async (
//   message: string,
//   previousMessages: string[],
//   onChunk: (chunk: string) => void
// ): Promise<ClaudeResponse> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/aiChat/claude`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ messages: [...previousMessages, message] }),
//     }
//   );

//   if (!response.ok) {
//     console.error("Response not OK:", response.status, response.statusText);
//     throw new Error("Error with Claude request");
//   }

//   const reader = response.body?.getReader();
//   const decoder = new TextDecoder();
//   let buffer = "";
//   let accumulatedResponse = "";

//   if (!reader) {
//     throw new Error("No response body to read from.");
//   }

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     buffer += decoder.decode(value, { stream: true });
//     const lines = buffer.split("\n\n");
//     buffer = lines.pop() || ""; // Keep the last incomplete chunk in the buffer

//     for (const line of lines) {
//       if (line.startsWith("data: ")) {
//         try {
//           const data = JSON.parse(line.slice(6));
//           if (data.type === "content") {
//             accumulatedResponse += data.text;
//             onChunk(data.text);
//           } else if (data.type === "error") {
//             throw new Error(data.message);
//           } else if (data.type === "done") {
//             // Handle completion if needed
//           }
//         } catch (error) {
//           console.error("Error parsing JSON:", error);
//         }
//       }
//     }
//   }

//   // Process any remaining data in the buffer
//   if (buffer.startsWith("data: ")) {
//     try {
//       const data = JSON.parse(buffer.slice(6));
//       if (data.type === "content") {
//         accumulatedResponse += data.text;
//         onChunk(data.text);
//       }
//     } catch (error) {
//       console.error("Error parsing final JSON:", error);
//     }
//   }

//   return {
//     role: "assistant",
//     content: [{ type: "text", text: accumulatedResponse }],
//   };
// };

// // Hook for Claude request with streaming
// export const useClaudeRequest = () => {
//   return useMutation({
//     mutationKey: ["claudeRequest"],
//     mutationFn: ({ message, previousMessages, onChunk }: ClaudeRequestParams) =>
//       claudeRequest(message, previousMessages, onChunk),
//   });
// };


type ClaudeRequestParams = {
  message: unknown;
  previousMessages: unknown[];
  onChunk: (chunk: string) => void;
  apiKey: string;
};

type ClaudeResponse = {
  role: "assistant";
  content: { type: "text"; text: string }[];
};

const claudeRequest = async (
  message: unknown,
  previousMessages: unknown[],
  onChunk: (chunk: string) => void,
  apiKey: string
): Promise<ClaudeResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/aiChat/claude`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        messages: [...previousMessages, message],
        apiKey 
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error with Claude request");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulatedResponse = "";

  if (!reader) {
    throw new Error("No response body to read from.");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "content") {
            accumulatedResponse += data.text;
            onChunk(data.text);
          } else if (data.type === "error") {
            throw new Error(data.message || "Error in stream");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }

  if (buffer.startsWith("data: ")) {
    try {
      const data = JSON.parse(buffer.slice(6));
      if (data.type === "content") {
        accumulatedResponse += data.text;
        onChunk(data.text);
      }
    } catch (error) {
      console.error("Error parsing final JSON:", error);
    }
  }

  return {
    role: "assistant",
    content: [{ type: "text", text: accumulatedResponse }],
  };
};

export const useClaudeRequest = () => {
  return useMutation({
    mutationKey: ["claudeRequest"],
    mutationFn: ({ message, previousMessages, onChunk, apiKey }: ClaudeRequestParams) =>
      claudeRequest(message, previousMessages, onChunk, apiKey),
  });
};