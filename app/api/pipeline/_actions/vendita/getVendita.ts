import pool from '@/lib/db';

export default async function getVendita(req: any) {
	// Create an array of keys and values
	const [rows] = await pool.query(
		`
        SELECT 
            deals.id AS dealId, 
            deals.*, 
            contacts.name AS contactName, 
            contacts.email AS contactEmail, 
            contacts.phoneNumber AS contactPhoneNumber, 
            cars.id AS carId,
            cars.* 
        FROM deals 
        JOIN contacts ON deals.contactId = contacts.id 
        JOIN cars ON deals.carId = cars.id 
        WHERE pipelineId = 2 
        AND deals.isAwarded = FALSE
        AND deals.isFailed = FALSE
        AND deals.agencyCode = ?
        AND deals.stageId != 20
    `,
		req['agencyCode']
	);

	return rows;
}
