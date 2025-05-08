import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch("https://api.leads.tua-car.it/leads/ricercaProgrammata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Scheduled search error:', error);
        return NextResponse.json(
            { error: 'Failed to schedule search' },
            { status: 500 }
        );
    }
} 