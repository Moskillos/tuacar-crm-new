import pool from '@/lib/db';

export default async function getContactCars(req: any) {
	const [rows] = await pool.query(
		`SELECT 
            cars.*
        FROM 
            cars
        WHERE
            cars.contactId = ?
        LIMIT 50;`,
		[req['contactId']]
	);

	return rows;
}
