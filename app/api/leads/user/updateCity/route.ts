import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://leads.tua-car.it/user/updateUserCity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating user cities:', error);
        return NextResponse.json({ error: 'Failed to update user cities' }, { status: 500 });
    }
} 