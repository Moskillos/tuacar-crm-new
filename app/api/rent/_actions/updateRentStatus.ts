import pool from '@/lib/db';

export async function updateRentStatus(req: any) {

	const status = req.status;

	// Create an array of keys and values
	const [rows]: any = await pool.query(
		`
        SELECT 
            deals.id AS dealId, 
            deals.*, 
            carsToRent.productId AS carToRentProductId, 
            carsToRent.bookingId AS carToRentBookingId, 
            carsToRent.start AS carToRentFromDate, 
            carsToRent.end AS carToRentToDate
        FROM deals 
        JOIN carsToRent ON deals.carToRentId = carsToRent.id 
        WHERE deals.id = ?
    `,
		[req.deal.dealId]
	);

	const existingDeal: any = rows[0];
	const existingDealId: any = rows[0].insertId;

	if (!existingDeal) {
		throw new Error('car not found.');
	} else {
		console.log('found deal: ', existingDeal);
	}

	if (status == 'notInterested') {
		//UPDATE DEAL
		const query = `UPDATE deals SET isFailed = TRUE WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);

		const params = {
			action: 'annulla',
			productId: existingDeal?.productId,
			bookingId: existingDeal?.bookingId,
			fromDate: existingDeal?.start,
			toDate: existingDeal?.end,
		};
		//console.log("params: ", params)
		const options = {
			method: 'POST',
			body: JSON.stringify(params),
		};
		await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/rent/manageTuaCarRentCars`,
			options
		)
			.then(res => res.json())
			.then(data => {
				console.log('data: ', data);
			});
	}

	if (status == 'hold') {
		console.log("HOLLLD OK")
		const query = `UPDATE deals SET stageId = 17 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'rented') {
		const query = `UPDATE deals SET stageId = 18 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);

		const params = {
			action: 'confirm',
			productId: existingDeal?.productId,
			bookingId: existingDeal?.bookingId,
			fromDate: existingDeal?.start,
			toDate: existingDeal?.end,
		};
		//console.log("params: ", params)
		const options = {
			method: 'POST',
			body: JSON.stringify(params),
		};
		await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/rent/manageTuaCarRentCars`,
			options
		)
			.then(res => res.json())
			.then(data => {
				console.log('data: ', data);
			});

	}

	if (status == "init") {
		const query = `UPDATE deals SET stageId = 16 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query)
	}

	if (status == 'rientrata') {
		const query = `UPDATE deals SET stageId = 19 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'completed') {
		const query = `UPDATE deals SET stageId = 24 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	//LUNGO TERMINE
	if (status == 'da preventivare') {
		const query = `UPDATE deals SET stageId = 20 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'ricevuta documentazione') {
		const query = `UPDATE deals SET stageId = 21 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'in attesa di esito') {
		const query = `UPDATE deals SET stageId = 22 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'esitata') {
		const query = `UPDATE deals SET stageId = 23 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	if (status == 'completed_long') {
		const query = `UPDATE deals SET stageId = 25 WHERE deals.id = ${req.deal.dealId};`;
		await pool.query(query);
	}

	//UPDATE CAR TO RENT
	if (req.deal.carToRentId) {
		console.log("UPDATE RENT CAR")
		console.log(status)
		console.log(req.deal.carToRentId)
		const query = `UPDATE carsToRent SET rentStatus = ? WHERE id = ?;`;
		await pool.query(query, [status, req.deal.carToRentId]);
	}

	return existingDealId;
}
