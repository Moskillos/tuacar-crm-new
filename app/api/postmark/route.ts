import { NextResponse } from 'next/server';
import addAutoScout from './_actions/addAutoscout';
import addSubito from './_actions/addSubito';
import addAutomobile from './_actions/addAutomobile';
import addAutoSuperMarket from './_actions/addAutoSuperMarket';
import addTuaCar from './_actions/addTuaCar';
import addIndicata from './_actions/addIndicata';
import addTCM from './_actions/addTCM';
import getAgency, { getSameGroupAgencies } from '@/app/_actions/agencies';
import getEmailById from './_actions/getEmailById';
import addTuaCarRent from './_actions/addTuaCarRent';

export async function POST(request: Request) {
	let data = await request.json();

	console.log('EMAIL AGENCY: ', data.ToFull[0].Email);
	console.log('FROM: ', data.FromFull.Name);
	console.log('FROM EMAIL: ', data.FromFull);

	if (data.FromFull.Email == 'info@tua-car.it') {
		//TROVA PROVIDER DA SUBJECT EMAIL
		console.log('Find provider differently');
		//autoscout
		if (
			data.Subject.includes('Richiesta informazioni') &&
			!data.Subject.includes('(Prime)')
		) {
			data.FromFull.Email = 'autoscout24.com';
		}
		if (
			data.Subject.includes('Richiesta informazioni') &&
			data.Subject.includes('(Prime)')
		) {
			data.FromFull.Email = 'autoscout24.com';
		}
		if (data.Subject.includes('SellID') && data.Subject.includes('(Prime)')) {
			data.FromFull.Email = 'autoscout24.com';
		}
		if (data.Subject.includes('SellID') && !data.Subject.includes('(Prime)')) {
			data.FromFull.Email = 'autoscout24.com';
		}
		if (data.Subject.includes('nostro utente sta cercando')) {
			data.FromFull.Email = 'autoscout24.com';
		}
		//subito
		if (data.Subject.includes('Subito - Risposta a:')) {
			data.FromFull.Email = 'subito.it';
		}
		//automobile
		if (data.Subject.includes('Nuovo contatto')) {
			data.FromFull.Email = 'automobile.it';
		}
		//autosupermarket
		if (data.Subject.includes('Un utente sta cercando')) {
			data.FromFull.Email = 'autosupermarket.it';
		}
	}

	const agency: any = await getAgency(data.ToFull[0].Email);

	console.log('FOUND AGENCY: ', agency);
	console.log('SUBJECT: ', data.Subject);

	//OTTIENI AGENZIE DELLO STESSO GRUPPO.
	const sameGroupAgencies: any = await getSameGroupAgencies(
		data.ToFull[0].Email == 'info@tua-car.it'
			? 'AGENZIA_001'
			: agency[0]?.parentAgency != null
				? agency[0]?.parentAgency
				: agency[0]?.code
	);

	let agencyCodes = sameGroupAgencies.map((item: { code: any }) => item.code);

	console.log(agencyCodes);

	if (data.FromFull.Email.includes('autoscout24.com')) {
		const res = await addAutoScout(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('subito.it')) {
		const res = await addSubito(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('automobile.it')) {
		const res = await addAutomobile(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('autosupermarket.it')) {
		const res = await addAutoSuperMarket(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('tua-car')) {
		const res = await addTuaCar(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('indicata.com')) {
		const res = await addIndicata(data, agencyCodes);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	if (data.FromFull.Email.includes('tcm@tuacar.it')) {
		const res = await addTCM(data, agency[0]?.code);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	//noleggio
	//oggetto email vecchia: Nuova richiesta Noleggio
	if (data.Subject.includes("Nuova richiesta informazioni noleggio")) {
		const res = await addTuaCarRent(data);
		if (!res) {
			return NextResponse.json({}, { status: 500 });
		}
	}

	return NextResponse.json({}, { status: 200 });
}

export async function GET(request: Request) {

	const { searchParams } = new URL(request.url);

	try {
		const emailId = searchParams.get('emailId')

		const res = await getEmailById({
			emailId: emailId
		})

		return NextResponse.json(
			{ msg: 'Success', data: res },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ msg: 'Error' }, { status: 500 });
	}

}