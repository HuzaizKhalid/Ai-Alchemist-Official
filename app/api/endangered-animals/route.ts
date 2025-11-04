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
const natureServeSpecies = [
  "ELEMENT_GLOBAL.2.105212", // Polar Bear
  "ELEMENT_GLOBAL.2.100925", // American Pika
  "ELEMENT_GLOBAL.2.100261", // Canada Lynx
  "ELEMENT_GLOBAL.2.105925", // Pacific Walrus
  "ELEMENT_GLOBAL.2.106311", // Woodland Caribou
];

async function fetchFromNatureServe() {
  const apiKey = process.env.NATURESERVE_API_KEY;

  if (!apiKey) {
    console.log("NatureServe API key not found, using fallback data");
    return null;
  }

  try {
    // Select a random species UID
    const randomUID =
      natureServeSpecies[Math.floor(Math.random() * natureServeSpecies.length)];

    const response = await fetch(
      `https://explorer.natureserve.org/api/data/speciesSearch?uid=${randomUID}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NatureServe API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.results || data.results.length === 0) {
      return null;
    }

    const species = data.results[0];

    // Map NatureServe data to our format
    return {
      name: species.primaryCommonName || species.scientificName,
      scientificName: species.scientificName,
      population: species.populationSize || "Population data not available",
      status:
        species.roundedGlobalStatus ||
        species.conservationStatus ||
        "Not Assessed",
      image: `https://source.unsplash.com/800x600/?${encodeURIComponent(
        species.primaryCommonName || species.scientificName
      )},wildlife`,
      threats: [
        "Climate change affecting habitat",
        "Temperature fluctuations",
        "Habitat loss from environmental changes",
        "Changes in seasonal patterns",
      ],
    };
  } catch (error) {
    console.error("NatureServe API error:", error);
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

    return NextResponse.json(animal, { status: 200 });
  } catch (error) {
    console.error("Error fetching endangered animal:", error);

    // Return a default animal on error
    return NextResponse.json(endangeredAnimals[0], { status: 200 });
  }
}
