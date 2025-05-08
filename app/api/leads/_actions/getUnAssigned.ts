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

export default async function getUnAssigned(req: any) {
	let startDate = req['startDate'];
	let endDate = req['endDate'];

	let newStartDate = addTwoHoursToDate(startDate);
	let newEndDate = addTwoHoursToDate(endDate);

	let startDateFinal = req.search === '' ? resetStartToMidnight(newStartDate) : '1970-01-01T00:00:00.000Z';
	let endDateFinal = req.search === '' ? setEndOfDay(newEndDate) : '2999-12-31T23:59:59.999Z';

	let searchClause = "AND TRUE";

	if (req.search && req.search.trim() !== '') {
		searchClause = `
			AND (
				LOWER(carsToBuy.description) LIKE LOWER(?) OR 
				LOWER(carsToBuy.advertiser_name) LIKE LOWER(?) OR
				LOWER(carsToBuy.advertiser_phone) LIKE LOWER(?) OR
				LOWER(contacts.name) LIKE LOWER(?) OR 
				LOWER(contacts.email) LIKE LOWER(?) OR
				LOWER(contacts.phoneNumber) LIKE LOWER(?)
			)
		`;
		searchClause = searchClause.replaceAll('?', "'%" + req.search + "%'")
	}

	const [rows] = await pool.query(
		`
        SELECT carsToBuy.*,
        contacts.name AS contactName, contacts.email AS contactEmail, contacts.phoneNumber AS contactPhoneNumber, contacts.notInterested AS contactNotInterested, contacts.isConfirmed AS contactIsConfirmed, contacts.isCommerciant AS contactIsCommerciant,
        COUNT(notes.id) AS notesCount
		FROM carsToBuy
		FROM carsToBuy
        JOIN contacts ON carsToBuy.contactId = contacts.id
		LEFT JOIN notes ON carsToBuy.id = notes.carToBuyId
        WHERE carsToBuy.isConfirmed = FALSE
        AND carsToBuy.manualSearch = FALSE
        AND carsToBuy.agencyCode = ?
        AND contacts.notInterested = FALSE
        AND contacts.isCommerciant = FALSE
        AND carsToBuy.createdAt > ? 
        AND carsToBuy.createdAt < ?
        AND carsToBuy.isSold = 0
		AND carsToBuy.isVisible = TRUE
		${searchClause}
        GROUP BY carsToBuy.id, contacts.id
		ORDER BY carsToBuy.createdAt DESC
        LIMIT ?
		OFFSET ?
    `,
		[req.agency, startDateFinal, endDateFinal, req.limit, req.offset == 1 ? 0 : req.offset * req.limit]
	);

	const res: any = await pool.query(
		`
        SELECT COUNT(*) 
        FROM carsToBuy
        JOIN contacts ON carsToBuy.contactId = contacts.id
        WHERE carsToBuy.isConfirmed = FALSE
        AND carsToBuy.manualSearch = FALSE
        AND carsToBuy.agencyCode = ?
        AND contacts.notInterested = FALSE
        AND contacts.isCommerciant = FALSE
        AND carsToBuy.createdAt > ? 
        AND carsToBuy.createdAt < ?
        AND carsToBuy.isSold = 0
		AND carsToBuy.isVisible = TRUE
    `,
		[req.agency, startDateFinal, endDateFinal]
	);
	const count = res[0][0]['COUNT(*)'];

	return { rows, count };
}
