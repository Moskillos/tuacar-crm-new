import { NextResponse } from 'next/server';
import assignEmail from './_actions/assignEmail';
import getEmails from './_actions/getEmails';
import delEmailById from './_actions/delEmailById';
import getEmailById from './_actions/getEmailById';
import addEmail from './_actions/addEmail';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'new') {
		try {
			const data = await getEmails(req);
			return NextResponse.json(
				{ msg: 'Success', data: data.rows, count: data.count },
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] == 'getEmailById') {
		try {
			const data = await getEmailById(req)
			return NextResponse.json(
				{ msg: 'Success', data: data.rows },
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'delEmailById') {
		await delEmailById(req);
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	} else if (req['action'] === 'assign') {
		const insertIdDeal = await assignEmail(req);

		return NextResponse.json(
			{ msg: 'Success', dealId: insertIdDeal },
			{ status: 200 }
		);
	} else if (req['action'] === 'addEmail') {
		const insertIdEmail = await addEmail(req.payload);

		return NextResponse.json(
			{ msg: 'Success', insertIdEmail: insertIdEmail },
			{ status: 200 }
		);
	} else {
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	}
}
