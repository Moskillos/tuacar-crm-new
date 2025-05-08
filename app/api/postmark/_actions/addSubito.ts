import { generaId } from '@/lib/utils';
import addEmail from '../../emails/_actions/addEmail';

function extractValuesSubito(text: string): Record<string, string> {
	const result: Record<string, string> = {};

	// Check if this is a "Nuovo messaggio" format
	const isNewMessageFormat = text.includes('nuovo messaggio') || text.includes('Nuovo messaggio');

	if (isNewMessageFormat) {
		// Extract title of the ad - use different pattern for "Nuovo messaggio" format
		const titleMatch = text.match(/(?:per l'annuncio|per il tuo annuncio|contatto per l'annuncio)\s*(.*?)(?:,|\.|$)/i) ||
			text.match(/Fiat.*?(?:Star|Pop|Lounge|City|Cross)(?:\s+\d+)?/i);
		result.adTitle = titleMatch ? titleMatch[0].trim() : '';

		// Extract name of the responder - look for name after "nuovo" tag
		const nameMatch = text.match(/nuovo\s+(.*?)(?:\d{4}-\d{2}-\d{2})/i);
		result.responderName = nameMatch ? nameMatch[1].trim() : '';

		// Extract message content - any text after the date/time
		const dateTimePattern = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/;
		const dateTimeMatch = text.match(dateTimePattern);
		if (dateTimeMatch && dateTimeMatch.index !== undefined) {
			const messageStartIndex = dateTimeMatch.index + dateTimeMatch[0].length;
			const messageText = text.substring(messageStartIndex).trim();
			// Extract just the user message part
			const userMessageMatch = messageText.match(/Ciao.*?(?:disponibile ancora|$)/i);
			result.responderMessage = userMessageMatch ? userMessageMatch[0].trim() : messageText;
		} else {
			result.responderMessage = '';
		}

		result.responderEmail = '';

		// Try to extract phone if present
		const phoneMatch = text.match(/(?:Tel(?:efono)?|contatto)[\s:]+(\+?\d[\d\s()+\-.]*\d)/i);
		result.responderPhone = phoneMatch ? phoneMatch[1].trim() : '';
	} else {
		// Original extraction logic for "Risposta a" format
		// Extract title of the ad
		const titleMatch = text.match(
			/(?:Risposta a:|all'annuncio:)\s*(.*?)\s*(?:\(|http)/i
		);
		result.adTitle = titleMatch ? titleMatch[1].trim() : '';

		// Extract name of the responder
		const nameMatch = text.match(/Nome:\s*(.*?)\s*(?:Messaggio:|<br>)/i);
		result.responderName = nameMatch ? nameMatch[1].trim() : '';

		// Extract email of the responder
		const emailMatch = text.match(
			/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
		);
		result.responderEmail = emailMatch ? emailMatch[0] : '';

		// Extract phone number of the responder (if it exists)
		const phoneMatch = text.match(/Tel(?:efono)?:\s*([\d\s+()]+)/i);
		result.responderPhone = phoneMatch ? phoneMatch[1].trim() : '';

		// Extract message of the responder
		const messageMatch = text.match(
			/Messaggio:([\s\S]*?)\s*(?:Vuoi rispondere|\.{3})/i
		);
		result.responderMessage = messageMatch ? messageMatch[1].trim() : '';
	}

	const adUrlMatch = text.match(/https:\/\/www\.subito\.it\/[^\s]+/);
	result.adUrl = adUrlMatch ? adUrlMatch[0] : '';

	return result;
}

export default async function addSubito(data: any, agencyCodes: []) {
	//subito
	if (
		data.FromFull.Email.includes('subito.it') &&
		(data.Subject.includes('Subito - Risposta a:') || data.Subject.includes('Nuovo messaggio per'))
	) {
		// console.log(agency);
		console.log('subito.it');

		try {
			const extractedValues = extractValuesSubito(data.TextBody);
			console.log(extractedValues);

			const groupId = generaId();
			for (const [index, item] of agencyCodes.entries()) {
				const newEmailAd: any = {
					emailId: data.MessageID,
					agencyCode: item,
					url: extractedValues['adUrl'],
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
					carName: extractedValues['adTitle'],
					isAssigned: false,
					isVisible: true,
					buyerName: extractedValues['responderName'],
					buyerPhone: extractedValues['responderPhone'],
					buyerEmail: extractedValues['responderEmail'],
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
