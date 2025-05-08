import pool from '@/lib/db';

export default async function addContact(req: any) {
	// Process the contact data with specific type conversions
	const processValue = (value: any) => {
		if (value === null || value === undefined || value === '') {
			return null; // Use null for database instead of 'NULL' string
		} else if (typeof value === 'string') {
			return value; // Keep string as-is, let database handle quoting
		} else if (typeof value === 'boolean') {
			return value ? 1 : 0; // Convert boolean to 1/0 for SQL
		} else {
			return value; // Numbers or other types remain unchanged
		}
	};

	// Prepare columns and values
	const columns = Object.keys(req['contact']);
	const values = columns.map(key => processValue(req['contact'][key]));

	// Construct and execute insert query
	const placeholders = columns.map(() => '?').join(', ');
	const sqlQueryContact = `INSERT INTO contacts (${columns.join(', ')}) VALUES (${placeholders})`;

	const rowContact: any = await pool.query(sqlQueryContact, values);

	const insertIdContact = rowContact[0].insertId;

	//GET NEW CONTACT
	const [rows]: any = await pool.query(
		`
        SELECT contacts.*, 
               deals.title AS dealTitle, 
               deals.id AS dealId, 
               deals.createdAt AS dealCreatedAt 
        FROM contacts 
        LEFT JOIN deals ON contacts.id = deals.contactId 
        WHERE contacts.id = ?
        `,
		insertIdContact
	);

	return rows[0];
}
