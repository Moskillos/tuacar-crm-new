import {getSession, withMiddlewareAuthRequired} from '@auth0/nextjs-auth0/edge';
import {NextRequest, NextResponse} from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(
	request: NextRequest
) {
	const response = NextResponse.next();
	const user = await getSession(request, response);
	if (!user) {
		return NextResponse.redirect('/api/auth/silent-login');
	}
	return response;
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
