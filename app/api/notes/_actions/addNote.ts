import pool from '@/lib/db';

export default async function addNote(req: any) {
	// Step 1: Get the current date and time in Italy's timezone
	const italyDate = new Date().toLocaleString('en-US', {
		timeZone: 'Europe/Rome',
	});

	let localizedDate = new Date(italyDate);

	// Step 2: Adjust the date to reflect the Italy timezone offset
	// Italy is +2 hours ahead of UTC during daylight saving time (CEST)
	//localizedDate.setHours(localizedDate.getHours() + 2); // Adjust by 2 hours

	// Step 3: Convert to ISO string
	const isoString = localizedDate.toISOString();

	req['note']['createdAt'] = isoString;

	//ADD CAR ID -> ASSIGN TO DEAL
	const columnsNote = Object.keys(req['note']).join(', ');
	const valuesNote = Object.values(req['note'])
		.map(value => {
			if (value === null || value === undefined || value === '') {
				return 'NULL'; // Handle empty, null, or undefined values
			} else if (typeof value === 'string') {
				return `'${value.replace(/'/g, "''")}'`; // Escape single quotes in strings
			} else if (typeof value === 'boolean') {
				return value ? 1 : 0; // Convert boolean to 1/0 for SQL
			} else {
				return value; // Numbers or other types are not quoted
			}
		})
		.join(', ');

	const sqlQueryNote = `INSERT INTO notes (${columnsNote}) VALUES (${valuesNote});`;

	const rowNote: any = await pool.query(sqlQueryNote);
	const insertIdNote = rowNote[0].insertId;

	//GET NOTE AND SEND IT BACK
	const [rows] = await pool.query(
		`SELECT 
            notes.*
        FROM 
            notes
        WHERE notes.id = ?`,
		insertIdNote
	);

	return rows;
}
