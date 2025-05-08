import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        const response = await fetch(`https://api.leads.tua-car.it/leads/list?userId=${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch searches');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching searches:', error);
        return NextResponse.json({ error: 'Failed to fetch searches' }, { status: 500 });
    }
}