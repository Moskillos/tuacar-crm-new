//import { confirmCarToBuyRentStatus } from "@/app/_actions/rent";
import {NextResponse} from 'next/server';

/*

export async function confirmCarToBuyRentStatus(phone: string) {
	const existingCarPhone = await db.query.carsToBuy.findFirst({
		where: and(eq(carsToBuy.advertiser_phone, phone)),
	});

	if (!existingCarPhone) {
		throw new Error("car not found.");
	}

	await db
		.update(carsToBuy)
		.set({
			rentStatus: "interested",
		})
		.where(eq(carsToBuy.id, existingCarPhone.id));

	return existingCarPhone.id;
}

*/

export async function POST(request: Request) {
	const data = await request.json();

	if (data) {
		try {
			if (data.contact.phone.startsWith('+39')) {
				data.contact.phone = data.contact.phone.replace('+39', '');
			}
			const phone = data.contact.phone.startsWith('+39')
				? data.contact.phone.replace('+39', '')
				: data.contact.phone;
			//await confirmCarToBuyRentStatus(phone);
		} catch (error) {
			console.log(error);
			return NextResponse.json({status: 500});
		}
	}

	return NextResponse.json({status: 200});
}
