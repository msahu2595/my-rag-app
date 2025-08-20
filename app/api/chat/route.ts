import {NextRequest, NextResponse} from "next/server";
import {OpenAIEmbeddings} from "@langchain/openai";
import {QdrantVectorStore} from "@langchain/qdrant";
import OpenAI from "openai";

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function POST(req: NextRequest) {
  try {
    const {query} = await req.json();

    if (!query) {
      return NextResponse.json({error: "No query provided"}, {status: 400});
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
      collectionName: "rag-collection",
    });

    const retriever = vectorStore.asRetriever({k: 3});
    const relevantChunk = await retriever.invoke(query);

    const SYSTEM_PROMPT = `
      You are an AI assistant who helps resolving user query based on the
      context available to you from a PDF file or Given text input with the content and page number.

      Only ans based on the available context from file only.

      Context:
      ${JSON.stringify(relevantChunk)}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {role: "system", content: SYSTEM_PROMPT},
        {role: "user", content: query},
      ],
    });

    const answer = response.choices[0].message?.content || "No response";

    return NextResponse.json({answer, context: relevantChunk});
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({error: "Chat failed"}, {status: 500});
  }
}
