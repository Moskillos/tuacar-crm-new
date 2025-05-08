import { NextResponse } from "next/server";
import addRentDeal from "../../pipeline/_actions/rent/addRentDeal";
import addCarToRent from '../_actions/addCarToRent';
import addContact from '../../contacts/_actions/addContact';
import { getRentCarByERPId } from "../_actions/getRentCarByERPId";

function createDateFromYYYYMMDD(dateString: any) {
	if (dateString.length !== 8) {
		throw new Error("Date string must be in the format YYYYMMDD");
	}
	const year = parseInt(dateString.substring(0, 4), 10);
	const month = parseInt(dateString.substring(4, 6), 10) - 1;
	const day = parseInt(dateString.substring(6, 8), 10);

	//return new Date(year, month, day);
	return year + "-" + month + "-" + day + "T00:00:00.000Z"
}

export async function POST(request: Request) {
	const req = await request.json();

	console.log("NEW RENT REQUEST: ", req)

	/*
	const log = {
		title: 'rentLog breve request',
		data: req
	}
	await storeLogs("rentLogs", log)
	*/

	const name = req["customer_data"]["first_name"] + " " + req["customer_data"]["last_name"];
	const phoneNumber = req["customer_data"]["phone"];
	const email = req["customer_data"]["email"];
	const source = "Breve";
	//const agenzia = req["agency"];
	const agencyCode = "AGENZIA_001";
	const bookingId = req["booking_id"];
	const productId = req["booking_data"]["product_id"];
	const erpId = req["booking_data"]["id_crm"];
	const start = createDateFromYYYYMMDD(req["booking_data"]["booking_start"]); /*2024-04-27 08:44:57*/
	const end = createDateFromYYYYMMDD(req["booking_data"]["booking_end"]); /*2024-05-27 08:44:57*/

	const addNewContact = {
		userId: "1",
		name: name,
		phoneNumber: phoneNumber,
		email: email,
		isConfirmed: true,
		notInterested: false,
		isCommerciant: false,
	};

	console.log("ADD CONTACT: ", addContact)

	const newContact = await addContact({
		contact: addNewContact
	});

	console.log("NEW CONTACT ID: ", newContact)

	const res = await getRentCarByERPId(erpId)

	console.log("GET REND CAR BY ERPID: ", res)

	if (newContact) {
		const addCar = {
			contactId: newContact.id,
			carToBuyId: 0,
			source: source,
			agencyCode: agencyCode,
			userId: "1",
			erpId: erpId,
			make: res ? res.make : "",
			model: res ? res.model : "",
			plate: res ? res.plate : "",
			isMessageSent: false,
			oldNotes: "",
			isConfirmed: false,
			start: start,
			end: end,
			bookingId: bookingId,
			productId: productId,
			rentStatus: "init"
		};

		console.log("ADD CAR: ", addCar)

		const car = await addCarToRent({
			carsToRent: addCar
		});

		console.log("car: ", car)

		//ADD DEAL
		const newDeal = {
			userId: "1",
			agencyCode: agencyCode,
			contactId: newContact.id ? newContact.id : 0,
			stageId: source === "Breve" ? 16 : 20,
			pipelineId: source === "Breve" ? 4 : 5,
			title: name,
			value: 0,
			isAwarded: false,
			isFailed: false,
			carToRentId: car
		};

		console.log("NEW RENT DEAL: ", newDeal)

		const newRentDeal = await addRentDeal({
			deal: newDeal
		});

		console.log("NEW RENT DEAL: ", newRentDeal)

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
			return NextResponse.json({ status: 200, newRentDeal: newRentDeal });
		} else {
			return NextResponse.json({ status: 500, newRentDeal: "" });
		}
	}

	return NextResponse.json({ status: 500, message: "Something went wrong" });
}
