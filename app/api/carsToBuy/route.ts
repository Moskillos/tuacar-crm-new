import {NextResponse} from 'next/server';
import getCarToBuyById from './_actions/getCarToBuyById';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'getCarToBuyById') {
		try {
			const res = await getCarToBuyById(req);
			return NextResponse.json({msg: 'Success', data: res}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else {
		return NextResponse.json({msg: 'Success'}, {status: 200});
	}
}
