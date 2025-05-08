function formatReadableDate(dateString: any) {
	const date = new Date(dateString);

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export default async function sendRentDates(deal: any) {
	try {
		await fetch(
			'https://app.spoki.it/wh/ap/efc8cb69-583b-4d2a-b264-9063e9a71ea2/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					secret: '649b0c42496542d3a650bc534a2ea11a',
					phone: deal?.contactPhoneNumber,
					first_name:
						deal?.contactName.length > 0
							? deal?.contactName
							: 'Gentile Cliente',
					last_name: '',
					email: '',
					custom_fields: {
						FIRST_NAME:
							deal?.contactName.length > 0
								? deal?.contactName
								: 'Gentile Cliente',
						DATA_NOLEGGIO: formatReadableDate(deal?.start),
						DATA_NOLEGGIO_CONSEGNA: formatReadableDate(deal?.end),
					},
				}),
			}
		);

		return { msg: 'Success' };
	} catch (error) {
		console.log(error);
		return { msg: 'Error' };
	}
}
