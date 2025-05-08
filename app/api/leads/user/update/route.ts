import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://leads.tua-car.it/user/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' }, 
            { 
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
                }
            }
        );
    }
} 