'use client';

import {useRouter} from 'next/navigation';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';

export function ContactCard({contactId, togglePopupSelectContacts}: any) {
	//GO TO PIPELINE/LEAD
	const router = useRouter();
	const goTo = (source: string, id: string) => {
		router.push(source + '?id=' + id);
	};

	//GET CONTACT
	const [contact, setContact] = useState<any>(null);
	const [contactLoading, setContactLoading] = useState(true);
	useEffect(() => {
		async function getContact() {
			try {
				const params = {
					action: 'getContactById',
					id: contactId,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', // Set content type to JSON
					},
					body: JSON.stringify(params), // Use body instead of params
				};

				const response = await fetch('/api/contacts', options);
				const data = await response.json();

				setContact(data.data); // Assuming `data.data` contains the deals you want to set
			} catch (error) {
				console.error('Failed to fetch deals:', error);
				setContactLoading(false);
			} finally {
				setContactLoading(false); // Assuming this is for managing loading state
			}
		}
		if (contactId) {
			getContact();
		} else {
			setContactLoading(false);
		}
	}, [contactId]);

	return (
		<>
			{!contactLoading && (
				<>
					<motion.div
						whileHover={{scale: 1.01}}
						whileTap={{scale: 0.99}}
						className="mb-2 rounded-xl bg-stone-200 hover:bg-stone-300 w-full p-2 text-black hover:cursor-pointer text-center"
					>
						{!contactId ? 'Nessun contatto assegnato' : contact?.name}
					</motion.div>
					<motion.button
						onClick={togglePopupSelectContacts}
						whileHover={{scale: 1.01}}
						whileTap={{scale: 0.99}}
						className="mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white"
					>
						{!contactId ? 'Assegna contatto' : 'Aggiorna contatto'}
					</motion.button>
				</>
			)}
		</>
	);
}
