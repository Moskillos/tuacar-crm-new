import {NextResponse} from 'next/server';
import getNotes from './_actions/getNotes';
import deleteNote from './_actions/deleteNote';
import addNote from './_actions/addNote';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'get') {
		try {
			const res = await getNotes(req);
			return NextResponse.json({msg: 'Success', data: res}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] == 'add') {
		try {
			const res = await addNote(req);
			return NextResponse.json({msg: 'Success', data: res}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else if (req['action'] == 'delete') {
		try {
			await deleteNote(req);
			return NextResponse.json({msg: 'Success'}, {status: 200});
		} catch (err) {
			console.error(err);
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	} else {
		return NextResponse.json({msg: 'Success'}, {status: 200});
	}
}
