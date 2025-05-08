import {getErpCars} from '@/app/_actions/erpCars';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'getErpCars') {
		const res = await getErpCars(req['search'], req['agencyCode']);

		return NextResponse.json({msg: 'Success', data: res}, {status: 200});
	} else {
		return NextResponse.json({msg: 'Success', data: []}, {status: 200});
	}
}
