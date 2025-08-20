import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

// ✅ OpenAI client (for chat, completions, etc.)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ OpenAI Embeddings client (for vector storage)
export const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});
