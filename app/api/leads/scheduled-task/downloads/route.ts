import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get URL and parse search parameters
    const url = new URL(request.url);
    const searchPath = url.searchParams.get('searchPath');
    const fileName = url.searchParams.get('fileName');

    if (!searchPath || !fileName) {
      return NextResponse.json({ error: 'File path and file name are required' }, { status: 400 });
    }

    // Forward the request to the external API
    const response = await fetch(`https://api.leads.tua-car.it/export?searchPath=${searchPath}&fileName=${fileName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Download failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the file data
    const fileData = await response.blob();

    // Convert blob to arrayBuffer for the response
    const arrayBuffer = await fileData.arrayBuffer();

    // Return the file with proper headers
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': fileData.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${fileName.split('/').pop()}`,
      },
    });
  } catch (error) {
    console.error('Error in download API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 