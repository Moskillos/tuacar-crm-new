import {generaId} from '@/lib/utils';
import addEmail from '../../emails/_actions/addEmail';

function extractValuesAutosupermarket(emailBody: string) {
	const index = emailBody.indexOf('{');

	if (index !== -1) {
		emailBody = emailBody.substring(index);
	}

	const parsedJson = JSON.parse(emailBody);

	return parsedJson;
}

export default async function addAutoSuperMarket(data: any, agencyCodes: []) {
	// autosupermarket
	if (
		data.FromFull.Email.includes('autosupermarket.it') &&
		data.Subject.includes('Nuova chiamata ricevuta')
	) {
		console.log('autosupermarket.it 1');

		try {
			const ex = extractValuesAutosupermarket(data.TextBody);

			const carName =
				ex['listing']['brand']['name'] + ' ' + ex['listing']['model']['name'];

			console.log('car name: ', carName);

			const index = data.HtmlBody.indexOf('<body');

			if (index !== -1) {
				data.HtmlBody = data.HtmlBody.substring(index);
			}

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: 'autosupermarket.it',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					carName: carName,
					isAssigned: false,
					isVisible: true,
					buyerName: ex['name'] + ' ' + ex['surname'],
					buyerPhone: ex['telephone']['telephone'],
					buyerEmail: ex['email'],
				};
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

	//Un utente sta cercando
	if (
		data.FromFull.Email.includes('autosupermarket.it') &&
		data.Subject.includes('Un utente sta cercando')
	) {
		console.log('autosupermarket.it 2');

		try {
			const ex = extractValuesAutosupermarket(data.TextBody);

			const carName =
				ex['listing']['brand']['name'] + ' ' + ex['listing']['model']['name'];

			console.log('car name: ', carName);

			const index = data.HtmlBody.indexOf('<body');

			if (index !== -1) {
				data.HtmlBody = data.HtmlBody.substring(index);
			}

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: 'autosupermarket.it',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					carName: carName,
					isAssigned: false,
					isVisible: true,
					buyerName: ex['name'] + ' ' + ex['surname'],
					buyerPhone: ex['telephone']['telephone'],
					buyerEmail: ex['email'],
				};
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

	//es. Hai una nuova richiesta di informazioni
	if (
		data.FromFull.Email.includes('autosupermarket.it') &&
		data.Subject.includes('Hai una nuova richiesta di informazioni')
	) {
		console.log('autosupermarket.it 3');

		try {
			const ex = extractValuesAutosupermarket(data.TextBody);

			const carName =
				ex['listing']['brand']['name'] + ' ' + ex['listing']['model']['name'];

			console.log('car name: ', carName);

			const index = data.HtmlBody.indexOf('<body');

			if (index !== -1) {
				data.HtmlBody = data.HtmlBody.substring(index);
			}

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: 'autosupermarket.it',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					carName: carName,
					isAssigned: false,
					isVisible: true,
					buyerName: ex['name'] + ' ' + ex['surname'],
					buyerPhone: ex['telephone']['telephone'],
					buyerEmail: ex['email'],
				};
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

	//es. Un utente ha richiesto il tuo contatto telefonico
	if (
		data.FromFull.Email.includes('autosupermarket.it') &&
		data.Subject.includes('ha richiesto il tuo contatto')
	) {
		console.log('autosupermarket.it 4');

		try {
			const ex = extractValuesAutosupermarket(data.TextBody);

			const carName =
				ex['listing']['brand']['name'] + ' ' + ex['listing']['model']['name'];

			console.log('car name: ', carName);

			const index = data.HtmlBody.indexOf('<body');

			if (index !== -1) {
				data.HtmlBody = data.HtmlBody.substring(index);
			}

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: 'autosupermarket.it',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'),
					carName: carName,
					isAssigned: false,
					isVisible: true,
					buyerName: ex['name'] + ' ' + ex['surname'],
					buyerPhone: ex['telephone']['telephone'],
					buyerEmail: ex['email'],
				};
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

	//es.

	return true;
}
