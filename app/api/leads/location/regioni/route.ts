import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.leads.tua-car.it/location/regioni');

        if (!response.ok) {
            throw new Error('Failed to fetch regions');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching regions:', error);
        return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }
} 