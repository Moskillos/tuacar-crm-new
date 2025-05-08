'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import NotesManager from '@/app/components/notesManager';
import AppuntamentoForm from '@/app/components/appuntamentoForm';
import SendEmail from '@/app/components/sendEmail';
import { Spinner } from '@radix-ui/themes';
import GarageCarDetails from './garageCarDetails';
import { X } from 'lucide-react';
import { PeriziaPop } from './periziaPop';
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { DettagliPop } from './dettagliAuto';

export function GarageLead({
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
		contactNotInterested: any
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
				prevItems.filter(item => item.id !== lead.id)
			);
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


	//PERIZIA
	const [isOpenPerizia, setIsOpenPerizia] = useState(false);
	const [isOpenDettagli, setIsOpenDettagli] = useState(false);
	const togglePopup = (target: string) => {
		target == 'perizia' ? setIsOpenPerizia(!isOpenPerizia) : setIsOpenDettagli(!isOpenDettagli)
		return;
	};

	const exitPop = () => {
		setIsOpenDettagli(false)
		setIsOpenPerizia(false)
	}

	return (
		<>
			<Toaster />
			{(isOpenPerizia || isOpenDettagli) && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={() => exitPop()}
				>
					<div className="relative h-[99%] w-[99%]">
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
							className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
							onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
						>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={exitPop}
								className="absolute top-2 right-2 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							{isOpenPerizia &&
								<PeriziaPop lead={lead} />
							}
							{isOpenDettagli &&
								<DettagliPop lead={lead} />
							}
						</motion.div>
					</div>
				</div>
			)}

			<div className="flex justify-between items-center gap-2 mb-2">
				<div className="flex gap-2 items-center w-full mt-8">
					<div className="flex gap-2 items-center w-full">
						<p className="text-2xl font-semilight mb-2">{lead.marca + " " + lead.modello}</p>
					</div>
					<div>
						{lead.isConfirmed == 1 && (
							<motion.button
								onClick={() => updateLead('reset', null, true, null, null)}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="rounded-xl bg-emerald-400 hover:bg-emerald-500 p-2 text-white w-[125px] ml-2"
							>
								Resetta
							</motion.button>
						)}
						{lead.isConfirmed == 0 && (
							<motion.button
								//onClick={() => updateLead('assign', true, null, null, null)}
								onClick={() => toast('Funzione disattivata')}
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
							className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white"
						>
							Salva
						</motion.button>
					</div>
				</div>

				<NotesManager
					session={session}
					agency={agency}
					lead={lead}
					deal={null}
					rent={null}
				/>

				<div className="rounded-2xl border border-slate-200 p-4">
					<motion.button
						disabled={sendSpokiLoading}
						onClick={sendPresentazione}
						whileHover={{ scale: !sendSpokiLoading ? 1.01 : 1 }}
						whileTap={{ scale: !sendSpokiLoading ? 0.99 : 1 }}
						className={`rounded-xl ${!sendSpokiLoading ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
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
						className="cursor-pointer mt-5"
					//onClick={() => window.open(lead.url, '_blank')}
					>
						<Image src="/tuacar.png" height="125" width="125" alt="tuacar" />
					</div>

					<div className="w-[300px] overflow-hidden rounded-md shadow-[0_2px_10px] shadow-blackA4 mt-4">
						<AspectRatio.Root ratio={16 / 9}>
							<img
								className="size-full object-cover"
								src={`https://manager-api.tuacar.it/image/${lead.accessori.immagini[0]}`}
								//src={`https://ik.imagekit.io/${lead.accessori.immagini[0]}`}
								//src="https://s3.eu-central-2.wasabisys.com/tuacar/mobile-app/new-sell-items/auth0%7C66cdb608febb4441fe4dcf96/caabb8db-334e-4fd5-b9af-534f27e0ff96/29-11-2024:10-47-46.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PRWSPNV7RWV5Z8WMYDN9%2F20241129%2Feu-central-2%2Fs3%2Faws4_request&X-Amz-Date=20241129T094748Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=35579ea3428ecd550a430a341dc29754b0ff32336e0e06965671791365ceb661"
								alt="carImage"
							/>
						</AspectRatio.Root>
					</div>

					<div className="overflow-x-auto mt-5">
						<table className="w-full text-xs">
							<thead>

							</thead>
							<tbody>
								<GarageCarDetails lead={lead} />
							</tbody>
						</table>
					</div>

					<div className="grid grid-cols-3 gap-2 mt-2">
						<motion.button
							onClick={() => togglePopup('dettagli')}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-slate-400 hover:bg-slate-500 w-full p-2 text-white"
						>
							Accessori
						</motion.button>
						<motion.button
							onClick={() => togglePopup('perizia')}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-emerald-400 hover:bg-emerald-500 w-full p-2 text-white"
						>
							Perizia
						</motion.button>
						<motion.button
							onClick={() => toast('in arrivo')}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-zinc-400 hover:bg-zinc-500 w-full p-2 text-white"
						>
							Sposta su ERP
						</motion.button>
					</div>

					<div className="grid grid-cols-3 gap-2 mt-2">
						{lead.contactIsCommerciant == true && (
							<motion.button className="rounded-xl bg-slate-500 w-full p-2 text-white">
								Lead commerciante
							</motion.button>
						)}
						{lead.contactIsCommerciant == false && (
							<motion.button
								//onClick={() => updateLead('isCommerciant', null, null, true, null)}
								onClick={() => toast('Funzione disattivata')}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="rounded-xl bg-yellow-400 hover:bg-yellow-500 w-full p-2 text-white"
							>
								Commerciante
							</motion.button>
						)}

						{lead.contactNotInterested == true && (
							<motion.button className="rounded-xl bg-slate-500 w-full p-2 text-white">
								Lead non interessato
							</motion.button>
						)}
						{lead.contactNotInterested == false && (
							<motion.button
								//onClick={() => updateLead('notInterested', null, null, null, true)}
								onClick={() => toast('Funzione disattivata')}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="rounded-xl bg-orange-400 hover:bg-orange-500 w-full p-2 text-white"
							>
								Non interessato
							</motion.button>
						)}

						<motion.button
							//onClick={() => updateLead('venduta', null, null, null, null)}
							onClick={() => toast('Funzione disattivata')}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="rounded-xl bg-red-400 hover:bg-red-500 w-full p-2 text-white"
						>
							Venduta
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
