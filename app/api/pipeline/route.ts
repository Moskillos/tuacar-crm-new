import { NextResponse } from 'next/server';
import addVendita from './_actions/vendita/addVendita';
import getVendita from './_actions/vendita/getVendita';
import getVenditaById from './_actions/vendita/getVenditaById';
import updateVendita from './_actions/vendita/updateVendita';
import getAcquisizione from './_actions/acquisizione/getAcquisizione';
import addAcquisizione from './_actions/acquisizione/addAcquisizione';
import updateAcquisizione from './_actions/acquisizione/updateAcquisizione';
import getAcquisizioneById from './_actions/acquisizione/getAcquisizioneById';
import getWonVendita from './_actions/vendita/getWonVendita';
import getFailedVendita from './_actions/vendita/getFailedVendita';
import getWonAcquisizione from './_actions/acquisizione/getWonAcquisizione';
import getFailedAcquisizione from './_actions/acquisizione/getFailedAcquisizione';
import getBreve from './_actions/rent/getBreve';
import getLungo from './_actions/rent/getLungo';
import updateRentDealById from './_actions/rent/updateRentDeal';
import newRent from './_actions/rent/newRent';
import getBreveById from './_actions/rent/getBreveById';
import getLungoById from './_actions/rent/getLungoById';
import addRentDeal from './_actions/rent/addRentDeal';

export async function POST(request: Request) {
	const req = await request.json();

	//VENDITA
	if (req['action'] === 'vendita') {
		try {
			const rows = await getVendita(req);
			return NextResponse.json({ msg: 'Success', data: rows }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'venditaById') {
		try {
			const rows = await getVenditaById(req);
			return NextResponse.json({ msg: 'Success', data: rows }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'addVendita') {
		try {
			const insertId = await addVendita(req);
			return NextResponse.json(
				{ msg: 'Success', insertId: insertId },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateVenditaById') {
		try {
			const insertId = await updateVendita(req);
			return NextResponse.json(
				{ msg: 'Success', insertId: insertId },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getWonVendita') {
		try {
			const res = await getWonVendita(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getFailedVendita') {
		try {
			const res = await getFailedVendita(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}

	}

	//ACQUISIZIONE
	else if (req['action'] === 'acquisizione') {
		try {
			const rows = await getAcquisizione(req);
			return NextResponse.json({ msg: 'Success', data: rows }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'acquisizioneById') {
		try {
			const rows = await getAcquisizioneById(req);
			return NextResponse.json({ msg: 'Success', data: rows }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'addAcquisizione') {
		try {
			const insertId = await addAcquisizione(req);
			return NextResponse.json(
				{ msg: 'Success', insertId: insertId },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateAcquisizioneById') {
		try {
			const insertId = await updateAcquisizione(req);
			return NextResponse.json(
				{ msg: 'Success', insertId: insertId },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getWonAcquisizione') {
		try {
			const res = await getWonAcquisizione(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getFailedAcquisizione') {
		try {
			const res = await getFailedAcquisizione(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}

	//NOLEGGIO LUNGO TERMINE
	else if (req['action'] === 'lungo_termine') {
		try {
			const res = await getLungo(req)
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}

	} else if (req['action'] === 'addLungoTermine') {
		try {
			const res = await addRentDeal(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} if (req['action'] === 'updateLungoTermineById') {
		try {
			await updateRentDealById(req);
			return NextResponse.json(
				{ msg: 'Success' },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getLungoTermineById') {
		try {
			const res = await getLungoById(req);
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}

	//NOLEGGIO BREVE TERMINE
	else if (req['action'] === 'breve_termine') {
		try {
			const res = await getBreve(req)
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'addBreveTermine') {
		try {
			const res = await newRent(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateBreveTermineById') {
		try {
			await updateRentDealById(req);
			return NextResponse.json(
				{ msg: 'Success' },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getBreveTermineById') {
		try {
			const res = await getBreveById(req);
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else {
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	}
}
