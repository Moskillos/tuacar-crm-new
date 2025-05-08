'use client';

//PER RITORNARE ALLA VERSIONE PRECEDENTE:
//GITHUB PUSH PREVIOUS 08 OTTOBRE 2024

import { formatCurrencyEUR } from '@/lib/utils';
import { Spinner } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export function CSVLead({
	session,
	agency,
	setLeads,
	lead,
	csvAssigned,
	setCsvAssigned,
	selectLead,
	setIsOpen
}: any) {
	//SEND SPOKI
	const [sendSpoki, setSendSpoki] = useState(true);

	//CONTACTS
	const contact = {
		id: lead.id,
		name: lead.advertiser_name,
		phoneNumber: lead.advertiser_phone,
		email: lead.advertiser_email,
	};

	const [savingLead, setSavingLead] = useState(false);
	const assignLead = async () => {
		setSavingLead(true);
		const params = {
			action: 'assign',
			lead: lead,
			userId: session?.user?.sub,
			agencyCode: agency,
			sendSpoki: sendSpoki,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/leads', options);
		//const data = await response.json();
		toast('Lead assegnato');
		window.location.href = '/leads/list?id=' + lead.id;
		/*
		setCsvAssigned((prevAssigned: any) => [...prevAssigned, lead.urn])
		setLeads((prevItems: any[]) =>
			prevItems.map((item) =>
				item.id === lead.id ? { ...item, isConfirmed: true } : item
			)
		);
		selectLead(data.data, 'lead')
		setSavingLead(false)
		*/
	};

	//UPDATE LEAD HANDLER
	async function updateLead(
		type: string,
		assign: any,
		reset: any,
		contactIsCommerciant: any,
		contactNotInterested: any,
		isSold: any
	) {
		const params = {
			action: 'updateStatus',
			type: type,
			id: lead.id,
			lead: lead,
			contactIsCommerciant: contactIsCommerciant,
			contactNotInterested: contactNotInterested,
			assign: assign,
			reset: reset,
			isSold: isSold
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/leads', options);
		if(response.status !== 200) {
			toast('Lead non aggiornato');
			setIsOpen(false)
		} else {
			await response.json();

		/*
		setLeads((prevItems: any[]) =>
			prevItems.filter(item => item.id !== lead.id)
		);
		*/

		setLeads((prevItems: any[]) =>
			prevItems.map(item =>
				item.id === lead.id ? { ...item, contactIsCommerciant: contactIsCommerciant ? contactIsCommerciant : lead.contactIsCommerciant, contactNotInterested: contactNotInterested ? contactNotInterested : lead.contactNotInterested, isSold: isSold ? isSold : lead.isSold } : item
			)
		);
		toast('Lead aggiornato');
		setIsOpen(false)
		}
		
	}

	return (
		<>
			<Toaster />
			<div className="w-full mx-auto pt-2 mt-5">
				<div className="flex justify-between items-center gap-2 mb-2">
					<div className="flex gap-2 items-center w-full">
						<p className="text-2xl font-semilight mb-2">{lead.subject}</p>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-5">
				<div className="rounded-2xl border border-slate-200">
					<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
						Contatto
					</div>
					<div className="p-4">
						<input
							disabled
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.name ? contact.name : ''}
						/>
						<p className="mb-1 font-light">Email</p>
						<input
							disabled
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.email ? contact.email : ''}
						/>
						<p className="mb-1 font-light">Telefono</p>
						<input
							disabled
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.phoneNumber ? contact.phoneNumber : ''}
						/>
					</div>
				</div>
				<div
					className="rounded-2xl border border-slate-200 p-4 cursor-pointer"
					onClick={() => window.open(lead.url, '_blank')}
				>
					{lead.url.includes('autoscout24') && (
						<Image
							src="/autoscout24.svg"
							height="125"
							width="125"
							alt="autoscout"
						/>
					)}
					{lead.url.includes('automobile') && (
						<Image
							src="/automobile.svg"
							height="125"
							width="125"
							alt="automobile"
						/>
					)}
					{lead.url.includes('subito') && (
						<Image src="/subito.svg" height="125" width="125" alt="subito" />
					)}
					{lead.url.includes('tuacar') && (
						<Image src="/tuacar.png" height="125" width="125" alt="tuacar" />
					)}
					<p className="text-md mt-2">{lead.vehicle_status}</p>
					<p className="text-md">{formatCurrencyEUR(lead.price)}</p>
					<p className="text-md">{lead.mileage_scalar} km</p>
					<p className="text-md">{lead.fuel}</p>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2 mt-2">
				{lead.contactIsCommerciant == true && (
					<motion.button className="rounded-xl bg-slate-500 w-full p-2 text-white" onClick={() =>
						updateLead('isCommerciant', null, null, false, null, null)
					}>
						Lead commerciante
					</motion.button>
				)}
				{lead.contactIsCommerciant == false && (
					<motion.button
						onClick={() =>
							updateLead('isCommerciant', null, null, true, null, null)
						}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
						className="rounded-xl bg-yellow-400 hover:bg-yellow-500 w-full p-2 text-white"
					>
						Commerciante
					</motion.button>
				)}

				{lead.contactNotInterested == true && (
					<motion.button className="rounded-xl bg-slate-500 w-full p-2 text-white" onClick={() =>
						updateLead('notInterested', null, null, null, false, null)
					}>
						Lead non interessato
					</motion.button>
				)}
				{lead.contactNotInterested == false && (
					<motion.button
						onClick={() =>
							updateLead('notInterested', null, null, null, true, null)
						}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
						className="rounded-xl bg-orange-400 hover:bg-orange-500 w-full p-2 text-white"
					>
						Non interessato
					</motion.button>
				)}

				{lead.isSold == true && (
					<motion.button className="rounded-xl bg-slate-500 w-full p-2 text-white" onClick={() => updateLead('venduta', null, null, null, null, false)}>
						Venduta
					</motion.button>
				)}
				{lead.isSold == false && (
					<motion.button
						onClick={() => updateLead('venduta', null, null, null, null, true)}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
						className="rounded-xl bg-red-400 hover:bg-red-500 w-full p-2 text-white"
					>
						Venduta
					</motion.button>
				)}

			</div>
			{lead.isConfirmed == 0 && (
				<>
					<motion.button
						disabled={savingLead}
						onClick={assignLead}
						whileHover={{ scale: !savingLead ? 1.01 : 1 }}
						whileTap={{ scale: !savingLead ? 0.99 : 1 }}
						className={`mt-2 rounded-xl ${!savingLead ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
					>
						{savingLead && (
							<div className="flex justify-center items-center p-1">
								<Spinner />
							</div>
						)}
						{!savingLead && 'Assegnati Lead'}
					</motion.button>
					<div className="flex flex-items-center gap-2 mt-2 mb-2">
						<input
							type="checkbox"
							checked={sendSpoki}
							className="hover:cursor-pointer"
							onClick={() => setSendSpoki(!sendSpoki)}
						/>
						<p>Invia anche messaggio di presentazione Spoki</p>
					</div>
				</>
			)}
			{lead.isConfirmed == 1 && (
				<motion.button
					onClick={() => selectLead(lead, 'lead')}
					className="mt-2 rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white"
				>
					Questo lead è già stato salvato Clicca per aprirlo!
				</motion.button>
			)}
		</>
	);
}
