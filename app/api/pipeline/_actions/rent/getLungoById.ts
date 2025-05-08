import pool from '@/lib/db';

export default async function getLungoById(req: any) {

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
          contacts.notInterested AS contactNotInterested
      FROM deals
      LEFT JOIN contacts ON deals.contactId = contacts.id 
    WHERE pipelineId = 5 
        AND deals.isAwarded = FALSE
        AND deals.isFailed = FALSE
        AND deals.id = ?
    `, [req.id]
  );

  return rows

}
