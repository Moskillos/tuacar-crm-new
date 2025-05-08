import pool from '@/lib/db';

export default async function getContacts(req: any) {

	const [rows] = await pool.query(
		`SELECT 
            contacts.*, 
            deals.title AS dealTitle, 
            deals.id AS dealId, 
            deals.createdAt AS dealCreatedAt
        FROM 
            contacts
        JOIN 
            deals 
        ON 
            contacts.id = deals.contactId
        WHERE contacts.agencyCode = ?
        ORDER BY contacts.createdAt DESC
        LIMIT 50;`,
		[req['agencyCode']]
	);
	const res: any = await pool.query('SELECT COUNT(*) FROM contacts;');
	const count = res[0][0]['COUNT(*)'];

	return {rows, count};
}
