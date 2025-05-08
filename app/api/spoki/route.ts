import agencyErpByCode from '@/app/_actions/agencyErpByCode';
import {NextResponse} from 'next/server';
import sendSpokiPresentazione from './_actions/sendSpokiPresentazione';
import ricordaEvento from './_actions/ricordaEvento';

export async function POST(request: Request) {
	const req = await request.json();
	
	if (req['action'] === 'sendRentDates') {
		console.log('ok');
	} else if (req['action'] === 'ricordaEvento') {
		const agencyCode = req['activity']['agencyCode'];
		const activity = req['activity'];
		const spokiSettings = await agencyErpByCode(agencyCode);
		await ricordaEvento(activity, spokiSettings);

		return NextResponse.json({msg: 'Success'}, {status: 200});
	} else if (req['action'] === 'sendPresentazione') {
		const lead = req['lead'];
		const agencyCode = req['agencyCode'];
		const spokiSettings = await agencyErpByCode(agencyCode);
		if (spokiSettings) {
			const spokiSentRes = await sendSpokiPresentazione(
				lead,
				spokiSettings,
				'leadOrDeal'
			);
			if (spokiSentRes.status === 200) {
				return NextResponse.json({msg: 'Success'}, {status: 200});
			} else {
				return NextResponse.json({msg: 'Error'}, {status: 500});
			}
		} else {
			return NextResponse.json({msg: 'Error'}, {status: 500});
		}
	}
	return NextResponse.json({msg: 'Success'}, {status: 200});
}
