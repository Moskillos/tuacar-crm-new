import pool from '@/lib/db';

export default async function getAgencies() {
	const [rows]: any = await pool.query(
		`SELECT 
            agencies.*
        FROM 
            agencies
		WHERE
			agencies.isEnabled = TRUE
		`
	);
	
	return rows;
}
