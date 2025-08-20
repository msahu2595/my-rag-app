"use client";
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import Chat from "@/components/Chat";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white flex p-6 gap-4">
      {/* Left Section */}
      <section className="w-1/2 bg-zinc-900 p-4 rounded-2xl shadow flex flex-col">
        <h2 className="text-lg font-bold mb-2">Text Input Section</h2>
        <FileUploader onSubmit={() => setSubmitted(true)} />
      </section>

      {/* Right Section */}
      <section className="w-1/2 bg-zinc-900 p-4 rounded-2xl shadow flex flex-col">
        <h2 className="text-lg font-bold mb-2">Chat Section</h2>
        <Chat />
      </section>
    </main>
  );
}
