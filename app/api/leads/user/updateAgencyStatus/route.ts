import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://api.leads.tua-car.it/user/updateIsNewAgency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to update agency status');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating agency status:', error);
        return NextResponse.json(
            { error: 'Failed to update agency status' },
            { status: 500 }
        );
    }
} 