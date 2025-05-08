import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const response = await fetch('https://leads.tua-car.it/user/updateUserSpoki', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to update Spoki settings');
        }
        const result = await response.json();
        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
            }
        });
    } catch (error) {
        console.error('Error updating Spoki settings:', error);
        return NextResponse.json(
            { error: 'Failed to update Spoki settings' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
                }
            }
        );
    }
} 