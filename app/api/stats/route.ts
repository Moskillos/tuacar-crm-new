import { NextResponse } from 'next/server';
import getAcquisizioni from './_actions/getAcquisizioni';
import getVendite from './_actions/getVendite';
import getLeads from './_actions/getLeads';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'stats') {
		try {
			const acquisizioni = await getAcquisizioni(req);
			const vendite = await getVendite(req);
			const leads = await getLeads(req);

			const stats = {
				leads: leads,
				//leadCaduti: '',
				//leadAssegnati: '',
				//leadNonInteressati: '',
				//leadInteressati: '',
				//leadCommercianti: '',
				//emailCadute: '',
				acquisizioni: acquisizioni,
				vendite: vendite,
				//noleggiBrevi: noleggiBrevi,
				//noleggiLunghi: noleggiLunghi
			};

			return NextResponse.json({ msg: 'Success', data: stats }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else {
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	}
}
