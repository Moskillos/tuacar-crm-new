import {NextResponse} from 'next/server';
import spokiInterested from '../_actions/spokiInterested';
import spokiNotInterested from '../_actions/spokiNotInterested';
import addSpokiLead from '../_actions/addSpokiLead';

export async function POST(request: Request) {
	
	const req = await request.json();

	if (req?.data?.payload?.toLowerCase() === 'sono interessato') {
		console.log("sono interessato")
		await spokiInterested(req)
	} else if (req?.data?.payload?.toLowerCase() === 'non sono interessato') {
		console.log("non sono interessato")
		await spokiNotInterested(req)
	} else {
		await addSpokiLead(req);
	}

	return NextResponse.json({msg: 'Success', data: null}, {status: 200});
}
