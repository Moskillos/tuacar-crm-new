// pages/api/session.ts
import {getSession} from '@auth0/nextjs-auth0';
import {NextResponse} from 'next/server';

export async function GET() {
	const session = await getSession();

	if (!session) {
		return NextResponse.json({message: 'Not authenticated'}, {status: 401});
	}

	const userRoles = session.user['https://manager.tuacar.it/roles'] || [];

	return NextResponse.json({session, userRoles}, {status: 200});
}
