import pool from '@/lib/db';

export default async function getActivityById(req: any) {
	const [rows]: any = await pool.query(
		`SELECT 
            activities.*
        FROM 
            activities
        WHERE activities.id = ${req['id']}`
	);

	return rows[0];
}
