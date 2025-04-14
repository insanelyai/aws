"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/s3";

export default function TestS3() {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const key = await uploadImage(file, "test");
      setMessage(`Success! Image uploaded with key: ${key}`);
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-2xl font-bold mb-4'>S3 Upload Test</h1>
        <input
          type='file'
          accept='image/*'
          onChange={handleTestUpload}
          className='mb-4'
          disabled={uploading}
        />
        {uploading && <p className='text-blue-600'>Uploading...</p>}
        {message && (
          <p
            className={`mt-4 p-4 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
