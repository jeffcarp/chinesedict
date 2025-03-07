// Simple server route to serve the gzipped search index with proper headers
export async function GET() {
    const response = new Response(null, {
        status: 302, // Redirect
        headers: {
            'Location': '/full_search_index.json.gz',
            'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
    });
    
    return response;
} 