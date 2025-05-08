"use server";

function formatReadableDate(dateString: any) {
	const date = new Date(dateString);

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export async function sendUpdatedRentDatesViaSpoki(deal: any, start: Date, end: Date) {
	try {
		const res = await fetch("https://app.spoki.it/wh/ap/efc8cb69-583b-4d2a-b264-9063e9a71ea2/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret: "649b0c42496542d3a650bc534a2ea11a",
				phone: deal?.contact?.phoneNumber,
				first_name: deal?.contact && deal?.contact.name.length > 0 ? deal?.contact.name : "Gentile Cliente",
				last_name: "",
				email: "",
				custom_fields: {
					FIRST_NAME: deal?.contact && deal?.contact.name.length > 0 ? deal?.contact.name : "Gentile Cliente",
					DATA_NOLEGGIO: formatReadableDate(start),
					DATA_NOLEGGIO_CONSEGNA: formatReadableDate(end),
				},
			}),
		});

		console.log("SEND SPOKI RENT RESA: ", res)

		return { msg: "Success" };
	} catch (error) {
		console.log(error);
		return { msg: "Error" };
	}
}