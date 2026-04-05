import Groq from "groq-sdk";

export const AGENT_TOOLS: Groq.Chat.ChatCompletionTool[] = [
      {
            type: "function",
            function: {
                  name: "search_documents",
                  description:
                        "Semantic search over the user's uploaded files. Use for any document question.",
                  parameters: {
                        type: "object",
                        properties: {
                              query: { type: "string", description: "Search query" },
                        },
                        required: ["query"],
                  },
            },
      },
      {
            type: "function",
            function: {
                  name: "get_all_documents",
                  description:
                        "Fetch ALL uploaded document chunks in order. Use for diagrams or full-file summaries.",
                  parameters: { type: "object", properties: {}, required: [] },
            },
      },
      {
            type: "function",
            function: {
                  name: "send_email",
                  description: "Send an email on behalf of the user.",
                  parameters: {
                        type: "object",
                        properties: {
                              to: { type: "string" },
                              subject: { type: "string" },
                              body: { type: "string" },
                        },
                        required: ["to", "subject", "body"],
                  },
            },
      },
      {
            type: "function",
            function: {
                  name: "read_gmail",
                  description: "Fetch the user's recent Gmail inbox.",
                  parameters: { type: "object", properties: {}, required: [] },
            },
      },
];
