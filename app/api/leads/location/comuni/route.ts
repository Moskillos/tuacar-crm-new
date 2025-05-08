import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userMail = searchParams.get('userMail');

        if (!userMail) {
            return NextResponse.json({ error: 'User email is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.leads.tua-car.it/location/comuniByUser?userMail=${userMail}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching comuni:', error);
        return NextResponse.json({ error: 'Failed to fetch comuni' }, { status: 500 });
    }
} 