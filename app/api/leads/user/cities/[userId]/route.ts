import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const response = await fetch(`https://leads.tua-car.it/user/userCity${params.userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user cities:', error);
        return NextResponse.json({ error: 'Failed to fetch user cities' }, { status: 500 });
    }
} 