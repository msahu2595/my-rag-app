import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;
    const text: string | null = formData.get("text") as string;

    if (!file && !text) {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 });
    }

    let docs: any[] = [];

    if (file) {
      const filePath = path.join(process.cwd(), "public", file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      if (file.name.endsWith(".pdf")) {
        const loader = new PDFLoader(filePath);
        docs = await loader.load();
      } else {
        docs = [{ pageContent: buffer.toString(), metadata: { source: file.name } }];
      }
    }

    if (text) {
      docs.push({ pageContent: text, metadata: { source: "user-input" } });
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
      collectionName: "rag-collection",
    });

    return NextResponse.json({ success: true, message: "Indexing done" });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
