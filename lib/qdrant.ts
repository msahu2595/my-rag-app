import {QdrantVectorStore} from "@langchain/qdrant";
import {embeddings} from "./openai";

if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error("Missing QDRANT_URL or QDRANT_API_KEY in environment variables");
}

const COLLECTION_NAME = "rag-collection";

// ✅ Create or connect to a Qdrant collection
export async function getVectorStore() {
    return await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL!,
        apiKey: process.env.QDRANT_API_KEY!,
        collectionName: COLLECTION_NAME,
    });
}

// ✅ Helper to index new documents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function indexDocuments(docs: any[]) {
    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: process.env.QDRANT_URL!,
        apiKey: process.env.QDRANT_API_KEY!,
        collectionName: COLLECTION_NAME,
    });
}
