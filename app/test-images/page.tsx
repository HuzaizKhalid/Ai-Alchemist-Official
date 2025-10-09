"use client";

import { useState } from 'react';

interface ImageData {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
  photographer: string;
  link: string;
}

export default function TestImages() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testImageSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setImages([]);
    
    try {
      console.log(`Testing image search for: ${query}`);
      const response = await fetch(`/api/search/images?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success && data.images) {
        setImages(data.images);
      } else {
        setError(`API Error: ${data.error || 'No images found'}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Image Search Test</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && testImageSearch()}
          />
          <button
            onClick={testImageSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Images'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            Searching for images...
          </div>
        )}
        
        {images.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Results ({images.length} images):</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.alt}
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image ${index}:`, image);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-300 truncate">{image.alt}</p>
                    <p className="text-xs text-gray-500">{image.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}