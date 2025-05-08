import { getSameGroupAgencies } from '@/app/_actions/agencies';
import { extractURL, generaId } from '@/lib/utils';
import getAgencyBySpokiPhone from '../../agencies/_actions/getAgencyBySpokiPhone';
import * as cheerio from 'cheerio';
import addEmail from '../../emails/_actions/addEmail';

export default async function addSpokiLead(data: any) {
	try {
		const agency = await getAgencyBySpokiPhone(
			data.data.to_phone.replace('39', '').replace('+', '')
		);
		//const agency = await getAgencyBySpokiPhone(data.data.to_phone)

		console.log('FOUND AGENCY: ', agency);
		console.log('SPOKI FOUND AGENCY: ', agency?.email);

		//OTTIENI AGENZIE DELLO STESSO GRUPPO.
		const sameGroupAgencies: any = await getSameGroupAgencies(
			agency?.email == 'info@tua-car.it'
				? 'AGENZIA_001'
				: agency?.parentAgency != null
					? agency?.parentAgency
					: agency?.code
		);

		let agencyCodes = sameGroupAgencies.map((item: { code: any }) => item.code);

		console.log(agencyCodes);

		let contactName = 'Cliente';
		const contactPhone = data.data.from_phone;
		let messaggio = data.data.text;

		if (data.data.contact) {
			contactName = data.data.contact.first_name;
		}

		if (agency) {
			// VARIANTE 1 - AutoScout
			if (messaggio.includes('autoscout')) {
				console.log('Lead autoscout');

				const url = extractURL(messaggio);

				const response = await fetch(url);
				const html = await response.text();

				const $ = cheerio.load(html);

				const carName = $('h1.StageTitle_title__ROiR4').text().trim();

				const imgSrc = $('picture.ImageWithBadge_picture__XJG24 img').attr(
					'src'
				);

				messaggio =
					messaggio +
					"<br><img src='" +
					imgSrc +
					"' height='512' width='650' />";

				const Subject = 'Spoki - ' + carName;

				const groupId = generaId();

				for (const item of agencyCodes) {
					const newEmailAd = {
						emailId: data.data.uuid,
						agencyCode: item,
						url: url,
						subject: Subject,
						groupId: groupId,
						htmlBody: messaggio
							.trim()
							.replace(/\n/g, '') // Remove newlines
							.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
							.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
							.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
							.replace(/\[/g, '\\[') // Escape square brackets
							.replace(/\]/g, '\\]'), // Escape square brackets
						carName: carName,
						isAssigned: false,
						isVisible: true,
						buyerName: contactName,
						buyerEmail: '',
						buyerPhone: contactPhone,
					};

					const newLead = await addEmail(newEmailAd);

					if (newLead) {
						console.log('new Spoki Lead: ', newLead);
					}
				}
			}
			else if (messaggio.includes('autosupermarket.it') || messaggio.includes('AutoSupermarket')) {
				// VARIANTE 2 - Autosupermarket
				console.log('Lead autosupermarket');

				const url = extractURL(messaggio);

				// Extract car details from the message first
				const marcaMatch = messaggio.match(/Marca:\s*([^\n]+)/);
				const modelloMatch = messaggio.match(/Modello:\s*([^\n]+)/);

				let carName = '';
				if (marcaMatch && modelloMatch) {
					carName = `${marcaMatch[1].trim()} ${modelloMatch[1].trim()}`;
				}

				// If we couldn't extract from message, try fetching from URL
				if (!carName && url) {
					try {
						const response = await fetch(url);
						const html = await response.text();
						const $ = cheerio.load(html);
						carName = $('h1.vehicle-title').text().trim();
					} catch (error) {
						console.error('Error fetching car details:', error);
					}
				}

				const Subject = 'Spoki - ' + (carName || 'Richiesta info Auto');

				const groupId = generaId();

				for (const item of agencyCodes) {
					const newEmailAd = {
						emailId: data.data.uuid,
						agencyCode: item,
						url: 'autosupermarket.it',
						subject: Subject,
						groupId: groupId,
						htmlBody: messaggio
							.trim()
							.replace(/\n/g, '')
							.replace(/\s+/g, ' ')
							.replace(/'/g, "\\'")
							.replace(/"/g, '\\"')
							.replace(/\[/g, '\\[')
							.replace(/\]/g, '\\]'),
						carName: carName,
						isAssigned: false,
						isVisible: true,
						buyerName: contactName,
						buyerEmail: '',
						buyerPhone: contactPhone,
					};

					const newLead = await addEmail(newEmailAd);

					if (newLead) {
						console.log('new Spoki Lead: ', newLead);
					}
				}
			}
			// VARIANTE 3 - Generic Information Request
			else if (
				messaggio.toLowerCase().includes('maggiori informazioni') &&
				!messaggio.includes('autoscout')
			) {
				const groupId = generaId();

				for (const item of agencyCodes) {
					const newEmailAd = {
						emailId: data.data.uuid,
						agencyCode: item,
						url: 'tua-car',
						subject: 'Richiesta info Tua-Car',
						groupId: groupId,
						htmlBody: messaggio
							.trim()
							.replace(/\n/g, '')
							.replace(/\s+/g, ' ')
							.replace(/'/g, "\\'")
							.replace(/"/g, '\\"')
							.replace(/\[/g, '\\[')
							.replace(/\]/g, '\\]'),
						carName: '',
						isAssigned: false,
						isVisible: true,
						buyerName: contactName,
						buyerEmail: '',
						buyerPhone: contactPhone,
					};

					const newLead = await addEmail(newEmailAd);

					if (newLead) {
						console.log('new Spoki Lead: ', newLead);
					}
				}
			}
		}
	} catch (error: any) {
		console.error('Error storing Spoki Lead', error);
		return { msg: 'Error', error: error.message };
	}
}
