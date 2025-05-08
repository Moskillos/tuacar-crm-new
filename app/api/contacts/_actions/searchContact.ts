import pool from '@/lib/db';

export default async function searchContact(req: any) {
  req['search'] = `%${req['search']}%`;

  console.log("REQ SEARCH: ", req)

  const [rows] = await pool.query(
    `
        SELECT contacts.*, 
              deals.title AS dealTitle, 
              deals.id AS dealId, 
              deals.createdAt AS dealCreatedAt 
        FROM contacts 
        LEFT JOIN deals ON contacts.id = deals.contactId 
        WHERE (LOWER(name) LIKE LOWER(?) 
              OR LOWER(email) LIKE LOWER(?) 
              OR LOWER(phoneNumber) LIKE LOWER(?))
          AND contacts.agencyCode = ?
        ORDER BY contacts.createdAt DESC
        LIMIT 100;
      `,
    [req['search'], req['search'], req['search'], req['agencyCode']]
  );

  const res: any = await pool.query(
    `SELECT COUNT(*) 
      FROM contacts 
      WHERE LOWER(name) LIKE LOWER(?)
            OR LOWER(email) LIKE LOWER(?)
            OR (LOWER(phoneNumber) LIKE LOWER(?) AND contacts.agencyCode = ?)
      `,
    [req['search'], req['search'], req['search'], req['agencyCode']]
  );

  const count = res[0][0]['COUNT(*)'];

  return { rows, count };
}
