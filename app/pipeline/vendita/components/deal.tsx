'use client';

import { formatCurrencyEUR, goToERP } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { creaPreventivo } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import { Pencil } from 'lucide-react';
import NotesManager from '@/app/components/notesManager';
import AppuntamentoForm from '@/app/components/appuntamentoForm';
import SendEmail from '@/app/components/sendEmail';

export function Deal({
	session,
	agency,
	togglePopup,
	setDeals,
	showDeal,
	setSelectedDeal,
}: any) {
	//UPDATE DEAL
	const [deal, setDeal] = useState<any>(showDeal);
	const updateDeal = async (
		action: string,
		value: string | number | boolean | null
	) => {
		let upd: any = {};

		//UPDATE STAGE ID
		if (action == 'stage') {
			upd['stageId'] = value;
			setDeal((prevState: any) => ({
				...prevState,
				stageId: value,
			}));
			setDeals((prevItems: any[]) =>
				prevItems.map(item =>
					item.dealId === showDeal.dealId ? { ...item, stageId: value } : item
				)
			);
		}
		//VINTO o PERSO
		if (action == 'esito') {
			upd['isAwarded'] = value == 'win' ? true : false;
			upd['isFailed'] = value == 'lost' ? true : false;
			setDeals((prevItems: any[]) =>
				prevItems.filter(item => item.dealId !== showDeal.dealId)
			);
			togglePopup();
		}

		if (action == 'reset') {
			upd['isAwarded'] = false;
			upd['isFailed'] = false;
			window.location.href = "/pipeline/vendita";
		}

		//UPDATE TITLE
		if (action == 'title') {
			upd['title'] = value;
			setDeals((prevItems: any[]) =>
				prevItems.map(item =>
					item.dealId === showDeal.dealId ? { ...item, title: value } : item
				)
			);
		}

		const params = {
			action: 'updateVenditaById',
			id: showDeal.dealId,
			deal: upd,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/pipeline', options);
		await response.json();

		toast('Affare aggiornato correttamente');
	};

	//CONTACTS
	const [contact, setContact] = useState<any>({
		id: showDeal.contactId,
		name: showDeal.contactName,
		phoneNumber: showDeal.contactPhoneNumber,
		email: showDeal.contactEmail,
	});
	const updateContact = async () => {
		const params = {
			action: 'updateById',
			id: showDeal.contactId,
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
		setDeals((prevItems: any[]) =>
			prevItems.map(item =>
				item.dealId === showDeal.dealId
					? {
						...item,
						contactName: contact.name,
						contactEmail: contact.email,
						contactPhoneNumber: contact.phoneNumber,
					}
					: item
			)
		);
		setDeal((prevState: any) => ({
			...prevState,
			contactName: contact.name,
			contactEmail: contact.email,
			contactPhoneNumber: contact.phoneNumber,
		}));
		setSelectedDeal((prevState: any) => ({
			...prevState,
			contactName: contact.name,
			contactEmail: contact.email,
			contactPhoneNumber: contact.phoneNumber,
		}));
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

	//GET DEAL ATTACHED EMAIL
	const [emailAd, setEmailAd] = useState<any>("")
	const getEmailAd = async (deal: any) => {
		try {
			const response = await fetch(`/api/postmark?emailId=${deal.emailId}`);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			const data = await response.json();
			setEmailAd(data.data.htmlBody)
			return data;
		} catch (error) {
			console.error('Failed to fetch email address:', error);
			return null;
		}
	};

	useEffect(() => {
		if (deal) {
			getEmailAd(deal)
		}
	}, [deal]);

	return (
		<>
			<Toaster />
			<div className="w-full mx-auto pt-2 mt-5">
				<div className="flex justify-between items-center gap-2 mb-2">
					<div className="flex gap-2 items-center w-full">
						<input
							value={deal.title}
							onChange={e =>
								setDeal((prevState: any) => ({
									...prevState,
									title: e.target.value,
								}))
							}
							className="bg-slate-100 rounded-2xl hover:bg-slate-200 focus:outline-none focus:ring-0 p-2 flex-grow"
						/>
						<motion.button
							onClick={() => updateDeal('title', deal.title)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="rounded-full p-2 text-white bg-blue-500"
						>
							<Pencil />
						</motion.button>
						<div>
							{!deal.isAwarded && !deal.isFailed ? (
								<>
									<button
										onClick={() => updateDeal('esito', 'win')}
										className="rounded-xl bg-lime-500 hover:bg-lime-600 p-2 text-white ml-auto w-[125px]"
									>
										Aggiudicato
									</button>
									<button
										onClick={() => updateDeal('esito', 'lost')}
										className="rounded-xl bg-red-500 hover:bg-red-600 p-2 text-white ml-2 w-[125px]"
									>
										Perso
									</button>
								</>
							) : (
								<motion.button
									onClick={() => updateDeal('reset', true)}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className="rounded-xl bg-emerald-400 hover:bg-emerald-500 p-2 text-white w-[125px] ml-2"
								>
									Resetta
								</motion.button>
							)}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
					<motion.div
						onClick={() => updateDeal('stage', 7)}
						className={`rounded-2xl ${deal.stageId == 7 ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-blue-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Cliente interessato
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 8)}
						className={`rounded-2xl ${deal.stageId == 8 ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-blue-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Appuntamento confermato
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 9)}
						className={`rounded-2xl ${deal.stageId == 9 ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-blue-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Proposta presentata
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 10)}
						className={`rounded-2xl ${deal.stageId == 10 ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-blue-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						In sospeso
					</motion.div>
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
							value={contact.name}
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
							value={contact.email}
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
							value={contact.phoneNumber}
							onChange={e =>
								setContact((prevState: any) => ({
									...prevState,
									phoneNumber: e.target.value,
								}))
							}
						/>
						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							onClick={() => updateContact()}
							className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white"
						>
							Salva
						</motion.button>
					</div>
				</div>

				<NotesManager
					session={session}
					agency={agency}
					lead={null}
					setLeads={null}
					deal={showDeal}
					rent={null}
				/>

				<div className="rounded-2xl border border-slate-200 p-4">
					<div
						className="cursor-pointer"
						onClick={() => window.open(deal.url, '_blank')}
					>
						{deal.url?.includes('autoscout24') && (
							<Image
								src="/autoscout24.svg"
								height="125"
								width="125"
								alt="autoscout"
							/>
						)}
						{deal.url?.includes('automobile') && (
							<Image
								src="/automobile.svg"
								height="125"
								width="125"
								alt="automobile"
							/>
						)}
						{deal.url?.includes('subito') && (
							<Image src="/subito.svg" height="125" width="125" alt="subito" />
						)}
						{deal.url?.includes('tuacar') && (
							<Image src="/tuacar.png" height="125" width="125" alt="tuacar" />
						)}
					</div>
					<p className="text-md mt-2">
						{deal.make && deal.model ? deal.make + ' ' + deal.model : ''}
					</p>
					<p className="text-md">{formatCurrencyEUR(deal.price)}</p>
					<p className="text-md">{deal.mileage} km</p>
					<p className="text-md">{deal.plate}</p>
					<div className="grid grid-cols-2 gap-2 mt-2">
						<motion.button
							onClick={() => goToERP(deal.erpId)}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white"
						>
							Vai su ERP
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white"
							onClick={() => creaPreventivo(deal.erpId, deal.contactId)}
						>
							Crea preventivo
						</motion.button>
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
							lead={null}
							deal={deal}
							setDeal={setDeal}
							setDeals={setDeals}
							messaggio="Invia Messaggio di conferma appuntamento"
						/>
					)}
					{email && (
						<SendEmail
							session={session}
							agency={agency}
							lead={null}
							deal={deal}
						/>
					)}
				</div>

				<div dangerouslySetInnerHTML={{ __html: emailAd }} />

			</div>

		</>
	);
}
