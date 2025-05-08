import pool from "@/lib/db";

export default async function addPerizia(data: any) {
    
    // Map values for the SQL query
    const columnsPerizia = Object.keys(data).join(', ');
    const valuesPerizia = Object.values(data)
        .map(value => {
            if (value === null || value === undefined || value === '') {
                return 'NULL'; // Handle empty, null, or undefined values
            } else if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`; // Escape single quotes for strings
            } else if (typeof value === 'boolean') {
                return value ? 1 : 0; // Convert boolean to 1/0 for SQL
            } else {
                return value; // Numbers or other types are not quoted
            }
        })
        .join(', ');

    const sqlQueryPerizia = `INSERT INTO perizie (${columnsPerizia}) VALUES (${valuesPerizia});`;

    // Execute the query
    try {
        const rowCar: any = await pool.query(sqlQueryPerizia);
        const insertIdPerizia = rowCar.insertId;
        console.log("perizia: ", insertIdPerizia)
    } catch (error) {
        console.error('Error executing query:', error);
    }
}
