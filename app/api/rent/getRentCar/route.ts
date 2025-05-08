import { getRentCarCalendar } from "@/app/api/rent/_actions/getRentCarCalendar";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	const req = await request.json();
	//GET CAR CALENDAR

	const carRentedDays = await getRentCarCalendar(req["erpId"]);

	try {
		return NextResponse.json({ status: 200, deals: carRentedDays.length > 0 ? carRentedDays : [] });
	} catch (error) {
		console.error("Error:", error);
	}

	return NextResponse.json({ status: 200, deals: [] });
}
