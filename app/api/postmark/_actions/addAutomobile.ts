import * as cheerio from 'cheerio';
import addEmail from '../../emails/_actions/addEmail';
import {generaId} from '@/lib/utils';

export default async function addAutomobile(data: any, agencyCodes: []) {
	// automobile.it
	if (
		data.FromFull.Email.includes('automobile.it') &&
		data.Subject.includes('Nuovo contatto')
	) {
		try {
			const $ = cheerio.load(data.HtmlBody);

			const tdTags = $('td')
				.toArray()
				.map(element => $(element).text());

			const strongTags = $('strong')
				.toArray()
				.map(element => $(element).text());

			const index = data.HtmlBody.indexOf('<body');

			if (index !== -1) {
				data.HtmlBody = data.HtmlBody.substring(index);
			}

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: 'automobile.it',
					subject: data.Subject.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets,
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets,
					groupId: groupId,
					body: '',
					carName: tdTags[5],
					isAssigned: false,
					isVisible: true,
					buyerName: strongTags[0],
					buyerPhone: strongTags[3],
					buyerEmail: strongTags[2],
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

	return true;
}
