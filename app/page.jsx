"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedNumber, setDetectedNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setDetectedNumber(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result?.toString().split(",")[1];
      if (!base64Data) return;

      setLoading(true);
      try {
        const res = await fetch("/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data,
            mediaType: file.type,
          }),
        });

        const data = await res.json();
        setDetectedNumber(data.text || data.error || "No number detected");
      } catch (err) {
        console.error(err);
        setDetectedNumber("Error detecting number");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Reset state for next upload
  const handleNewUpload = () => {
    setSelectedImage(null);
    setDetectedNumber(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 text-center p-6 transition-all">
      <h1 className="text-3xl font-semibold mb-8 text-zinc-800 dark:text-zinc-100 drop-shadow-sm">
        Image Number Detector
      </h1>

      {!selectedImage && (
        <button className="relative overflow-hidden bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 active:scale-95">
          <label className="cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </button>
      )}

      {selectedImage && (
        <div className="relative mt-10 flex flex-col items-center justify-center">
          {/* Image container */}
          <div className="relative w-[320px] h-[320px] flex items-center justify-center rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-xl bg-white/10 backdrop-blur-md">
            <Image
              src={selectedImage}
              alt="Uploaded"
              width={320}
              height={320}
              className="object-contain rounded-lg"
            />

            {/* Scanning Animation */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan"></div>
                <p className="text-white mt-4 font-semibold text-lg animate-pulse">
                  Scanning...
                </p>
              </div>
            )}
          </div>

          {/* Detected Number */}
          {!loading && detectedNumber && (
            <>
              <div className="mt-6 bg-green-500/90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg backdrop-blur-md">
                Detected Number:{" "}
                <span className="text-white font-bold text-xl ml-1">
                  {detectedNumber}
                </span>
              </div>

              {/* Upload new image button */}
              <button
                onClick={handleNewUpload}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition active:scale-95"
              >
                Upload Another Image
              </button>
            </>
          )}
        </div>
      )}

      {/* Hint / Footer */}
      <p className="mt-10 text-sm text-zinc-600 dark:text-zinc-400">
        Upload an image with numbers. AI will detect them for you.
      </p>

      {/* Extra styles for scanning animation */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 1.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
