import pool from '@/lib/db';

export default async function getCars(req: any) {

    const inGarage = req.inGarage == "true" ? true : false
    const inVendita = req.inVendita == "true" ? true : false

    const [rows] = await pool.query(`
        SELECT garage.* 
        FROM garage 
        WHERE status = ?
        AND inGarage = ?
        AND inVendita = ?
        ORDER BY createdAt DESC 
        LIMIT ?
        OFFSET ?
    `, [req.status, inGarage, inVendita, parseInt(req.limit), parseInt(req.offset) == 1 ? 0 : parseInt(req.offset) * parseInt(req.limit)]);

    const res: any = await pool.query(`
        SELECT COUNT(*) 
        FROM garage 
        WHERE status = ?
        AND inGarage = ?
        AND inVendita = ?
    `, [req.status, inGarage, inVendita]);
    const count = res[0][0]['COUNT(*)'];

    return { rows, count };
}
