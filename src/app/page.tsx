'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Image {
  _id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage.url}
              alt={selectedImage.title}
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white">
              <h2 className="text-xl font-bold">{selectedImage.title}</h2>
              <p className="text-sm opacity-75">
                Category: {selectedImage.category}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedImage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
