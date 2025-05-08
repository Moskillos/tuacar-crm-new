import pool from '@/lib/db';

export default async function getAcquisizione(req: any) {
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
            AND deals.isFailed = FALSE
            AND deals.agencyCode = ?
            AND deals.stageId != 20
            AND (deals.carToBuyId IS NULL OR carsToBuy.isSold = FALSE);
    `,
		req['agencyCode']
	);

	return rows;
}
