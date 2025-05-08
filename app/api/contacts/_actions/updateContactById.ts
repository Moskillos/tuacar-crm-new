import pool from '@/lib/db';

export default async function updateContactById(req: any) {
	const validLabels = ['potenziale_cliente', 'potenziale_fornitore'];

	// Check if the provided label is valid
	const label = validLabels.includes(req['contact']['label'])
		? req['contact']['label']
		: null;

	// Define the SQL query with placeholders for parameters
	const sqlQueryCar = `
        UPDATE contacts 
        SET 
            name = ?, 
            email = ?, 
            phoneNumber = ?, 
            label = ?
        WHERE 
            contacts.id = ?;
    `;

	// Prepare the values array, including label validation

	const values = [
		req['contact']['name'],
		req['contact']['email'],
		req['contact']['phoneNumber'],
		label, // Pass the valid ENUM value or NULL
		req['id'],
	];

	// Execute the query with the parameterized values
	await pool.query(sqlQueryCar, values);

	return true;
}
