import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const regione = searchParams.get('regione');

    if (!regione) {
        return NextResponse.json({ error: 'Region parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.leads.tua-car.it/location/province?regione=${encodeURIComponent(regione)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch provinces');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return NextResponse.json({ error: 'Failed to fetch provinces' }, { status: 500 });
    }
} 