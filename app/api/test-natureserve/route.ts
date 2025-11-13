import { NextResponse } from "next/server";

// Test endpoint to debug NatureServe API responses
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid") || "ELEMENT_GLOBAL.2.105212"; // Default: Polar Bear

  try {
    console.log(`Testing NatureServe API for UID: ${uid}`);

    const response = await fetch(
      `https://explorer.natureserve.org/api/data/taxon/${uid}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `API returned ${response.status}: ${response.statusText}`,
          uid,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return formatted response with key fields highlighted
    return NextResponse.json(
      {
        uid,
        apiStatus: "success",
        extractedFields: {
          primaryCommonName: data.primaryCommonName,
          scientificName: data.scientificName,
          commonName: data.commonName,
          roundedGlobalStatus: data.roundedGlobalStatus,
          globalStatus: data.globalStatus,
          grank: data.grank,
          g_rank: data.g_rank,
          populationSize: data.populationSize,
          population: data.population,
          populationComments: data.populationComments,
          demographicsTrend: data.demographicsTrend,
          shortDescription: data.shortDescription?.substring(0, 200),
          threats: data.threats,
          conservationStatus: data.conservationStatus,
        },
        fullResponse: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        uid,
      },
      { status: 500 }
    );
  }
}
