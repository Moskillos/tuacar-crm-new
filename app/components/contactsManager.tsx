'use client';
import { useAppContext } from '@/hooks/useAppContext';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function ContactsManager({
	session,
	agency,
	setContactName,
	setDeal,
	setNewActivity,
	setExtendedActivity,
	extendedActivity,
	togglePopupSelectCars,
}: any) {
	//GET CONTACTS
	const [contacts, setContacts] = useState<any>([]);
	const [contactsLoading, setContactsLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);

	async function getContacts() {
		setContactsLoading(true);
		setContacts([]);
		try {
			const params = {
				action: 'search',
				search: search,
				agencyCode: agency
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

			setContacts(data.data); // Assuming `data.data` contains the deals you want to set
			setTotalCount(data.count);
		} catch (error) {
			console.error('Failed to fetch cars:', error);
		} finally {
			setContactsLoading(false); // Assuming this is for managing loading state
		}
	}

	//ADD CONTACT
	const [showAddContact, setShowAddContact] = useState(false);
	/*
		id
		userId
		name
		organizationId
		label
		createdAt
		carId
		phoneNumber
		email
		isConfirmed
		carToBuyId
		notInterested
		isCommerciant
		carToRentId
		ragioneSociale
		agencyCode
	*/
	const [contact, setContact] = useState<any>({
		//id: '',
		userId:
			session && session.user && session.user.sub ? session.user.sub : null,
		name: '',
		organizationId: null,
		label: 'potenziale_cliente',
		//createdAt: '',
		//carId: '',
		phoneNumber: '',
		email: '',
		isConfirmed: false,
		//carToBuyId: '',
		//notInterested
		//isCommerciant
		//carToRentId
		ragioneSociale: '',
		agencyCode: agency,
	});

	async function addContact() {
		setContactsLoading(false);
		try {
			const params = {
				action: 'add',
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
				const data = await response.json();
				setContacts((prevContacts: any) => [...prevContacts, data.data]);
				setTotalCount(totalCount + 1);
				toast('Contatto aggiunto');
			} else {
				toast('Qualcosa è andato storto');
			}
		} catch (error) {
			console.error('Failed to add a new contact:', error);
		} finally {
			setContactsLoading(false); // Assuming this is for managing loading state
		}
	}

	//SELECT CONTACT
	const selectContact = (c: any) => {
		console.log('selected: ', c);
		if (setDeal != null) {
			setDeal((prevState: any) => ({
				...prevState,
				contactId: c.id,
			}));
		}
		if (setNewActivity != null) {
			setNewActivity((prevState: any) => ({
				...prevState,
				contactId: c.id,
			}));
		}
		if (setExtendedActivity != null && extendedActivity != null) {
			setExtendedActivity((prevState: any) => ({
				...prevState,
				extendedProps: {
					...prevState.extendedProps,
					contactName: c.name,
					contactId: c.id,
					contactEmail: c.email,
					contactPhoneNumber: c.phoneNumber,
					contactLabel: c.label,
				},
			}));
		}
		setContactName(c.name);
		togglePopupSelectCars(false);
	};

	//SEARCH FILTER
	const [search, setSearch] = useState('');

	return (
		<div>
			<Toaster />
			<div className="p-4 flex justify-between items-center gap-2">
				<div className="flex gap-2 items-center">
					<input
						className="rounded-xl border border-slate-100 p-2"
						placeholder="Cerca..."
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<motion.button
						onClick={getContacts}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="rounded-full p-2 text-white bg-blue-500"
					>
						<Search />
					</motion.button>
					<motion.button
						onClick={() => setShowAddContact(true)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="rounded-full p-2 text-white bg-blue-500"
					>
						<Plus />
					</motion.button>
				</div>
				<h1 className="font-semibold text-4xl text-right text-slate-500"></h1>
			</div>
			{showAddContact && (
				<div className="p-4">
					<div className="rounded-2xl border border-slate-200 overflow-y-auto">
						<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
							Aggiungi nuovo contatto
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
							<button
								onClick={addContact}
								className="rounded-xl bg-lime-500 hover:bg-lime-600 w-full p-2 text-white mt-4"
							>
								Aggiungi
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="p-4">
				{!contactsLoading && (
					<>
						{contacts
							.filter((e: any) =>
								JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
							)
							.map((e: any, index: number) => (
								<motion.div
									key={e.id} // Added a unique key for each deal
									onClick={() => selectContact(e)}
									drag
									dragElastic={1}
									dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.9 }}
									className="p-3 bg-slate-200 hover:bg-slate-300 rounded-xl mb-2 text-slate-800"
								>
									<div className="flex gap-4">
										<p className="flex-1">{e.name}</p>
										<p className="flex-1">{e.email ? e.email : '-'}</p>
										<p className="flex-1">
											{e.phoneNumber ? e.phoneNumber : '-'}
										</p>
										<p className="flex-1">
											{e.createdAt
												? e.createdAt.replace('T', ' ').replace('.000Z', '')
												: '-'}
										</p>
									</div>
								</motion.div>
							))}
					</>
				)}
				{contactsLoading && (
					<div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
				)}
			</div>
		</div>
	);
}
