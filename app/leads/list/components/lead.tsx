'use client';

import { formatCurrencyEUR } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import NotesManager from '@/app/components/notesManager';
import AppuntamentoForm from '@/app/components/appuntamentoForm';
import SendEmail from '@/app/components/sendEmail';
import { Spinner } from '@radix-ui/themes';

export function Lead({
	session,
	agency,
	setLeads,
	lead,
	setIsOpen,
	leadType,
	setSelectedLead,
}: any) {
	//CONTACTS
	const [contact, setContact] = useState<any>({
		id: lead.contactId,
		name: lead.contactName,
		phoneNumber: lead.contactPhoneNumber,
		email: lead.contactEmail,
	});
	const updateContact = async () => {
		const params = {
			action: 'updateById',
			id: lead.contactId,
			contact: contact,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/contacts', options);
		await response.json();
		setLeads((prevItems: any[]) =>
			prevItems.map(item =>
				item.id === lead.id
					? {
						...item,
						contactName: contact.name,
						contactEmail: contact.email,
						contactPhoneNumber: contact.phoneNumber,
					}
					: item
			)
		);
		toast('Contatto aggiornato');
	};

	//EVENT & EMAIL HANDLERS
	const [event, setEvent] = useState(true);
	const [email, setEmail] = useState(false);

	const changeView = (type: string) => {
		if (type == 'event') {
			setEvent(true);
			setEmail(false);
		} else {
			setEmail(true);
			setEvent(false);
		}
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
		await response.json();

		if (leadType === 'search' || leadType === 'today') {
			setLeads((prevItems: any[]) =>
				prevItems.map(item =>
					item.id === lead.id ? { ...item, isConfirmed: false } : item
				)
			);
		} else {
			setLeads((prevItems: any[]) =>
				prevItems.map(item =>
					item.id === lead.id ? { ...item, contactIsCommerciant: contactIsCommerciant ? contactIsCommerciant : lead.contactIsCommerciant, contactNotInterested: contactNotInterested ? contactNotInterested : lead.contactNotInterested, isSold: isSold ? isSold : lead.isSold } : item
				)
			);
			/*
			setLeads((prevItems: any[]) =>
				prevItems.filter(item => item.id !== lead.id)
			);
			*/
		}
		toast('Lead aggiornato');
		setIsOpen(false);
	}

	//SEND PRESENTAZIONE SPOKI
	const [sendSpokiLoading, setSendSpokiLoading] = useState(false);
	async function sendPresentazione() {
		setSendSpokiLoading(true);
		const params = {
			action: 'sendPresentazione',
			lead: lead,
			agencyCode: agency,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/spoki', options);
		await response.json();
		if (response.status == 200) {
			setLeads((prevItems: any[]) =>
				prevItems.map(item =>
					item.id === lead.id ? { ...item, isMessageSent: true } : item
				)
			);
			setSelectedLead((prevState: any) => ({
				...prevState,
				isMessageSent: true,
			}));
			toast('Presentazione Spoki inviata');
		} else {
			toast('Errore invio Presentazione Spoki');
		}
		setSendSpokiLoading(false);
	}

	return (
		<>
			<Toaster />
			<div className="flex justify-between items-center gap-2 mb-2">
				<div className="flex gap-2 items-center w-full mt-8">
					<div className="flex gap-2 items-center w-full">
						<p className="text-2xl font-semilight mb-2">{lead.description}</p>
					</div>
					<div>
						{lead.isConfirmed == 1 && (
							<motion.button
								onClick={() => updateLead('reset', null, true, null, null, null)}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="rounded-xl bg-emerald-400 hover:bg-emerald-500 p-2 text-white w-[125px] ml-2"
							>
								Resetta
							</motion.button>
						)}
						{lead.isConfirmed == 0 && (
							<motion.button
								onClick={() => updateLead('assign', true, null, null, null, null)}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="rounded-xl bg-emerald-400 hover:bg-emerald-500 p-2 text-white w-[125px] ml-2"
							>
								Assegna
							</motion.button>
						)}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-5">
				<div className="rounded-2xl border border-slate-200">
					<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
						Contatto
					</div>
					<div className="p-4">
						<p className="mb-1 font-light">Nome</p>
						<input
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.name ? contact.name : ''}
							onChange={e =>
								setContact((prevState: any) => ({
									...prevState,
									name: e.target.value,
								}))
							}
						/>
						<p className="mb-1 font-light">Email</p>
						<input
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.email ? contact.email : ''}
							onChange={e =>
								setContact((prevState: any) => ({
									...prevState,
									email: e.target.value,
								}))
							}
						/>
						<p className="mb-1 font-light">Telefono</p>
						<input
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={contact.phoneNumber ? contact.phoneNumber : ''}
							onChange={e =>
								setContact((prevState: any) => ({
									...prevState,
									phoneNumber: e.target.value,
								}))
							}
						/>
						<motion.button
							onClick={updateContact}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% w-full p-2 text-white"
						>
							Salva
						</motion.button>
					</div>
				</div>

				<NotesManager
					session={session}
					agency={agency}
					lead={lead}
					setLeads={setLeads}
					deal={null}
					rent={null}
				/>

				<div className="rounded-2xl border border-slate-200 p-4">
					<motion.button
						disabled={sendSpokiLoading}
						onClick={sendPresentazione}
						whileHover={{ scale: !sendSpokiLoading ? 1.01 : 1 }}
						whileTap={{ scale: !sendSpokiLoading ? 0.99 : 1 }}
						className={`rounded-xl ${!sendSpokiLoading ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} w-full p-2 text-white flex justify-center items-center`}
					>
						{sendSpokiLoading && (
							<div className="flex justify-center items-center p-1">
								<Spinner />
							</div>
						)}
						{!sendSpokiLoading && <>Invia Presentazione Spoki</>}
					</motion.button>
					{lead.isMessageSent ? (
						<p className="mt-2 text-center bg-red-200 rounded-2xl">
							Hai già inviato la presentazione a questo Lead!
						</p>
					) : null}

					<div
						className="cursor-pointer"
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
					</div>
					<p className="text-md mt-2">{lead.description}</p>
					<p className="text-md">{formatCurrencyEUR(lead.price)}</p>
					<p className="text-md">{lead.mileage_scalar} km</p>
					<p className="text-md">{lead.fuel}</p>
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
				</div>
				<div className="rounded-2xl border border-slate-200">
					<div className="text-slate-800 font-light grid grid-cols-2">
						<div
							onClick={() => changeView('event')}
							className={`rounded-r rounded-b rounded-2xl ${event ? 'bg-slate-300' : 'bg-slate-200'} p-4 text-center hover:bg-slate-300`}
						>
							Appuntamento
						</div>
						<div
							onClick={() => changeView('email')}
							className={`rounded-l rounded-b rounded-2xl ${email ? 'bg-slate-300' : 'bg-slate-200'} p-4 text-center hover:bg-slate-300`}
						>
							Invio email
						</div>
					</div>
					{event && (
						<AppuntamentoForm
							setEvent={setEvent}
							session={session}
							agency={agency}
							lead={lead}
							deal={null}
							setDeal={null}
							setDeals={null}
							messaggio="Invia Messaggio di conferma appuntamento acquisizione"
						/>
					)}
					{email && (
						<SendEmail
							session={session}
							agency={agency}
							lead={lead}
							deal={null}
						/>
					)}
				</div>
			</div>
		</>
	);
}
