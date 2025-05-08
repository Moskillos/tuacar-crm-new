'use client';
import {Spinner} from '@radix-ui/themes';
import {motion} from 'framer-motion';
import {useState} from 'react';
import {toast, Toaster} from 'sonner';

export default function SendEmail({session, agency, lead, deal}: any) {
	const [subject, setSubject] = useState('');
	const [emailText, setEmailText] = useState('');
	const [toEmail, setToEmail] = useState<any>(
		lead && lead.contactEmail
			? lead.contactEmail
			: deal && deal.contactEmail
				? deal.contactEmail
				: null
	);
	const [files, setFiles] = useState([]);

	const [sendingEmail, setSendingEmail] = useState(false);

	const sendEmail = () => {
		setSendingEmail(true);
		// Initialize FormData
		const formData = new FormData();

		// Append parameters to formData
		formData.append('from', session.user.email);
		//formData.append("from", "sabrina.luciano@tua-car.it");
		formData.append('to', toEmail ? toEmail : '');
		formData.append('subject', subject);
		formData.append('emailText', emailText);

		// Append files to formData

		Array.from(files).forEach((file, index) => {
			formData.append(`file${index + 1}`, file);
		});

		const options = {
			method: 'POST',
			body: formData,
		};

		fetch(
			'https://vwm74malw2.execute-api.eu-south-1.amazonaws.com/default/sendEmail',
			options
		)
			.then(res => res.json())
			.then(data => {
				if (data.msg === 'Success') {
					toast('Email inviata');
					setSendingEmail(false);
				} else {
					toast("Errore nell'invio dell'email");
				}
			})
			.catch(error => {
				console.error('Send email error:', error);
				toast("Errore nell'invio dell'email");
			});
	};

	const handleFileChange = (event: any) => {
		setFiles(event.target.files); // Set files to the selected files
	};

	return (
		<div className="p-4">
			<Toaster />
			<input
				className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
				placeholder="Email"
				value={toEmail ? toEmail : ''}
				onChange={e => {
					setToEmail(e.target.value);
				}}
			/>
			<input
				className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
				placeholder="Subject"
				value={subject}
				onChange={e => {
					setSubject(e.target.value);
				}}
			/>
			<textarea
				className="rounded-xl bg-slate-200 w-full p-2"
				placeholder="Scrivi Email"
				value={emailText}
				onChange={e => {
					setEmailText(e.target.value);
				}}
			/>
			<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
				Allegati
			</label>
			<input
				className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
				id="file_input"
				type="file"
				multiple
				onChange={handleFileChange}
			/>
			<motion.button
				disabled={sendingEmail}
				onClick={sendEmail}
				whileHover={{scale: !sendingEmail ? 1.01 : 1}}
				whileTap={{scale: !sendingEmail ? 0.99 : 1}}
				className={`rounded-xl ${!sendingEmail ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
			>
				{sendingEmail && (
					<div className="flex justify-center items-center p-1">
						<Spinner />
					</div>
				)}
				{!sendingEmail && 'Invia email'}
			</motion.button>
		</div>
	);
}
