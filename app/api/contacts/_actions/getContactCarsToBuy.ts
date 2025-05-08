import pool from '@/lib/db';

export default async function getContactCarsToBuy(req: any) {
	const [rows] = await pool.query(
		`SELECT 
            carsToBuy.*
        FROM 
            carsToBuy
        WHERE
            carsToBuy.contactId = ?
        LIMIT 50;`,
		[req['contactId']]
	);

	return rows;
}
