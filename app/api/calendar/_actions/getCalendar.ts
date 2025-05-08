import pool from '@/lib/db';

export default async function getCalendar(req: any) {
	const [rows] = await pool.query(
		`SELECT 
            activities.*,
            contacts.name AS contactName, 
            contacts.email AS contactEmail, 
            contacts.phoneNumber AS contactPhoneNumber,
            contacts.label AS contactLabel,
            deals.title AS dealTitle,
            deals.pipelineId AS dealPipelineId,
            cars.make AS carMake,
            cars.model AS carModel,
            cars.erpId AS carErpId,
            carsToBuy.description AS carToBuyDescription,
            carsToRent.description AS carToRentDescription
        FROM 
            activities
        LEFT JOIN contacts ON activities.contactId = contacts.id
        LEFT JOIN deals ON activities.dealId = deals.id
        LEFT JOIN cars ON activities.carId = cars.id
        LEFT JOIN carsToBuy ON activities.carToBuyId = carsToBuy.id
        LEFT JOIN carsToRent ON activities.carToRentId = carsToRent.id
        WHERE activities.agencyCode = ?
        ORDER BY createdAt DESC
        LIMIT 50;`,
		req['agency']
	);
	const res: any = await pool.query('SELECT COUNT(*) FROM activities;');
	const count = res[0][0]['COUNT(*)'];

	return {rows, count};
}
