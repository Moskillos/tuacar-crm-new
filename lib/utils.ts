import { Lead } from '@/app/leads/list/components/lead';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrencyEUR(amount: any) {
	return new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
	}).format(amount);
}

export async function getListTowns(agencyEmail: string) {
	const res = await fetch(
		`https://api.leads.tua-car.it/location/comuniByUser?userMail=${agencyEmail}`
	);
	const data = await res.json();
	const towns = JSON.stringify({ comuni: data.comuni });
	return towns;
}

export async function getListLeads(searchParams: any, towns: string) {
	const response = await fetch(
		`https://api.leads.tua-car.it/leads/search?annoA=${searchParams.yearTo}&annoDa=${searchParams.yearFrom}&kmA=${searchParams.mileageTo}&kmDa=${searchParams.mileageFrom}&platform=${searchParams.platform} `,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: towns,
		}
	);
	const data = await response.json();
	return data.res.data;
}

export function creaPreventivo(erpId: string, contactId: string) {
	window.open(
		`https://manager.tuacar.it/erp/gestione-vendite/preventivi/new/${erpId}(menu:erp)?idContactCrm=${contactId}`,
		'_blank'
	);
}

export function goToERP(carId: string) {
	window.open(
		`https://manager.tuacar.it/erp/car-fleet/${carId}/edit?menu=erp`,
		'_blank'
	);
}

export function goToERPHome() {
	window.open(`https://manager.tuacar.it/erp/`, '_blank');
}

export function signOut() {
	window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`;
}

export async function getSpokiConfig(agencyEmail: string) {
	const res = await fetch(
		`https://api.leads.tua-car.it/user/getSpoki?userMail=${agencyEmail}`
	);
	const data = await res.json();

	return data.user_data;
}

export function convertToItalyTime(dateString: any) {
	const date = new Date(dateString);
	// Convert the date to Italy's time zone (UTC+2 during Daylight Saving Time)
	const options = { timeZone: 'Europe/Rome', hour12: false };
	return date.toLocaleString('en-GB', options).replace(',', ' ');
}

const logoMap: any = {
	autoscout: '/autoscout24.svg',
	subito: '/subito.svg',
	autosupermarket: '/autosupermarket.svg',
	tcm: '/tuacar.png',
	'tua-car': '/tuacar.png'
};

export function getLogoPortale(url: string) {
	for (const key in logoMap) {
		if (url && url.includes(key)) {
			return logoMap[key];
		}
	}
	return '/mail.png'; // Default image
}
export function generaId() {
	const timestamp = Date.now();
	const rand = Math.random().toString(36).substring(2, 15);
	return `${timestamp}-${rand}`;
}

export function extractURL(message: string) {
	// Regular expression to match URLs
	const urlRegex = /https?:\/\/[^\s]+/g;
	// Find the first URL in the message
	const found = message.match(urlRegex);
	return found ? found[0] : '';
}


export function getNameByUserId(data: any, userId: any) {
	const user = data.find((item: any) => item.userId === userId);
	return user ? user.name : null;
}

export function leadMapper(data: any) {
	const leads: Lead[] = []
	for (var d of data) {
		const lead: Lead = {
			id: d.id,
			contactId: d.contactId,
			agencyCode: d.agencyCode,
			dateRemote: d.dateRemote,
			fuel: d.fuel,
			mileageScalar: d.mileage_scalar,
			registerDate: d.register_date,
			advertiserName: d.advertiser_name,
			advertiserPhone: d.advertiser_phone,
			price: d.price,
			url: d.url,
			userId: d.userId,
			description: d.description,
			isConfirmed: d.isConfirmed,
			manualSearch: d.manualSearch,
			isMessageSent: d.isMessageSent,
			createdAt: d.createdAt,
			oldNotes: d.oldNotes,
			rentStatus: d.rentStatus,
			advertiserCity: d.advertiser_city,
			csvUrn: d.csvUrn,
			csvId: d.csvId,
			geoRegion: d.geo_region,
			geoProvincia: d.geo_provincia,
			geoTown: d.geo_town,
			isSold: d.isSold,
			isVisible: d.isVisible,
			spokiInterested: d.spokiInterested,

			contactName: d.contactName,
			contactEmail: d.contactEmail,

			contactPhoneNumber: d.contactPhoneNumber,
			contactNotInterested: d.contactNotInterested,
			contactIsConfirmed: d.contactIsConfirmed,
			contactIsCommerciant: d.contactIsCommerciant,
			notesCount: d.notesCount,
		}
		leads.push(lead);
	}
	return leads;
}