'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { Contact } from './components/contact';
import { toast, Toaster } from 'sonner';
import { useAppContext } from '@/hooks/useAppContext';

export default function Contacts() {
	//FETCH SESSION & DETAILS
	const [session, setSession] = useState<any>(null);
	const [userRoles, setUserRoles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const { agency }: any = useAppContext();

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const response = await fetch('/api/session');
				if (response.ok) {
					const data = await response.json();
					setSession(data.session);
					setUserRoles(data.userRoles);
				} else {
					setSession(null);
				}
			} catch (error) {
				console.error('Error fetching session:', error);
				setSession(null);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, []);

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
				agencyCode: agency,
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
			console.error('Failed to fetch cars:', error);
		} finally {
			setContactsLoading(false); // Assuming this is for managing loading state
		}
	}

	//SELECT CONTACT HANDLER
	const [selectedContact, setSelectedContact] = useState(null);

	const selectContact = (contact: any) => {
		setSelectedContact(contact);
		setIsOpen(true);
	};

	const [isOpen, setIsOpen] = useState(false);

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		// Cleanup when the component is unmounted
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isOpen]);

	//SEARCH FILTER
	const [search, setSearch] = useState('');

	return (
		<>
			<Toaster />
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopup} // Close the popup when clicking outside
				>
					<div className="relative h-[98%] w-[98%]">
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
								onClick={togglePopup}
								className="absolute top-4 right-4 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<Contact
								session={session}
								agency={agency}
								selectedContact={selectedContact}
								setContacts={setContacts}
								setIsOpen={setIsOpen}
								setContactsLoading={setContactsLoading}
							/>
						</motion.div>
					</div>
				</div>
			)}
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
				{!contactsLoading && contacts && (
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
									className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl mb-2 text-slate-800"
								>
									<div className="flex gap-4">
										<p className="flex-1">{e.name}</p>
										<p className="flex-1">{e.email ? e.email : '-'}</p>
										<p className="flex-1">
											{e.phoneNumber ? e.phoneNumber : '-'}
										</p>
										<p className="flex-1">
											{e.createdAt
												? e.createdAt
													.replace('T', ' ')
													.replace('.000Z', '')
													.split(' ')[0]
													.split('-')
													.reverse()
													.join('-') +
												' ' +
												e.createdAt
													.replace('T', ' ')
													.replace('.000Z', '')
													.split(' ')[1]
												: '-'}
										</p>
									</div>
								</motion.div>
							))}
						{/*<p className="text-lg hover:cursor-pointer hover:font-semibold">Mostra altri {totalCount} contatti</p>*/}
					</>
				)}
				{contactsLoading && (
					<div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
				)}
			</div>
		</>
	);
}
