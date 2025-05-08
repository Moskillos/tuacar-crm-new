import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { regionId: string } }
) {
    try {
        const response = await fetch(`https://leads.tua-car.it/geoData/provincesByregion${params.regionId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return NextResponse.json({ error: 'Failed to fetch provinces' }, { status: 500 });
    }
} 