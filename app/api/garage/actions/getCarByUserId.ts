import pool from '@/lib/db';

export default async function getCarByUserId(req: any) {

    // Extract and convert request parameters
    const inGarage = req.inGarage === "true" ? true : req.inGarage === "false" ? false : null;
    const inVendita = req.inVendita === "true" ? true : req.inVendita === "false" ? false : null;

    // Initialize query components
    let query = `
    SELECT garage.* 
    FROM garage 
    WHERE userId = ?
`;
    const params = [req.userId];

    // Conditionally add filters based on the presence of parameters
    if (inGarage !== null) {
        query += ` AND inGarage = ?`;
        params.push(inGarage);
    }

    if (inVendita !== null) {
        query += ` AND inVendita = ?`;
        params.push(inVendita);
    }

    // Add the ordering clause
    query += ` ORDER BY createdAt DESC`;

    // Execute the query
    const [car] = await pool.query(query, params);

    /*
    const [perizia] = await pool.query(`
        SELECT perizie.* 
        FROM perizie 
        WHERE userId = ?
        AND tipo = 'perizia'
    `, [req.userId]);
    */

    return { car }
}
