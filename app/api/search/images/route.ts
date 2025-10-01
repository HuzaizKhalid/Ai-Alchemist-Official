import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    console.log(`🔍 Searching images for: "${query}"`);

    // Try Pixabay API first (more reliable free tier)
    try {
      const pixabayResponse = await fetch(
        `https://pixabay.com/api/?key=44863294-1b8b5a5c4c5c5a5c4c5c5a5c&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=6&safesearch=true&category=places,nature,science,education,backgrounds`,
        {
          headers: {
            'User-Agent': 'Alchemist-AI/1.0',
          }
        }
      );

      console.log(`📡 Pixabay API response status: ${pixabayResponse.status}`);

      if (pixabayResponse.ok) {
        const pixabayData = await pixabayResponse.json();
        console.log(`📊 Pixabay returned ${pixabayData.hits?.length || 0} images`);
        
        const formattedImages = pixabayData.hits?.map((image: any) => ({
          id: image.id.toString(),
          url: image.webformatURL,
          thumbnail: image.previewURL,
          alt: image.tags || query,
          source: 'Pixabay',
          photographer: image.user || 'Unknown',
          link: image.pageURL
        })) || [];

        return NextResponse.json({
          success: true,
          images: formattedImages,
          total: pixabayData.totalHits || 0,
          source: 'Pixabay'
        });
      } else {
        const errorText = await pixabayResponse.text();
        console.log(`❌ Pixabay API error: ${pixabayResponse.status} - ${errorText}`);
      }
    } catch (pixabayError) {
      console.log('❌ Pixabay API failed:', pixabayError);
    }

    // Try Unsplash API as fallback
    try {
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID gBLTCz_KaD2kfOIZDKPwBw7hwTSaW3xN5LvEt-Xf3D8`,
            'User-Agent': 'Alchemist-AI/1.0',
          },
        }
      );

      console.log(`📡 Unsplash API response status: ${unsplashResponse.status}`);

      if (unsplashResponse.ok) {
        const unsplashData = await unsplashResponse.json();
        console.log(`📊 Unsplash returned ${unsplashData.results?.length || 0} images`);
        
        const formattedImages = unsplashData.results?.map((image: any) => ({
          id: image.id,
          url: image.urls.regular,
          thumbnail: image.urls.small,
          alt: image.alt_description || image.description || query,
          source: 'Unsplash',
          photographer: image.user?.name || 'Unknown',
          link: image.links.html
        })) || [];

        return NextResponse.json({
          success: true,
          images: formattedImages,
          total: unsplashData.total || 0,
          source: 'Unsplash'
        });
      } else {
        const errorText = await unsplashResponse.text();
        console.log(`❌ Unsplash API error: ${unsplashResponse.status} - ${errorText}`);
      }
    } catch (unsplashError) {
      console.log('❌ Unsplash API failed:', unsplashError);
    }

    // If both APIs fail, return mock images as fallback
    console.log('⚠️ Both APIs failed, providing placeholder images');
    
    const mockImages = Array.from({ length: 6 }, (_, i) => ({
      id: `mock-${i}`,
      url: `https://picsum.photos/800/600?random=${Math.random()}`,
      thumbnail: `https://picsum.photos/300/200?random=${Math.random()}`,
      alt: `Image related to ${query}`,
      source: 'Lorem Picsum',
      photographer: 'Lorem Picsum',
      link: 'https://picsum.photos'
    }));

    return NextResponse.json({
      success: true,
      images: mockImages,
      total: 6,
      source: 'Lorem Picsum (Fallback)',
      note: 'Using fallback images due to API limitations'
    });

  } catch (error) {
    console.error('❌ Image search error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch images',
      images: []
    }, { status: 500 });
  }
}