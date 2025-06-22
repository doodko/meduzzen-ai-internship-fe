import React from "react";
import IconButton from "./IconButton"; // adjust path as needed

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disableUpload?: boolean;
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  disableUpload = false,
}: ChatInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      console.log("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="px-4 py-3 bg-[#40414f] border-t border-[#2c2d36]">
      <form
        className="flex items-center space-x-2"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full pr-10 rounded-lg bg-[#202123] text-white px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={disableUpload}
              title="Attach file"
            >
              {/* Inline your SVG icon here */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 7.90909V16C6 19.3137 8.68629 22 12 22V22C15.3137 22 18 19.3137 18 16V6C18 3.79086 16.2091 2 14 2V2C11.7909 2 10 3.79086 10 6V15.1818C10 16.2864 10.8954 17.1818 12 17.1818V17.1818C13.1046 17.1818 14 16.2864 14 15.1818V8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
