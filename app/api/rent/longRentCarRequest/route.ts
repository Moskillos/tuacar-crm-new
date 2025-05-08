import { NextResponse } from "next/server";
import addContact from "../../contacts/_actions/addContact";
import addCarToRent from "../_actions/addCarToRent";
import addRentDeal from "../../pipeline/_actions/rent/addRentDeal";
import getAgencies from "@/app/api/agencies/_actions/getAgencies";
//import { storeLogs } from "@/lib/storeLogs";

export async function POST(request: Request) {
	const req = await request.json();

	console.log("NEW RENT REQUEST: ", req)

	/*
	const log = {
		title: 'rentLog lungo request',
		data: req
	}
	await storeLogs("rentLogs", log)
	*/

	const name = req['name']
	const email = req['email']
	const phone = req['phone']

	const rentCarId = req['rentCarId']
	const marca = req['marca']
	const model = req['model']
	const allestimento = req['allestimento']
	const immagine = req['immagine']
	const url = req['url']

	const selectedAnticipi = req['selectedAnticipi']
	const selectedCambioGomme = req['selectedCambioGomme']
	const selectedKmAnnui = req['selectedKmAnnui']
	const selectedMesi = req['selectedMesi']
	const messaggio = req['messaggio']
	const agenzia: string = req['agenzia']


	const agenzieCodes = await getAgencies()

	const agenzieCode: any = {};

	// Generate the required object
	agenzieCodes.forEach((agenzia: any) => {
		agenzieCode[agenzia.description] = agenzia.code;
	});

	console.log("agenzieCodes: ", agenzieCodes);

	const notes = {
		allestimento: allestimento,
		selectedCambioGomme: selectedCambioGomme,
		selectedAnticipi: selectedAnticipi,
		selectedKmAnnui: selectedKmAnnui,
		selectedMesi: selectedMesi,
		marca: marca,
		modello: model,
		immagine: immagine,
		url: url,
		messaggio: messaggio,
		agenzia: agenzia
	}

	const addNewContact = {
		userId: "1",
		name: name,
		phoneNumber: phone,
		email: email,
		isConfirmed: true,
		notInterested: false,
		isCommerciant: false,
	};

	console.log("ADD CONTACT: ", addNewContact)

	const newContact = await addContact({
		contact: addNewContact
	});

	//const res = await getRentCarByERPId(erpId)

	if (newContact) {
		const addCar = {
			contactId: newContact?.id,
			carToBuyId: 0,
			source: "Lungo",
			agencyCode: agenzieCode[agenzia], //how to get the agency code??
			userId: "1",
			erpId: rentCarId,
			make: marca ? marca : "",
			model: model ? model : "",
			isMessageSent: false,
			oldNotes: JSON.stringify(notes),
			isConfirmed: false,
			rentStatus: "init",
			//start: new Date(start),
			//end: new Date(end),
			//bookingId: bookingId,
			//productId: productId,
		};

		console.log("ADD CAR: ", addCar)

		const car = await addCarToRent({
			carsToRent: addCar
		});

		console.log("NEW LONG CAR TO RENT: ", car)

		//ADD DEAL
		const newDeal = {
			userId: "1",
			agencyCode: agenzieCode[agenzia],
			contactId: newContact?.id ? newContact?.id : 0,
			stageId: 20,
			pipelineId: 5,
			title: name,
			value: 0,
			isAwarded: false,
			isFailed: false,
			carToRentId: car,
			oldNotes: JSON.stringify(notes)
		};

		console.log("NEW RENT DEAL: ", newDeal)

		const newRentDeal = await addRentDeal({
			deal: newDeal
		});

		console.log("NEW RENT DEAL ID: ", newRentDeal)

		//invio spoki
		/*
		await fetch("https://app.spoki.it/wh/ap/8f3e1be1-767e-4c3b-9e25-94b2a72b3892/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret: "c5a6e9a7fc72419cac7896c932908202",
				phone: phoneNumber,
				first_name:
					name && name.length > 0
						? name
						: "Gentile Cliente",
				last_name: "",
				email: "",
			}),
		});
		*/

		if (newRentDeal) {
			return NextResponse.json({ status: 200, data: "Success" });
		} else {
			return NextResponse.json({ status: 500, data: "Something went wrong" });
		}
	}

	return NextResponse.json({ status: 500, message: "Something went wrong" });
}
