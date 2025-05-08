import pool from '@/lib/db';

export default async function getContactDeals(req: any) {
	const [rows] = await pool.query(
		`SELECT 
            deals.*
        FROM 
            deals
        WHERE
            deals.contactId = ?
        LIMIT 50;`,
		[req['contactId']]
	);

	return rows;
}
