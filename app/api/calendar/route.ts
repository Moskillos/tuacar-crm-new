import {NextResponse} from 'next/server';
import updateCalendar from './_actions/updateCalendar';
import getCalendar from './_actions/getCalendar';
import addCalendar from './_actions/addCalendar';
import deleteCalendar from './_actions/deleteCalendar';
import completeActivity from './_actions/completeActivity';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'get') {
		try {
			const res = await getCalendar(req);
			return NextResponse.json(
				{msg: 'Success', data: res.rows, count: res.count},
				{status: 200}
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] === 'update') {
		try {
			await updateCalendar(req);
			return NextResponse.json({msg: 'Success'}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] === 'completeActivity') {
		try {
			await completeActivity(req);
			return NextResponse.json({msg: 'Success'}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] === 'add') {
		try {
			console.log(req);
			const data = await addCalendar(req);
			return NextResponse.json({msg: 'Success', data: data}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] === 'delete') {
		try {
			await deleteCalendar(req);
			return NextResponse.json({msg: 'Success'}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else {
		return NextResponse.json({msg: 'Success'}, {status: 200});
	}
}
