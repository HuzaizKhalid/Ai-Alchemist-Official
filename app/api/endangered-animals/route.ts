import { NextResponse } from "next/server";

// List of endangered animals affected by climate change/CO2 emissions
// This serves as fallback data when API is not available
const endangeredAnimals = [
  {
    name: "Polar Bear",
    scientificName: "Ursus maritimus",
    population: "22,000 - 31,000",
    status: "Vulnerable",
    image:
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
    threats: [
      "Sea ice loss due to warming temperatures",
      "Reduced hunting grounds and food sources",
      "Habitat fragmentation",
      "Ocean acidification affecting prey",
    ],
  },
  {
    name: "Coral Reefs (Great Barrier Reef)",
    scientificName: "Multiple coral species",
    population: "50% loss since 1995",
    status: "Critically Endangered",
    image:
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80",
    threats: [
      "Ocean warming causing coral bleaching",
      "Ocean acidification from CO2 absorption",
      "Increased storm intensity",
      "Sea level changes",
    ],
  },
  {
    name: "Sea Turtle",
    scientificName: "Chelonioidea",
    population: "6 of 7 species threatened",
    status: "Endangered",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    threats: [
      "Rising sand temperatures affecting sex ratios",
      "Sea level rise destroying nesting beaches",
      "Ocean acidification affecting food sources",
      "Extreme weather events",
    ],
  },
  {
    name: "Emperor Penguin",
    scientificName: "Aptenodytes forsteri",
    population: "~595,000 individuals",
    status: "Near Threatened",
    image:
      "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&q=80",
    threats: [
      "Antarctic ice shelf collapse",
      "Reduced sea ice for breeding",
      "Krill population decline from warming",
      "Changes in ocean currents",
    ],
  },
  {
    name: "Arctic Fox",
    scientificName: "Vulpes lagopus",
    population: "Several hundred thousand",
    status: "Vulnerable (in some regions)",
    image:
      "https://images.unsplash.com/photo-1600438459225-eb0ae5a0e8f2?w=800&q=80",
    threats: [
      "Tundra warming and habitat loss",
      "Competition from red foxes moving north",
      "Reduced lemming populations",
      "Permafrost thawing",
    ],
  },
  {
    name: "Orangutan",
    scientificName: "Pongo spp.",
    population: "~104,700 (Borneo) + ~7,500 (Sumatra)",
    status: "Critically Endangered",
    image:
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&q=80",
    threats: [
      "Deforestation amplified by climate change",
      "Drought and forest fires",
      "Changing fruiting patterns of food trees",
      "Habitat fragmentation",
    ],
  },
  {
    name: "Pika",
    scientificName: "Ochotona princeps",
    population: "Declining rapidly",
    status: "Vulnerable",
    image:
      "https://images.unsplash.com/photo-1625792550834-a3ce502f0e19?w=800&q=80",
    threats: [
      "Mountain habitat warming",
      "Loss of alpine meadows",
      "Cannot migrate to cooler areas",
      "Heat stress and limited adaptation",
    ],
  },
  {
    name: "Beluga Whale",
    scientificName: "Delphinapterus leucas",
    population: "~150,000 globally",
    status: "Vulnerable (some populations)",
    image:
      "https://images.unsplash.com/photo-1564757981863-ed3c4e255d5d?w=800&q=80",
    threats: [
      "Arctic sea ice loss affecting migration",
      "Changes in prey distribution",
      "Ocean noise pollution increase",
      "Habitat changes in Arctic waters",
    ],
  },
  {
    name: "Koala",
    scientificName: "Phascolarctos cinereus",
    population: "~100,000 - 500,000",
    status: "Vulnerable",
    image:
      "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&q=80",
    threats: [
      "Increased bushfires from climate change",
      "Drought affecting eucalyptus trees",
      "Heat stress and dehydration",
      "Habitat loss from extreme weather",
    ],
  },
  {
    name: "Leatherback Sea Turtle",
    scientificName: "Dermochelys coriacea",
    population: "~34,000 - 36,000 females",
    status: "Vulnerable",
    image:
      "https://images.unsplash.com/photo-1603073109798-25e3f1e65e00?w=800&q=80",
    threats: [
      "Beach erosion from sea level rise",
      "Temperature-dependent sex determination",
      "Jellyfish population changes",
      "Ocean current pattern changes",
    ],
  },
  {
    name: "Snow Leopard",
    scientificName: "Panthera uncia",
    population: "4,000 - 6,500",
    status: "Vulnerable",
    image:
      "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80",
    threats: [
      "Mountain habitat warming",
      "Reduced snow cover",
      "Prey species moving to higher elevations",
      "Habitat fragmentation",
    ],
  },
  {
    name: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    population: "86% decline since 1990s",
    status: "Endangered (IUCN)",
    image:
      "https://images.unsplash.com/photo-1568526381923-caf3fd520382?w=800&q=80",
    threats: [
      "Temperature changes disrupting migration",
      "Extreme weather events",
      "Habitat loss from drought and fires",
      "Milkweed decline from climate shifts",
    ],
  },
];

