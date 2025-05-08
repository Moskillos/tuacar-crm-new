import { NextResponse } from 'next/server';
import { updateRentStatus } from './_actions/updateRentStatus';
import { updateRentDates } from './_actions/updateRentDates';
import { assignCar } from './_actions/assignCar';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'get') {
		try {
			return NextResponse.json({ msg: 'Success', data: '' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateRentStatus') {
		try {
			await updateRentStatus(req);
			return NextResponse.json({ msg: 'Success', data: '' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateRentDates') {
		try {
			await updateRentDates(req);
			return NextResponse.json({ msg: 'Success', data: '' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'assignCar') {
		try {
			await assignCar(req);
			return NextResponse.json({ msg: 'Success', data: '' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else {
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	}
}
