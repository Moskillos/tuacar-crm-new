import pool from '@/lib/db';

export default async function getCarById(req: any) {

    const inGarage = req.inGarage == "true" ? true : false
    const inVendita = req.inVendita == "true" ? true : false

    const [car] = await pool.query(`
        SELECT garage.* 
        FROM garage 
        WHERE id = ?
        AND status = ?
        AND inGarage = ?
        AND inVendita = ?
        ORDER BY createdAt DESC 
    `, [req.carId, req.status, inGarage, inVendita]);

    const [perizia] = await pool.query(`
        SELECT perizie.* 
        FROM perizie 
        WHERE garageId = ?
        AND tipo = 'perizia'
    `, [req.carId]);

    return { car, perizia }
}
