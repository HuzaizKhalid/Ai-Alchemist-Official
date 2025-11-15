"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Leaf } from "lucide-react";
import Image from "next/image";

interface AnimalData {
  name: string;
  scientificName: string;
  population: string;
  status: string;
  image: string;
  threats: string[];
  source?: string; // 'NatureServe' or undefined (fallback data)
}

export function EndangeredAnimals() {
  const [animal, setAnimal] = useState<AnimalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRandomAnimal();

    // Optional: Auto-refresh every 60 seconds
    // Uncomment the lines below to enable auto-refresh
    // const interval = setInterval(fetchRandomAnimal, 60000);
    // return () => clearInterval(interval);
  }, []);

  const fetchRandomAnimal = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("/api/endangered-animals");

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setAnimal(data);
    } catch (err) {
      console.error("Error fetching animal:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
        <CardHeader className="flex-row items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
          </div>
          <CardTitle className="text-lg lg:text-xl font-semibold text-white">
            Climate-Affected Species
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-pulse">
            <div className="w-full h-48 bg-slate-700/50 rounded-lg mb-4"></div>
            <div className="h-4 bg-slate-700/50 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !animal) {
    return (
      <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
        <CardHeader className="flex-row items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
          </div>
          <CardTitle className="text-lg lg:text-xl font-semibold text-white">
            Climate-Affected Species
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-white/60 text-sm">
            Unable to load species data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border border-slate-700 shadow-xl hover:border-red-500/50 transition-all duration-300">
      <CardHeader className="flex-row items-center space-x-3 pb-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
        </div>
        <CardTitle className="text-lg lg:text-xl font-semibold text-white">
          Climate-Affected Species
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Animal Image */}
        <div className="relative w-full h-48 lg:h-56 rounded-lg overflow-hidden bg-slate-900/50">
          <Image
            src={animal.image}
            alt={animal.name}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Fallback to a reliable Unsplash image based on animal type
              const fallbackImages: { [key: string]: string } = {
                'polar': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80',
                'bear': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80',
                'turtle': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                'penguin': 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&q=80',
                'fox': 'https://images.unsplash.com/photo-1600438459225-eb0ae5a0e8f2?w=800&q=80',
                'whale': 'https://images.unsplash.com/photo-1564757981863-ed3c4e255d5d?w=800&q=80',
                'koala': 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&q=80',
                'leopard': 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80',
                'butterfly': 'https://images.unsplash.com/photo-1568526381923-caf3fd520382?w=800&q=80',
                'orangutan': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&q=80',
                'pika': 'https://images.unsplash.com/photo-1625792550834-a3ce502f0e19?w=800&q=80',
                'caribou': 'https://images.unsplash.com/photo-1551892374-ecf8dd77f061?w=800&q=80',
                'lynx': 'https://images.unsplash.com/photo-1612588558678-0f41d6e1a8b2?w=800&q=80',
              };
              
              // Find matching fallback or use default wildlife image
              const animalKey = Object.keys(fallbackImages).find(key => 
                animal.name.toLowerCase().includes(key)
              );
              
              target.src = animalKey 
                ? fallbackImages[animalKey]
                : 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80';
            }}
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold uppercase tracking-wide">
              {animal.status}
            </span>
          </div>
          {/* Data Source Indicator */}
          {animal.source === "NatureServe" && (
            <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-white text-[10px] font-semibold uppercase tracking-wide">
                Live Data
              </span>
            </div>
          )}
        </div>

        {/* Animal Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{animal.name}</h3>
            <p className="text-sm text-white/60 italic">
              {animal.scientificName}
            </p>
          </div>

          {/* Population */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">
              Estimated Population
            </p>
            <p className="text-lg font-semibold text-white">
              {animal.population}
            </p>
          </div>

          {/* Threats */}
          {animal.threats && animal.threats.length > 0 && (
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
              <p className="text-xs text-red-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Leaf className="w-3 h-3" />
                Climate-Related Threats
              </p>
              <ul className="space-y-1">
                {animal.threats.map((threat, index) => (
                  <li
                    key={index}
                    className="text-xs text-white/70 flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={fetchRandomAnimal}
            className="w-full py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Show Another Species
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