// Climate-affected species element UIDs for NatureServe API
// Updated list with more climate-vulnerable species
const natureServeSpecies = [
  {
    uid: "ELEMENT_GLOBAL.2.105212",
    name: "Polar Bear",
    unsplashQuery: "polar bear arctic",
  },
  {
    uid: "ELEMENT_GLOBAL.2.100925",
    name: "American Pika",
    unsplashQuery: "pika mountain",
  },
  {
    uid: "ELEMENT_GLOBAL.2.100261",
    name: "Canada Lynx",
    unsplashQuery: "lynx snow",
  },
  {
    uid: "ELEMENT_GLOBAL.2.105925",
    name: "Pacific Walrus",
    unsplashQuery: "walrus ice",
  },
  {
    uid: "ELEMENT_GLOBAL.2.106311",
    name: "Woodland Caribou",
    unsplashQuery: "caribou forest",
  },
  {
    uid: "ELEMENT_GLOBAL.2.104736",
    name: "Loggerhead Sea Turtle",
    unsplashQuery: "sea turtle ocean",
  },
  {
    uid: "ELEMENT_GLOBAL.2.100925",
    name: "Arctic Fox",
    unsplashQuery: "arctic fox snow",
  },
];

// Fetch real species images from multiple sources
async function fetchSpeciesImage(
  scientificName: string,
  commonName: string,
  unsplashQuery: string
): Promise<string> {
  try {
    // Try iNaturalist API first (free, no key required)
    const iNatResponse = await fetch(
      `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(
        scientificName
      )}&rank=species&per_page=1`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (iNatResponse.ok) {
      const iNatData = await iNatResponse.json();
      if (
        iNatData.results &&
        iNatData.results.length > 0 &&
        iNatData.results[0].default_photo
      ) {
        const photo = iNatData.results[0].default_photo;
        // Use medium size image (more reliable than large)
        const imageUrl = photo.medium_url || photo.large_url || photo.small_url;
        if (imageUrl) {
          console.log(
            `✅ Found iNaturalist image for: ${commonName} - ${imageUrl}`
          );
          return imageUrl;
        }
      } else {
        console.log(`ℹ️ No iNaturalist photos found for: ${scientificName}`);
      }
    }
  } catch (error) {
    console.error("iNaturalist API error:", error);
  }

  try {
    // Try Wikipedia/Wikimedia Commons as second option
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        commonName
      )}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      if (
        wikiData.originalimage &&
        wikiData.originalimage.source &&
        wikiData.originalimage.width >= 400
      ) {
        console.log(
          `✅ Found Wikipedia image for: ${commonName} - ${wikiData.originalimage.source}`
        );
        return wikiData.originalimage.source;
      } else {
        console.log(`ℹ️ No suitable Wikipedia image for: ${commonName}`);
      }
    }
  } catch (error) {
    console.error("Wikipedia API error:", error);
  }

  // Fallback to Unsplash with specific search
  console.log(
    `📸 Using Unsplash fallback for: ${commonName} - ${unsplashQuery}`
  );
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(
    unsplashQuery
  )}`;
}

async function fetchFromNatureServe() {
  // Note: NatureServe Explorer API is public and doesn't require an API key
  // See: https://explorer.natureserve.org/api-docs/
  // Optional API key can be provided for special/bulk access
  const apiKey = process.env.NATURESERVE_API_KEY;

  try {
    // Select a random species
    const randomSpecies =
      natureServeSpecies[Math.floor(Math.random() * natureServeSpecies.length)];

    console.log(`Fetching NatureServe data for: ${randomSpecies.name}`);

    // Build headers - API key is optional for public endpoints
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(
      `https://explorer.natureserve.org/api/data/taxon/${randomSpecies.uid}`,
      {
        headers,
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!response.ok) {
      console.error(
        `NatureServe API returned ${response.status}: ${response.statusText}`
      );
      throw new Error(`NatureServe API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      console.log("No data received from NatureServe API");
      return null;
    }

    // Log the full response for debugging
    console.log("NatureServe API Response:", JSON.stringify(data, null, 2));

    // Parse the response based on NatureServe API structure
    const species = data;

    // Extract threats from conservation status data
    const threats: string[] = [];
    if (species.threats && Array.isArray(species.threats)) {
      threats.push(
        ...species.threats.map((t: any) => t.description || t.name || t)
      );
    }

    // Add default climate-related threats if none found
    if (threats.length === 0) {
      threats.push(
        "Climate change affecting habitat conditions",
        "Temperature and precipitation pattern changes",
        "Habitat loss from environmental changes",
        "Altered seasonal patterns and migration timing"
      );
    }

    // Map conservation status to readable format
    const statusMap: Record<string, string> = {
      G1: "Critically Imperiled",
      G2: "Imperiled",
      G3: "Vulnerable",
      G4: "Apparently Secure",
      G5: "Secure",
      GX: "Presumed Extinct",
      GH: "Possibly Extinct",
      T1: "Critically Imperiled",
      T2: "Imperiled",
      T3: "Vulnerable",
      T4: "Apparently Secure",
      T5: "Secure",
    };

    // Try multiple possible status fields
    let status = "Not Assessed";
    const possibleStatus =
      species.roundedGlobalStatus ||
      species.globalStatus ||
      species.conservationStatus?.statusCode ||
      species.grank ||
      species.g_rank;

    if (possibleStatus) {
      // Extract just the rank code (e.g., "G3" from "G3T3")
      const rankMatch = possibleStatus.match(/[GT]\d/);
      const rankCode = rankMatch ? rankMatch[0] : possibleStatus;
      status = statusMap[rankCode] || possibleStatus;
    }

    console.log(`Status extracted: ${status} (from: ${possibleStatus})`);

    const speciesName =
      species.primaryCommonName || species.commonName || randomSpecies.name;
    const scientificName =
      species.scientificName || "Scientific name unavailable";

    // Fetch real species image from iNaturalist, Wikipedia, or Unsplash
    const speciesImage = await fetchSpeciesImage(
      scientificName,
      speciesName,
      randomSpecies.unsplashQuery
    );

    // Extract population data from various possible fields
    let population = "Population data not available";

    if (species.populationSize) {
      population = species.populationSize;
    } else if (species.population) {
      population = species.population;
    } else if (species.populationComments) {
      population = species.populationComments;
    } else if (species.demographicsTrend) {
      population = `Trend: ${species.demographicsTrend}`;
    } else if (species.shortDescription) {
      // Try to extract population info from description
      const popMatch = species.shortDescription.match(
        /(\d[\d,\s-]+)\s*(individuals?|specimens?|animals?)/i
      );
      if (popMatch) {
        population = popMatch[0];
      }
    }

    console.log(`Population extracted: ${population}`);

    // Map NatureServe data to our format
    return {
      name: speciesName,
      scientificName: scientificName,
      population: population,
      status: status,
      image: speciesImage,
      threats: threats.slice(0, 4), // Limit to 4 threats for display
      source: "NatureServe", // Add source indicator
    };
  } catch (error) {
    console.error("NatureServe API error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return null;
  }
}

export async function GET() {
  try {
    // Try NatureServe API first
    const natureServeData = await fetchFromNatureServe();

    if (natureServeData) {
      return NextResponse.json(natureServeData, { status: 200 });
    }

    // Fallback to curated data
    const randomIndex = Math.floor(Math.random() * endangeredAnimals.length);
    const animal = endangeredAnimals[randomIndex];

    // Try to enhance fallback data with real images from iNaturalist/Wikipedia
    try {
      const realImage = await fetchSpeciesImage(
        animal.scientificName,
        animal.name,
        animal.name.toLowerCase().replace(/\s+/g, " ") + " wildlife"
      );

      // Only update if we got a different image (not from Unsplash fallback)
      if (realImage && !realImage.includes("unsplash")) {
        console.log(`✅ Enhanced fallback image for: ${animal.name}`);
        return NextResponse.json(
          {
            ...animal,
            image: realImage,
          },
          { status: 200 }
        );
      }
    } catch (imageError) {
      console.log("Could not enhance fallback image, using original");
    }

    return NextResponse.json(animal, { status: 200 });
  } catch (error) {
    console.error("Error fetching endangered animal:", error);

    // Return a default animal on error
    return NextResponse.json(endangeredAnimals[0], { status: 200 });
  }
}
