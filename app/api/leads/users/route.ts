import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://leads.tua-car.it/users', {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}