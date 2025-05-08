import pool from '@/lib/db';

export default async function getCarByContactId(req: any) {

    // Extract and convert request parameters
    const inGarage = req.inGarage === "true" ? true : req.inGarage === "false" ? false : null;
    const inVendita = req.inVendita === "true" ? true : req.inVendita === "false" ? false : null;

    // Initialize query components
    let query = `
        SELECT garage.* 
        FROM garage 
        WHERE contactId = ?
    `;
    const params = [req.contactId];

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


    //GET ID OF THE CAR AND THEN FIND ALSO THE PERIZIA!

    return { car }
}
