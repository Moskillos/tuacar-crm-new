'use client';

import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {toast, Toaster} from 'sonner';

export function RicezioneButton({
	session,
	agency,
	userRoles,
	setReceiveLeads,
	receiveLeads,
}: any) {
	const [receive, setReceive] = useState(false);
	const [receiveLoading, setReceiveLoading] = useState(true);
	//GET CURRENT AGENCY DETAILS
	async function getAgency() {
		try {
			const response = await fetch(`/api/agencies/${agency}`);
			const data = await response.json();

			setReceive(data.data[0].receiveLeads);
			setReceiveLeads(data.data[0].receiveLeads);
		} catch (error) {
			console.error('Failed to fetch agency details:', error);
		} finally {
			setReceiveLoading(false);
		}
	}

	//BLOCCA RICEZIONE LEAD X AGENZIA
	async function bloccaRicezione() {
		try {
			const params = {
				action: 'bloccaRicezione',
				canReceive: !receive,
				agencyCode: agency,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};

			const response = await fetch('/api/agencies', options);

			if (response.status == 200) {
				toast(!receive ? 'Ricezione attivata' : 'Ricezione disattivata');
				setReceive(!receive);
				setReceiveLeads(!receiveLeads);
			}
		} catch (error) {
			console.error('Failed to fetch agency details:', error);
		} finally {
		}
	}

	useEffect(() => {
		if (agency) {
			getAgency();
		}
	}, [agency]);

	return (
		<>
			<Toaster />
			{!receiveLoading && (
				<>
					{userRoles.includes('tenant_001|admin') && (
						<motion.button
							onClick={bloccaRicezione}
							whileHover={{scale: 1.01}}
							whileTap={{scale: 0.99}}
							className={
								receive
									? 'rounded-xl bg-gradient-to-r w-full p-2 text-white from-red-300 from-10% via-red-400 via-30% to-red-500 to-100%'
									: 'rounded-xl bg-gradient-to-r w-full p-2 text-white from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%'
							}
						>
							{receive ? 'Blocca ricezione' : 'Attiva ricezione'}
						</motion.button>
					)}
				</>
			)}
		</>
	);
}
