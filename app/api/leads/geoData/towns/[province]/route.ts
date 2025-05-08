import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { province: string } }
) {
    try {
        const response = await fetch(`https://leads.tua-car.it/geoData/townsByProvince${params.province}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching towns:', error);
        return NextResponse.json({ error: 'Failed to fetch towns' }, { status: 500 });
    }
} 