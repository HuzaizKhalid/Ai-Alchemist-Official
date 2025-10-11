"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

interface ImageData {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
  photographer: string;
  link: string;
}

interface ImageGalleryProps {
  images: ImageData[];
  query: string;
  isLoading?: boolean;
}

export default function ImageGallery({
  images,
  query,
  isLoading,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  const filteredImages = images.filter((img) => !imageErrors.has(img.id));

  // Only show gallery when we have images and they're not loading
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      setShowGallery(true);
    } else if (isLoading) {
      setShowGallery(false);
    }
  }, [isLoading, images.length]);

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : filteredImages.length - 1
    );
    setSelectedImage(
      filteredImages[
        selectedIndex > 0 ? selectedIndex - 1 : filteredImages.length - 1
      ]
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev < filteredImages.length - 1 ? prev + 1 : 0
    );
    setSelectedImage(
      filteredImages[
        selectedIndex < filteredImages.length - 1 ? selectedIndex + 1 : 0
      ]
    );
  };

  if (isLoading) {
    return (
      <div className="w-full mt-8 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-blue-400" />
            Finding related images...
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-slate-700/50 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Only show gallery if we have images and showGallery is true
  if (!showGallery || filteredImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <ImageIcon className="w-5 h-5 mr-2 text-blue-400" />
        Images related to "{query}"
        <span className="ml-3 text-sm text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full">
          {filteredImages.length} results
        </span>
      </h3>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-video bg-slate-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => {
              setSelectedImage(image);
              setSelectedIndex(index);
            }}
          >
            <Image
              src={image.thumbnail}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => handleImageError(image.id)}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs font-medium truncate drop-shadow-lg">
                {image.alt}
              </p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Sources Attribution */}
      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-4">
        <span>Images provided by {filteredImages[0]?.source}</span>
        <a
          href={
            filteredImages[0]?.source === "Unsplash"
              ? "https://unsplash.com"
              : "https://pixabay.com"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors flex items-center space-x-1"
        >
          <span>View source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full w-full">
            {/* Navigation arrows */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            {filteredImages.length > 1 && (
              <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {filteredImages.length}
              </div>
            )}

            {/* Image */}
            <div className="relative w-full h-96 md:h-[36rem]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <div className="text-white">
                <p className="text-lg font-medium mb-2 max-w-4xl">
                  {selectedImage.alt}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Photo by {selectedImage.photographer}</span>
                  <a
                    href={selectedImage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors bg-black/50 px-3 py-1 rounded-full"
                  >
                    <span>View on {selectedImage.source}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
