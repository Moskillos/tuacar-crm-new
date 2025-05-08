import pool from '@/lib/db';

export default async function addEmail(data: any) {
	//CONTROLLA SE ESISTE PRIMA
	const [rows]: any = await pool.query(
		`SELECT 
        emailsAds.*
    FROM 
        emailsAds
    WHERE
        emailsAds.agencyCode = ?
        AND emailsAds.emailId = ?
        `,
		[data.agencyCode, data.emailId]
	);

	if (rows.length > 0) {
		console.log('already exist');
		return true;
	} else {
		try {
			const columnsEmail = Object.keys(data).join(', ');
			const valuesEmail = Object.values(data)
				.map(value => {
					if (value === null || value === undefined || value === '') {
						return 'NULL'; // Handle empty, null, or undefined values
					} else if (typeof value === 'string') {
						return `'${value}'`; // Add single quotes for strings
					} else if (typeof value === 'boolean') {
						return value ? 1 : 0; // Convert boolean to 1/0 for SQL
					} else {
						return value; // Numbers or other types are not quoted
					}
				})
				.join(', ');

			const sqlQueryEmail = `INSERT INTO emailsAds (${columnsEmail}) VALUES (${valuesEmail});`;
			const rowEmail: any = await pool.query(sqlQueryEmail);
			const insertIdEmail = rowEmail[0].insertId;

			return insertIdEmail;
		} catch (error) {
			console.error('Database insertion error:', error);
			return false;
		}
	}
}
