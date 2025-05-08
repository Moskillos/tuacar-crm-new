import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { email: string } }
) {
    try {
        const response = await fetch(`https://api.leads.tua-car.it/user/update?userMail=${params.email}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
} 