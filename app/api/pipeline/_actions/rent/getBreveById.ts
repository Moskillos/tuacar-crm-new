import pool from '@/lib/db';

export default async function getBreveById(req: any) {

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
        carsToRent.id AS carToRentId,
        carsToRent.rentStatus AS carToRentStatus,
        carsToRent.* 
    FROM deals
    LEFT JOIN contacts ON deals.contactId = contacts.id 
    LEFT JOIN carsToRent ON deals.carToRentId = carsToRent.id 
    WHERE pipelineId = 4 
        AND deals.isAwarded = FALSE
        AND deals.isFailed = FALSE
        AND deals.id = ?
    `, [req.id]
  );

  return rows

}
