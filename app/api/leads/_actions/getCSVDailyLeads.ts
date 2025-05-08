'use server';

export default async function getCSVDailyLeads(agencyEmail: any) {
	const response = await fetch(
		`https://api.leads.tua-car.it/leads/lastResult?email=${agencyEmail}`
	);
	const data = await response.json();

	return data;
}