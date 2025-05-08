import { NextResponse } from 'next/server';
import addGarageCar from './actions/addCar';
import getCars from './actions/getCars';
import getCarById from './actions/getCarById';
import getCarByContactId from './actions/getCarByContactId';
import getPeriziaByCarId from './actions/getPeriziaByCarId';
import removeCarById from './actions/removeCarById';
import updateCarById from './actions/updateCarById';
import updatePeriziaById from './actions/updatePeriziaById';
import getCarByUserId from './actions/getCarByUserId';
import updateNotificationToken from './actions/updateNotificationToken';

/*
APP PRIVATI SCHEMA DB
--> guardare campi form UI Figma
*/

export async function POST(request: Request) {
	const req = await request.json();

	//MANAGE AUTO GARAGE
	if (req.action === 'addCar') {
		try {
			const res = await addGarageCar(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else if (req.action === 'updateCarById') {
		try {
			const res = await updateCarById(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else if (req.action === 'updatePeriziaById') {
		try {
			const res = await updatePeriziaById(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else if (req.action === 'addCarImages') {
		//AGGIUNGI IMMAGINI SU AWS S3 e AGGIORNA ARRAY immagini.
		try {
			const res = ""
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else if (req.action === 'updateToken') {
		try {
			const res = await updateNotificationToken(req)
			return NextResponse.json(
				{ msg: 'Success', data: res },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else {
		return NextResponse.json({ msg: "This API is working" }, { status: 200 });
	}
}

export async function GET(request: Request) {

	const { searchParams } = new URL(request.url);

	const action = searchParams.get("action")

	//OTTIENI AUTO DAL GARAGE
	if (action === 'getCars') {
		const limit = searchParams.get('limit')
		const offset = searchParams.get('offset')
		const inGarage = searchParams.get('inGarage')
		const inVendita = searchParams.get('inVendita')
		const status = searchParams.get('status')
		try {
			const res = await getCars({
				limit,
				offset,
				inGarage,
				inVendita,
				status
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
	else if (action === 'getCarById') {
		try {
			const carId = searchParams.get('carId')
			const res = await getCarById({
				carId: carId
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
	else if (action === 'getCarByContactId') {
		try {
			const contactId = searchParams.get('contactId')
			const inGarage = searchParams.get('inGarage')
			const inVendita = searchParams.get('inVendita')

			const res = await getCarByContactId({
				contactId: contactId,
				inGarage: inGarage,
				inVendita: inVendita
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
	else if (action === 'getCarByUserId') {
		try {
			const userId = searchParams.get('userId')
			//const limit = searchParams.get('limit')
			//const offset = searchParams.get('offset')
			const inGarage = searchParams.get('inGarage')
			const inVendita = searchParams.get('inVendita')
			//const status = searchParams.get('status')

			const res = await getCarByUserId({
				userId: userId,
				inGarage: inGarage,
				inVendita: inVendita,
				//status: status,
				//limit: limit,
				//offset: offset
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

	//PERIZIE
	else if (action === 'getPeriziaByCarId') {
		const carId = searchParams.get('carId')
		const tipo = searchParams.get('tipo')
		try {
			const res = await getPeriziaByCarId({
				carId: carId,
				tipo: tipo
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
	else {
		return NextResponse.json({ msg: "This API is working" }, { status: 200 });
	}
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);

	const action = searchParams.get("action")

	if (action === 'removeCarById') {
		const carId = searchParams.get("carId")
		try {
			const res = await removeCarById({
				carId: carId
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
	else {
		return NextResponse.json({ msg: "This API is working" }, { status: 200 });
	}
}