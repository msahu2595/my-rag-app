"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function FileUploader({ onSubmit }: { onSubmit: () => void }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!text && !file) {
      toast.error("Please provide text or select a file.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text) formData.append("text", text);

      await axios.post("/api/upload", formData);

      toast.success("Upload successful!");
      setText("");
      setFile(null);
      onSubmit();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col h-full">
  <textarea
    placeholder="Paste/Write Text here..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    disabled={loading}
    className="flex-grow bg-black border border-zinc-700 p-2 rounded mb-2 disabled:opacity-50"
  />

  {/* File Selector */}
  <div className="mb-2">
    <input
      id="file-upload"
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      disabled={loading}
      className="hidden"
    />
    <label
      htmlFor="file-upload"
      className={`cursor-pointer px-4 py-2 rounded-2xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-center block disabled:opacity-50 ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {file ? file.name : "Choose File"}
    </label>
  </div>

  <button
    onClick={handleUpload}
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-2xl disabled:opacity-50"
  >
    {loading ? "Uploading..." : "Submit"}
  </button>
</div>

  );
}
