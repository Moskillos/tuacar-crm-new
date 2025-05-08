import pool from '@/lib/db';

function resetStartToMidnight(dateString: string) {
	let date = new Date(dateString);
	date.setUTCHours(0, 0, 0, 0);
	return date.toISOString();
}

function setEndOfDay(dateString: string) {
	let date = new Date(dateString);
	date.setUTCHours(23, 59, 59, 999);
	return date.toISOString();
}

function addTwoHoursToDate(dateStr: any) {
	// Parse the input date string into a Date object
	let date = new Date(dateStr);

	// Add 2 hours (2 * 60 * 60 * 1000 milliseconds)
	date.setTime(date.getTime() + 2 * 60 * 60 * 1000);

	// Format the updated date back to ISO 8601 string (with 'Z' at the end)
	return date.toISOString();
}

export default async function getFailedAcquisizione(req: any) {
	let startDate = req['startDate'];
	let endDate = req['endDate'];

	let newStartDate = addTwoHoursToDate(startDate);
	let newEndDate = addTwoHoursToDate(endDate);

	let startDateFinal = resetStartToMidnight(newStartDate);
	let endDateFinal = setEndOfDay(newEndDate);

	// Create an array of keys and values
	const [rows] = await pool.query(
		`
       SELECT 
            deals.*, 
            deals.id AS dealId, 
            deals.userId AS dealUserId,
            contacts.id AS dealContactId,
            contacts.name AS contactName, 
            contacts.email AS contactEmail, 
            contacts.phoneNumber AS contactPhoneNumber, 
            contacts.isCommerciant AS contactIsCommerciant,
            contacts.notInterested AS contactNotInterested,
            carsToBuy.id AS carToBuyId,
            carsToBuy.* 
        FROM deals 
        LEFT JOIN contacts ON deals.contactId = contacts.id 
        LEFT JOIN carsToBuy ON deals.carToBuyId = carsToBuy.id 
        WHERE pipelineId = 3 
        AND deals.isAwarded = FALSE
        AND deals.isFailed = TRUE
        AND deals.agencyCode = ?
        AND deals.createdAt > ?
        AND deals.createdAt < ? 
        AND deals.stageId != 20
        LIMIT ?
    `,
		[req['agencyCode'], startDateFinal, endDateFinal, req['dealsLimit']]
	);

	const res: any = await pool.query(
		`
        SELECT COUNT(*) 
        FROM deals 
        LEFT JOIN contacts ON deals.contactId = contacts.id 
        LEFT JOIN carsToBuy ON deals.carToBuyId = carsToBuy.id 
        WHERE pipelineId = 3 
        AND deals.isAwarded = FALSE
        AND deals.isFailed = TRUE
        AND deals.agencyCode = ?
        AND deals.createdAt > ?
        AND deals.createdAt < ? 
        AND deals.stageId != 20
    `,
		[req['agencyCode'], startDateFinal, endDateFinal]
	);

	const count = res[0][0]['COUNT(*)'];

	return {rows, count};
}

/*
{
    "dealId": 6386,
    "id": 4316,
    "userId": "auth0|6613a59911464295031eafe5",
    "stageId": 7,
    "title": "Toyota Rav4",
    "value": 13900,
    "oldNotes": "",
    "end": null,
    "isAwarded": 1,
    "createdAt": "2024-06-25T12:49:49.000Z",
    "contactId": 85407,
    "isFailed": 0,
    "pipelineId": 2,
    "agencyCode": "AGENZIA_002",
    "carToBuyId": null,
    "carId": 4316,
    "carToRentId": null,
    "emailId": null,
    "contactName": "Pecora Giuseppe",
    "contactEmail": null,
    "contactPhoneNumber": "3331438200",
    "make": "Toyota",
    "model": "RAV 4",
    "firstRegistrationDate": "12-2015",
    "mileage": 90000,
    "powerKw": 91,
    "powerCv": 122,
    "fuelType": null,
    "color": "Blu",
    "price": 13900,
    "plate": "FB059JG",
    "insertedDate": "2024-05-11T07:46:43.244Z",
    "description": null,
    "erpId": "663f2263430797c0edfd8c9d",
    "isConfirmed": 1,
    "url": ""
}]
*/
