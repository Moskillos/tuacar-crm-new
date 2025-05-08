import pool from '@/lib/db';

export default async function checkIfAssigned(req: any) {
	const [rows] = await pool.query(
		`
        SELECT carsToBuy.*
        FROM carsToBuy
        WHERE csvUrn IN (?);
    `,
		[req['csvUrns']]
	);

	return rows;
}
