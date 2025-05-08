import * as xml2js from 'xml2js';
import addEmail from '../../emails/_actions/addEmail';
import {generaId} from '@/lib/utils';

const parseXML = async (xmlString: string) => {
	try {
		// Parse the XML string
		const parser = new xml2js.Parser();

		const result = await parser.parseStringPromise(xmlString);

		// Extract the desired fields
		const make = result.lead.vehicle[0].make[0];
		console.log(make);
		const model = result.lead.vehicle[0].model[0];
		console.log(model);
		const name = result.lead.potentialBuyer[0].name[0];
		console.log(name);
		const email = result.lead.potentialBuyer[0].email[0];
		console.log(email);
		const phone = result.lead.potentialBuyer[0].phone[0] || '';
		console.log(phone);
		const listingLink = result.lead.vehicle[0].listingLink[0] || '';
		console.log(listingLink);

		return {make, model, name, email, phone, listingLink};
	} catch (error) {
		console.error('Error parsing XML:', error);
	}
};

export default async function addAutoScout(data: any, agencyCodes: []) {
	/*
    if (data.FromFull.Email.includes("autoscout24.com") && data.Subject.includes("Richiesta informazioni") && !data.Subject.includes("(Prime)")) {
        console.log("Ok")
    }
    if (data.FromFull.Email.includes("autoscout24.com") && data.Subject.includes("Richiesta informazioni") && data.Subject.includes("(Prime)")) {
        console.log("Ok")
    }
    if (data.FromFull.Email.includes("autoscout24.com") && data.Subject.includes("SellID") && data.Subject.includes("(Prime)")) {
        console.log("Ok")
    }
    if (data.FromFull.Email.includes("autoscout24.com") && data.Subject.includes("SellID") && !data.Subject.includes("(Prime)")) {
        console.log("Ok")
    }
    if (data.FromFull.Email.includes("autoscout24.com") && data.Subject.includes("nostro utente sta cercando")) {
        console.log("Ok")
    }
    */

	//es. (Prime) AutoScout24.it - Sell-ID: 2142204845. Richiesta informazioni Volkswagen Golf € 12.900,- Offerta n.: 2775
	if (
		data.FromFull.Email.includes('autoscout24.com') &&
		data.Subject.includes('Richiesta informazioni') &&
		!data.Subject.includes('(Prime)')
	) {
		console.log('autoscout24.com 1st');
		try {
			const htmlContent = data.HtmlBody;

			const leadStart = htmlContent.indexOf('<lead>');
			const leadEnd = htmlContent.indexOf('</lead>') + '</lead>'.length;
			const xmlString = htmlContent.substring(leadStart, leadEnd);

			const res = await parseXML(xmlString);

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: res ? res.listingLink : '',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					carName: res ? res.make + ' ' + res.model + ' _ ' : '',
					isAssigned: false,
					isVisible: true,
					buyerName: res ? res.name : '',
					buyerEmail: res ? res.email : '',
					buyerPhone: res ? res.phone : '',
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

	//es. (Prime) AutoScout24.it - Sell-ID: 2142204845. Richiesta informazioni Opel Insignia € 16.700,- Offerta n.: 2842
	if (
		data.FromFull.Email.includes('autoscout24.com') &&
		data.Subject.includes('Richiesta informazioni') &&
		data.Subject.includes('(Prime)')
	) {
		console.log('autoscout24.com 2nd');
		try {
			const htmlContent = data.HtmlBody;

			const leadStart = htmlContent.indexOf('<lead>');
			const leadEnd = htmlContent.indexOf('</lead>') + '</lead>'.length;
			const xmlString = htmlContent.substring(leadStart, leadEnd);

			const res = await parseXML(xmlString);

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: res ? res.listingLink : '',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					carName: res ? res.make + ' ' + res.model + ' _ ' : '',
					isAssigned: false,
					isVisible: true,
					buyerName: res ? res.name : '',
					buyerEmail: res ? res.email : '',
					buyerPhone: res ? res.phone : '',
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

	//es. SellID 2142223071 - Richiesta telefonica accettata alle 16:04:16, Peugeot 208 (Prime) 📞
	if (
		data.FromFull.Email.includes('autoscout24.com') &&
		data.Subject.includes('SellID') &&
		data.Subject.includes('(Prime)')
	) {
		console.log('autoscout24.com 3rd');
		try {
			const htmlContent = data.HtmlBody;
			const makeRegex = /<make>([\s\S]*?)<\/make>/;
			const modelRegex = /<model>([\s\S]*?)<\/model>/;
			const phoneRegex = /<phone>([\s\S]*?)<\/phone>/;
			const listingLinkRegex = /<listingLink>([\s\S]*?)<\/listingLink>/;

			// Extracting the content
			const makeMatch = htmlContent.match(makeRegex);
			const modelMatch = htmlContent.match(modelRegex);
			const phoneMatch = htmlContent.match(phoneRegex);
			const listingLinkMatch = htmlContent.match(listingLinkRegex);

			// Assuming each tag is present and has a match, extracting the first capture group
			const make = makeMatch ? makeMatch[1] : 'Not found';
			const model = modelMatch ? modelMatch[1] : 'Not found';
			const phone = phoneMatch ? phoneMatch[1] : 'Not found';
			const listingLink = listingLinkMatch ? listingLinkMatch[1] : 'Not found';

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: listingLink,
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					carName: make + ' ' + model + ' _ ',
					isAssigned: false,
					isVisible: true,
					buyerName: '',
					buyerEmail: '',
					buyerPhone: phone,
				};
				//console.log(newEmailAd);
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

	//es. SellID 2142204845 - Richiesta telefonica accettata alle 16:23:19, Renault Laguna 📞
	if (
		data.FromFull.Email.includes('autoscout24.com') &&
		data.Subject.includes('SellID') &&
		!data.Subject.includes('(Prime)')
	) {
		console.log('autoscout24.com 4th');
		try {
			const htmlContent = data.HtmlBody;
			const makeRegex = /<make>([\s\S]*?)<\/make>/;
			const modelRegex = /<model>([\s\S]*?)<\/model>/;
			const phoneRegex = /<phone>([\s\S]*?)<\/phone>/;
			const listingLinkRegex = /<listingLink>([\s\S]*?)<\/listingLink>/;

			// Extracting the content
			const makeMatch = htmlContent.match(makeRegex);
			const modelMatch = htmlContent.match(modelRegex);
			const phoneMatch = htmlContent.match(phoneRegex);
			const listingLinkMatch = htmlContent.match(listingLinkRegex);

			// Assuming each tag is present and has a match, extracting the first capture group
			const make = makeMatch ? makeMatch[1] : 'Not found';
			const model = modelMatch ? modelMatch[1] : 'Not found';
			const phone = phoneMatch ? phoneMatch[1] : 'Not found';
			const listingLink = listingLinkMatch ? listingLinkMatch[1] : 'Not found';

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: listingLink,
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					carName: make + ' ' + model + ' _ ',
					isAssigned: false,
					isVisible: true,
					buyerName: '',
					buyerEmail: '',
					buyerPhone: phone,
				};
				//console.log(newEmailAd);
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

	//es. Un nostro utente sta cercando una Volkswagen Golf a € 16.500,-via AutoMatch
	if (
		data.FromFull.Email.includes('autoscout24.com') &&
		data.Subject.includes('nostro utente sta cercando')
	) {
		console.log('autoscout24.com 5th');

		try {
			const htmlContent = data.HtmlBody;

			const leadStart = htmlContent.indexOf('<lead>');
			const leadEnd = htmlContent.indexOf('</lead>') + '</lead>'.length;
			const xmlString = htmlContent.substring(leadStart, leadEnd);

			const res = await parseXML(xmlString);

			const groupId = generaId();

			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: res ? res.listingLink : '',
					subject: data.Subject,
					groupId: groupId,
					body: data.TextBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					htmlBody: data.HtmlBody.trim()
						.replace(/\n/g, '') // Remove newlines
						.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
						.replace(/'/g, "\\'") // Escape single quotes (important for SQL)
						.replace(/"/g, '\\"') // Escape double quotes (optional, for safety)
						.replace(/\[/g, '\\[') // Escape square brackets
						.replace(/\]/g, '\\]'), // Escape square brackets
					carName: res ? res.make + ' ' + res.model + ' _ ' : '',
					isAssigned: false,
					isVisible: true,
					buyerName: res ? res.name : '',
					buyerEmail: res ? res.email : '',
					buyerPhone: res ? res.phone : '',
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
