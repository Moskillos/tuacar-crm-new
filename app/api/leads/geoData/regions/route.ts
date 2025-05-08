import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://leads.tua-car.it/geoData/regions', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching regions:', error);
        return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }
} 