import pool from '@/lib/db';

export default async function getNotes(req: any) {
	console.log('req: ', req);

	const [rows] = await pool.query(
		`SELECT 
            notes.*
        FROM 
            notes
        WHERE ${req['source'] == 'lead' ? 'notes.carToBuyId = ?' : req['source'] == 'deal' ? 'notes.dealId = ?' : 'notes.carToRentId = ?'}
        LIMIT 50;`,
		req['id']
	);

	return rows;
}
