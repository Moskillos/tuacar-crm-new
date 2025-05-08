import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sigla = searchParams.get('sigla');

    if (!sigla) {
        return NextResponse.json({ error: 'Province code (sigla) parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.leads.tua-car.it/location/comuni?sigla=${encodeURIComponent(sigla)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch comuni');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching comuni:', error);
        return NextResponse.json({ error: 'Failed to fetch comuni' }, { status: 500 });
    }
} 