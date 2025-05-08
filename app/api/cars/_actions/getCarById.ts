import pool from '@/lib/db';

export default async function getCarById(req: any) {
	const [rows]: any = await pool.query(
		`SELECT 
            cars.*
        FROM 
            cars
        WHERE cars.id = ${req['id']}`
	);

	return rows[0];
}
