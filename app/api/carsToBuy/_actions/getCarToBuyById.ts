import pool from '@/lib/db';

export default async function getCarToBuyById(req: any) {
	const [rows]: any = await pool.query(
		`SELECT 
            carsToBuy.*
        FROM 
            carsToBuy
        WHERE carsToBuy.id = ${req['id']}`
	);

	return rows[0];
}
