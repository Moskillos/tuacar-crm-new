import pool from '@/lib/db';

export default async function getPeriziaByCarId(req: any) {

    /*
    tipo =
    perizia
    dichiarazione
    */
    const [row] = await pool.query(`
        SELECT perizie.* 
        FROM perizie 
        WHERE garageId = ?
        AND tipo = ?
    `, [req.carId, req.tipo]);

    return row
}
