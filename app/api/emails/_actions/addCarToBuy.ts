import pool from '@/lib/db';

export default async function addCarToBuy(data: any) {
	let existingCar = null;

	if (data.url != 'indicata.com' && data.url != 'tcm') {
		const [rows]: any = await pool.query(`
            SELECT carsToBuy.* 
            FROM carsToBuy 
            WHERE carsToBuy.csvId = ${data.csvId}
            AND carsToBuy.csvUrn = ${data.csvUrn}
        `);
		existingCar = rows[0];
	}
	if (
		data.url == 'indicata.com' &&
		data.mileage_scalar &&
		data.advertiser_name
	) {
		const [rows]: any = await pool.query(`
            SELECT carsToBuy.* 
            FROM carsToBuy 
            WHERE carsToBuy.mileage_scalar = ${data.mileage_scalar}
            AND carsToBuy.advertiser_name = ${data.advertiser_name} 
            AND carsToBuy.agencyCode = ${data.agencyCode}
        `);
		existingCar = rows[0];
	}
	if (data.url == 'tcm') {
		const [rows]: any = await pool.query(`
            SELECT carsToBuy.* 
            FROM carsToBuy 
            WHERE carsToBuy.csvId = ${data.csvId}
            AND carsToBuy.csvUrn = ${data.csvUrn}
        `);

		existingCar = rows[0];
	}

	if (existingCar) {
		console.log('exist: ', existingCar);
		return null;
	} else {
		console.log('new car insert');

		const columnsCar = Object.keys(data).join(', ');
		const valuesCar = Object.values(data)
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

		const sqlQueryCar = `INSERT INTO carsToBuy (${columnsCar}) VALUES (${valuesCar});`;

		const rowCar: any = await pool.query(sqlQueryCar);

		const insertIdCar = rowCar[0].insertId;

		return insertIdCar;
	}
}
