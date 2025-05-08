import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.leads.tua-car.it/user/scheduledTask?userMail=${email}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Scheduled task fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch scheduled task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.leads.tua-car.it/user/disableScheduledTask?task_id=${taskId}`, {
            method: 'POST'
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Task deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete scheduled task' },
            { status: 500 }
        );
    }
} 