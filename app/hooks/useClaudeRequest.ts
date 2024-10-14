import { useMutation } from "@tanstack/react-query";



type ClaudeRequestParams = {
  message: unknown;
  previousMessages: unknown[];
  onChunk: (chunk: string) => void;
  apiKey: string;
  ssoKey:string;
};

type ClaudeResponse = {
  role: "assistant";
  content: { type: "text"; text: string }[];
};

const claudeRequest = async (
  message: unknown,
  previousMessages: unknown[],
  onChunk: (chunk: string) => void,
  apiKey: string,
  ssoKey:string
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
        apiKey ,
        ssoKey
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
    mutationFn: ({ message, previousMessages, onChunk, apiKey,ssoKey }: ClaudeRequestParams) =>
      claudeRequest(message, previousMessages, onChunk, apiKey,ssoKey),
  });
};