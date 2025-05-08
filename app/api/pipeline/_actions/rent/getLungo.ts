import pool from '@/lib/db';

export default async function getLungo(req: any) {

  const [rowsAgencies]: any = await pool.query(
    `
    SELECT 
        agencies.*
    FROM agencies
    WHERE agencies.code = ?`, [req.agencyCode]
  )

  const [allAgencies]: any = req.agencyCode == 'AGENZIA_001' ? await pool.query(`
    SELECT 
        agencies.*
    FROM agencies`) : await pool.query(
    `
    SELECT 
        agencies.*
    FROM agencies
    WHERE agencies.parentAgency = ? OR agencies.code = 'AGENZIA_001'`, [rowsAgencies[0].parentAgency]
  )

  const agencyCodes = allAgencies.map((agency: any) => agency.code);

  const placeholders = agencyCodes.map(() => '?').join(',');

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
            AND deals.agencyCode IN (${placeholders})
    `, agencyCodes
  );

  const res: any = await pool.query(
    `
        SELECT COUNT(*) 
        FROM deals 
        LEFT JOIN contacts ON deals.contactId = contacts.id 
        WHERE pipelineId = 5
        AND deals.isAwarded = FALSE
        AND deals.isFailed = FALSE
        AND deals.agencyCode IN (${placeholders})
    `, agencyCodes
  );

  const count = res[0][0]['COUNT(*)'];

  return { rows, count };

}
