import * as cheerio from 'cheerio';
import axios from 'axios';
import addEmail from '../../emails/_actions/addEmail';
import { generaId } from '@/lib/utils';

//richiesta sito tua-car
function extractInformation(text: string) {
	// Regular expressions to match the required patterns
	const nameRegex = /Nome e Cognome:\s*(.+)<br>/;
	const emailRegex = /E-mail:\s*(.+)<br>/;
	const urlRegex = /URL della Pagina:\s*(https?:\/\/[^\s<]+)/;

	// Extracting the matches
	const nameMatch = text.match(nameRegex);
	const emailMatch = text.match(emailRegex);
	const urlMatch = text.match(urlRegex);

	// Extracting the required information
	const name = nameMatch ? nameMatch[1] : null;
	const email = emailMatch ? emailMatch[1] : null;
	const url = urlMatch ? urlMatch[1] : null;

	return { name, email, url };
}

/*
function extractImageSrc(inputString) {
	const imgSrcRegex = /<img\s+src=\\"(.*?)\\"/;
	const match = inputString.match(imgSrcRegex);
	return match ? match[1] : null;
}
*/

export default async function addTuaCar(data: any, agencyCodes: []) {
	async function getHTMLCode(url: string) {
		try {
			const { data } = await axios.get(url);

			const $ = cheerio.load(data);

			const elements: Array<string> = [];
			$('span.elementor-icon-list-text').each((i, elem) => {
				elements.push($(elem).text()); // Use .text() if you only need the visible text
			});

			const imageUrl = $('img[src*="manager-api.tuacar"]').attr('src');

			elements.push(imageUrl ? imageUrl : '');

			return elements;
		} catch (error) {
			return [];
		}
	}

	//sito tua-car
	if (
		(data.FromFull.Email.includes('tua-car') &&
			data.Subject.includes('Nuova richiesta veicolo dal sito TUACAR')) ||
		data.Subject.includes('Nuovo messaggio da "Tua Car"')
	) {
		try {
			const extractedInfo = extractInformation(data.HtmlBody);
			const contactName = extractedInfo.name
				? extractedInfo.name.split('<br>')[0]
				: '';
			const contactEmail = extractedInfo.email
				? extractedInfo.email.split('<br>')[0]
				: '';
			const url = extractedInfo.url ? extractedInfo.url.split('<br>')[0] : '';

			const autoDetails = await getHTMLCode(url);

			let marcaAuto = '';
			let modelloAuto = '';
			let allestimento = '';

			autoDetails.map((d: string) => {
				if (d.includes('Marca')) {
					marcaAuto = d.replace('Marca: ', '');
				}
				if (d.includes('Modello')) {
					modelloAuto = d.replace('Modello: ', '');
				}
				if (d.includes('Allestimento')) {
					allestimento = d.replace('Allestimento: ', '');
				}
			});

			const nomeAuto = marcaAuto + ' ' + modelloAuto + ' ' + allestimento;

			const newHtmlBody = autoDetails[autoDetails.length - 1] != undefined ?
				data.HtmlBody +
				`<img src="${autoDetails[autoDetails.length - 1]}" height="512" width="650" alt="Impossibile recuperare l'immagine del veicolo. L'annuncio potrebbe essere stato rimosso o la foto eliminata' />` : data.HtmlBody + "<p>Impossibile recuperare l'immagine del veicolo. L'annuncio potrebbe essere stato rimosso o la foto eliminata</p>"

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: url,
					subject: nomeAuto,
					groupId: groupId,
					htmlBody: newHtmlBody
						.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					body: '',
					carName: nomeAuto,
					isAssigned: false,
					isVisible: true,
					buyerName: contactName,
					buyerPhone: null,
					buyerEmail: contactEmail,
				};

				console.log("new email ad: ", newEmailAd)

				const newEmail = await addEmail(newEmailAd);

				if (newEmail) {
					console.log(`newEmail ${item}`, newEmail);
				} else {
					return false;
				}
			}
		} catch (err) {
			console.log('error: ', err);
			return false;
		}
	}

	return true;
}
