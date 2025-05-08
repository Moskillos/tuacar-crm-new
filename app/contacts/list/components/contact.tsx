'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FlagIcon, PhoneCallIcon, Users2Icon } from 'lucide-react';

export function Contact({
	session,
	agency,
	selectedContact,
	setContacts,
	setIsOpen,
	setContactsLoading,
}: any) {
	const router = useRouter();

	const [contact, setContact] = useState<any>(selectedContact);

	//UPDATE CONTACT
	async function updateContact() {
		setContactsLoading(true);
		try {
			const params = {
				action: 'updateById',
				id: contact.id,
				contact: {
					...contact,
					userId:
						session && session.user && session.user.sub
							? session.user.sub
							: null,
					agencyCode: agency,
				},
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/contacts', options);

			if (response.status == 200) {
				setContacts((prevItems: any[]) =>
					prevItems.map(item =>
						item.id === selectedContact.id
							? {
								...item,
								name: contact.name,
								email: contact.email,
								phoneNumber: contact.phoneNumber,
								label: contact.label,
							}
							: item
					)
				);
				toast('Contatto aggiornato');
				setIsOpen(false);
				setContactsLoading(false);
			} else {
				toast('Qualcosa è andato storto');
			}
		} catch (error) {
			console.error('Failed to update contact:', error);
		} finally {
		}
	}

	//DELETE CONTACT
	async function deleteContact() {
		setContactsLoading(true);
		try {
			const params = {
				action: 'deleteById',
				id: contact.id,
				contact: {
					...contact,
					userId:
						session && session.user && session.user.sub
							? session.user.sub
							: null,
					agencyCode: agency,
				},
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/contacts', options);

			if (response.status == 200) {
				setContacts((prevItems: any[]) =>
					prevItems.filter(item => item.id !== selectedContact.id)
				);
				toast('Contatto eliminato');
				setIsOpen(false);
				setContactsLoading(false);
			} else {
				toast('Qualcosa è andato storto');
			}
		} catch (error) {
			console.error('Failed to delete contact:', error);
		} finally {
		}
	}

	//GET AFFAIRS
	const [contactDeals, setContactDeals] = useState([]);
	const [contactDealsLoading, setContactDealsLoading] = useState(true);
	async function getContactDeals() {
		try {
			const params = {
				action: 'getContactDeals',
				contactId: contact.id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/contacts', options);

			if (response.status == 200) {
				const data = await response.json();
				setContactDeals(data.data);
				setContactDealsLoading(false);
			}
		} catch (error) {
			console.error('Failed to update contact:', error);
		} finally {
		}
	}

	//GET CARS
	const [contactCars, setContactCars] = useState([]);
	const [contactCarsLoading, setContactCarsLoading] = useState(true);
	async function getContactCars() {
		try {
			const params = {
				action: 'getContactCars',
				contactId: contact.id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/contacts', options);

			if (response.status == 200) {
				const data = await response.json();
				setContactCars(data.data);
				setContactCarsLoading(false);
			}
		} catch (error) {
			console.error('Failed to fetch cars:', error);
		} finally {
		}
	}

	//GET CARS TO BUY
	const [contactCarsToBuy, setContactCarsToBuy] = useState([]);
	const [contactCarsToBuyLoading, setContactCarsToBuyLoading] = useState(true);
	async function getContactCarsToBuy() {
		try {
			const params = {
				action: 'getContactCarsToBuy',
				contactId: contact.id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/contacts', options);

			if (response.status == 200) {
				const data = await response.json();
				setContactCarsToBuy(data.data);
				setContactCarsToBuyLoading(false);
			}
		} catch (error) {
			console.error('Failed to fetch cars to buy:', error);
		} finally {
		}
	}

	useEffect(() => {
		getContactDeals();
		getContactCarsToBuy();
		getContactCars();
	}, []);

	//GO TO DEAL
	const goTo = (pipeline: number, dealId: string) => {
		router.push(
			`/pipeline/${pipeline === 2 ? 'vendita' : 'acquisizione'}?id=${dealId}`
		);
	};


	const [sendActivityLoading, setActivityLoading] = useState(false);
	const [newActivity, setNewActivity] = useState<any>({
		userId: session?.user?.sub,
		agencyCode: agency,
		contactId: contact.id,
		dealContactId: '',
		dealUserId: '',
		dealId: null,
		carToBuyId: null,
		carId: null,
		carToRentId: null,
		erpId: null,
		title: 'Chiamata',
		start: new Date(),
		end: null,
		allDay: false,
		action: 'meeting',
		isComplete: false,
		notes: '',
	});

	//ADD/UPDATE ACTIVITY
	const action = 'add';
	async function manageActivity() {
		setActivityLoading(true);
		if (newActivity.start == null || newActivity.end == null) {
			toast('Inserisci delle date!');
		} else {
			const params = {
				action: action,
				agencyCode: agency,
				activity: newActivity,
				deal: null,
				lead: null,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response: any = await fetch('/api/calendar', options);

			if (response.status == 200) {
				toast('Evento creato');
				setActivityLoading(false);
				window.open('/calendar', '_blank');
			} else {
				toast('Qualcosa è andato storto');
			}
		}
	}

	return (
		<>
			<div className="w-full pt-2 mt-4">
				<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-2">
					<div className="rounded-2xl border border-slate-200">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Contatto
						</div>
						<div className="p-4">
							<p className="mb-1 font-light">Nome</p>
							<input
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3 font-light"
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
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3 font-light"
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
								type="number"
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3 font-light"
								value={contact.phoneNumber}
								onChange={e =>
									setContact((prevState: any) => ({
										...prevState,
										phoneNumber: e.target.value,
									}))
								}
							/>
							<div className="grid grid-cols-2 gap-2 mb-3">
								<div
									onClick={() =>
										setContact((prevState: any) => ({
											...prevState,
											label: 'potenziale_cliente',
										}))
									}
									className={`text-center hover:cursor-pointer rounded-xl ${contact.label == 'potenziale_cliente' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-slate-200 text-black hover:bg-blue-600 hover:text-white'} w-full p-2 mt-1 font-light`}
								>
									Cliente
								</div>
								<div
									onClick={() =>
										setContact((prevState: any) => ({
											...prevState,
											label: 'potenziale_fornitore',
										}))
									}
									className={`text-center hover:cursor-pointer rounded-xl ${contact.label == 'potenziale_fornitore' ? 'bg-emerald-400 hover:bg-emerald-500 text-white' : 'bg-slate-200 text-black hover:bg-emerald-500 hover:text-white'} w-full p-2 mt-1 font-light`}
								>
									Fornitore
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={updateContact}
									className="rounded-xl bg-lime-500 hover:bg-lime-600 w-full p-2 text-white mt-4"
								>
									Salva
								</button>
								<button
									onClick={deleteContact}
									className="rounded-xl bg-red-500 hover:bg-red-600 w-full p-2 text-white mt-4"
								>
									Elimina
								</button>
							</div>
						</div>
					</div>
					<div className="rounded-2xl border border-slate-200">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Appuntamento
						</div>
						<div className="p-4">
							<Toaster />
							<p className="mb-1 font-light">Titolo</p>
							<input
								className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
								value={newActivity.title}
								onChange={e =>
									setNewActivity((prevState: any) => ({
										...prevState,
										title: e.target.value,
									}))
								}
							/>
							<div className="mt-2 mb-3 p-1 bg-slate-200 w-full grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-1 rounded-2xl font-semilight">
								<div
									onClick={() =>
										setNewActivity((prevState: any) => ({
											...prevState,
											action: 'meeting',
											title: 'Appuntamento',
										}))
									}
									className={`${newActivity.action == 'meeting' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center hover:cursor-pointer"`}
								>
									<Users2Icon className="w-3.5 h-3.5 " />
								</div>
								<div
									onClick={() =>
										setNewActivity((prevState: any) => ({
											...prevState,
											action: 'expiration',
											title: 'Scadenza',
										}))
									}
									className={`${newActivity.action == 'expiration' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center hover:cursor-pointer"`}
								>
									<FlagIcon className="w-3.5 h-3.5 " />
								</div>
								<div
									onClick={() =>
										setNewActivity((prevState: any) => ({
											...prevState,
											action: 'call',
											title: 'Chiamata',
										}))
									}
									className={`${newActivity.action == 'call' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center hover:cursor-pointer"`}
								>
									<PhoneCallIcon className="w-3.5 h-3.5 " />
								</div>
							</div>

							<DatePicker
								locale="it"
								className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4 mr-1"
								selected={newActivity.start}
								showTimeSelect
								dateFormat="Pp"
								onChange={date => {
									setNewActivity((prevState: any) => ({
										...prevState,
										start: date
									}))
								}
								}
							/>

							<DatePicker
								locale="it"
								className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4"
								selected={newActivity.end}
								showTimeSelect
								dateFormat="Pp"
								onChange={date =>
									setNewActivity((prevState: any) => ({
										...prevState,
										end: date,
									}))
								}
							/>

							<p className="mb-1 font-light">Nota</p>
							<textarea
								value={newActivity.notes}
								onChange={e =>
									setNewActivity((prevState: any) => ({
										...prevState,
										notes: e.target.value,
									}))
								}
								className="rounded-xl bg-slate-200 w-full p-2"
							></textarea>

							<motion.button
								disabled={sendActivityLoading}
								onClick={manageActivity}
								whileHover={{ scale: !sendActivityLoading ? 1.01 : 1 }}
								whileTap={{ scale: !sendActivityLoading ? 0.99 : 1 }}
								className={`rounded-xl ${!sendActivityLoading ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
							>
								{sendActivityLoading && (
									<div className="flex justify-center items-center p-1">
										<Spinner />
									</div>
								)}
								{!sendActivityLoading && (
									<>{action == 'add' ? 'Aggiungi attività' : 'Aggiorna attività'}</>
								)}
							</motion.button>
						</div>
					</div>
					<div className="rounded-2xl border border-slate-200">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Affari
						</div>
						<div className="p-4">
							{contactDealsLoading && (
								<div className="p-2 bg-slate-200 rounded-2xl text-slate-200 mb-2"></div>
							)}
							{!contactDealsLoading && (
								<>
									{contactDeals.map((c: any) => (
										<div
											onClick={() => goTo(c.pipelineId, c.id)}
											key={c.id}
											className="p-2 bg-slate-200 rounded-2xl text-black mb-2 hover:cursor-pointer"
										>
											{c.title}
										</div>
									))}
									{contactDeals.length === 0 && (
										<p>Nessun affare collegato a questo utente</p>
									)}
								</>
							)}
						</div>
					</div>
					<div className="rounded-2xl border border-slate-200">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Auto in vendita
						</div>

						<div className="p-4">
							{contactCarsLoading && (
								<div className="p-2 bg-slate-200 rounded-2xl text-slate-200 mb-2"></div>
							)}
							{!contactCarsLoading && (
								<>
									{contactCars.map((c: any) => (
										<div
											key={c.id}
											className="p-2 bg-slate-200 rounded-2xl text-black mb-2 hover:cursor-pointer"
											onClick={() => goTo(c.pipelineId, c.id)}
										>
											{c.make} - {c.model}
										</div>
									))}
									{contactCars.length === 0 && <p>Nessuna auto in vendita</p>}
								</>
							)}
						</div>
					</div>
					<div className="rounded-2xl border border-slate-200">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Auto acquisite
						</div>
						<div className="p-4">
							{contactCarsToBuyLoading && (
								<div className="p-2 bg-slate-200 rounded-2xl text-slate-200 mb-2"></div>
							)}
							{!contactCarsToBuyLoading && (
								<>
									{contactCarsToBuy.length > 0 && (
										<>
											{contactCarsToBuy.map((c: any) => (
												<div
													key={c.id}
													className="p-2 bg-slate-200 rounded-2xl text-black mb-2 hover:cursor-pointer"
													onClick={() => toast('Funzione dettagli in arrivo')}
												>
													{c.make} - {c.description}
												</div>
											))}
										</>
									)}
									{contactCarsToBuy.length === 0 && (
										<p>Nessuna auto in acquisizione</p>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div >
		</>
	);
}
