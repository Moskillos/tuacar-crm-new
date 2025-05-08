'use client';

import { useEffect, useMemo, useState } from 'react';
import {
	FlagIcon,
	PhoneCallIcon,
	Users2Icon,
	X,
	Trash,
	Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ContactsManager from '../components/contactsManager';
import { toast, Toaster } from 'sonner';
import { Separator, Spinner } from '@radix-ui/themes';
import { Calendar } from './components/calendar';
import { DealCard } from './components/dealCard';
import { ContactCard } from './components/contactCard';
import { useAppContext } from '@/hooks/useAppContext';

export default function CalendarPage() {
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

	//GET CALENDAR
	const [activities, setActivities] = useState<any>([]);
	const [activitiesLoading, setActivitiesLoading] = useState(true);
	useEffect(() => {
		async function getActivities() {
			try {
				const params = {
					action: 'get',
					agency: agency,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', // Set content type to JSON
					},
					body: JSON.stringify(params), // Use body instead of params
				};

				const response = await fetch('/api/calendar', options);
				const data = await response.json();

				setActivities(data.data); // Assuming `data.data` contains the deals you want to set
			} catch (error) {
				console.error('Failed to fetch deals:', error);
			} finally {
				setActivitiesLoading(false); // Assuming this is for managing loading state
			}
		}
		if (agency != '') {
			getActivities();
		}
	}, [agency]);

	//CALENDAR MANAGER HANDLERS
	const [action, setAction] = useState('add');
	const [openDialogNewActivity, setOpenDialogNewActivity] =
		useState<boolean>(false);
	const [newActivity, setNewActivity] = useState<any>({
		userId: session?.user?.sub,
		agencyCode: agency,
		contactId: null,
		dealId: null,
		carToBuyId: null,
		carId: null,
		carToRentId: null,
		erpId: null,
		title: 'Chiamata',
		//start: startDateTime.toISOString(),
		//end: new Date(startDateTime.getTime() + 30 * 60000).toISOString(),
		allDay: false,
		action: 'meeting',
		isComplete: false,
		notes: '',
	});

	//SELECT & CREATE EVENT
	function handleDateClick(start: string, end: string) {
		setAction('add');
		setContactName('');
		setNewActivity((prev: any) => ({
			...prev,
			userId: session?.user?.sub,
			agencyCode: agency,
			contactId: null,
			dealId: null,
			carToBuyId: null,
			carId: null,
			carToRentId: null,
			erpId: null,
			title: 'Chiamata',
			allDay: false,
			action: 'meeting',
			isComplete: false,
			notes: '',
			start,
			end,
		}));
		setOpenDialogNewActivity(true);
		setExtendedActivity(null);
	}

	//SELECT EVENT -> EDIT
	const [extendedActivity, setExtendedActivity] = useState<any>(null);
	const selectActivity = (activity: any, id: any) => {
		setNewActivity({
			id: id,
			userId: activity.extendedProps.userId,
			agencyCode: activity.extendedProps.agencyCode,
			contactId: activity.extendedProps.contactId,
			dealId: activity.extendedProps.dealId,
			carToBuyId: activity.extendedProps.carToBuyId,
			carId: activity.extendedProps.carId,
			carToRentId: activity.extendedProps.carToRentId,
			erpId: activity.extendedProps.erpId,
			title: activity.title,
			//start: activity.start,
			//end: activity.end,
			//allDay: activity.extendedProps.allDay,
			action: activity.extendedProps.action,
			isComplete: activity.extendedProps.isComplete,
			notes: activity.extendedProps.notes,
		});
		setContactName(activity.extendedProps.contactName);
		setExtendedActivity(activity);
		setAction('update');
		setOpenDialogNewActivity(!openDialogNewActivity);
	};

	//UPDATE CALENDAR DATES
	async function updateEventDates(
		activityId: number,
		start: string,
		end: string
	) {
		const params = {
			action: 'update',
			activity: {
				id: activityId,
				start: start,
				end: end,
			},
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/calendar', options);

		if (response.status == 200) {
			toast('Evento aggiornato');
			setOpenDialogNewActivity(false);
		} else {
			toast('Qualcosa è andato storto');
		}
	}

	//ADD/UPDATE ACTIVITY
	async function manageActivity() {
		const params = {
			action: action,
			activity: newActivity,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/calendar', options);
		const data = await response.json();

		if (response.status == 200) {
			if (action == 'add') {
				setActivities((prevActivities: any) => [...prevActivities, data.data]);
			}
			if (action == 'update') {
				setActivities((prevItems: any[]) =>
					prevItems.map(item =>
						parseInt(item.id) === parseInt(newActivity.id)
							? { ...item, ...newActivity }
							: item
					)
				);
			}
			toast('Evento aggiornato');
			setOpenDialogNewActivity(false);
		} else {
			toast('Qualcosa è andato storto');
		}
	}

	//DELETE EVENT
	async function deleteActivity() {
		const params = {
			action: 'delete',
			activity: newActivity,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/calendar', options);

		if (response.status == 200) {
			setActivities((prevItems: any[]) =>
				prevItems.filter(item => parseInt(item.id) !== parseInt(newActivity.id))
			);
			toast('Evento eliminato');
			setOpenDialogNewActivity(false);
		} else {
			toast('Qualcosa è andato storto');
		}
	}

	//COMPLETE ACTIVITY
	async function completeActivity() {
		const params = {
			action: 'completeActivity',
			activity: newActivity,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/calendar', options);

		if (response.status == 200) {
			setActivities((prevItems: any[]) =>
				prevItems.map(item =>
					parseInt(item.id) === parseInt(newActivity.id)
						? { ...item, isComplete: true }
						: item
				)
			);
			toast('Evento completato');
			setOpenDialogNewActivity(false);
		} else {
			toast('Qualcosa è andato storto');
		}
	}

	//RICORDA APPUNTAMENTO
	const [ricordaLoadingState, setRicordaLoadingState] = useState(false);
	async function ricordaEvento() {
		if (!newActivity.carToBuyId && !newActivity.carId) {
			toast("Nessun veicolo assegnato, non possiamo inviare questo template Spoki")
			return
		}
		setRicordaLoadingState(true);
		const params = {
			action: 'ricordaEvento',
			activity: newActivity,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set content type to JSON
			},
			body: JSON.stringify(params), // Use body instead of params
		};

		const response = await fetch('/api/spoki', options);

		if (response.status == 200) {
			toast('Promemoria inviato');
		} else {
			toast('Qualcosa è andato storto');
		}
		setRicordaLoadingState(false);
	}

	//ASSIGN COLORS TO DIFFERENT EVENTS TYPES
	const parsedActivities = useMemo(() => {
		return activities.map((activity: any) => {
			let color = '';
			if (activity.isComplete) {
				color = 'gray';
			} else if (!activity.isComplete && activity.carToBuyId && activity.dealPipelineId === 3) {
				color = 'green';
			} else if (!activity.isComplete && activity.carId && activity.dealPipelineId === 2) {
				color = 'blue';
			} else if (!activity.isComplete && activity.carToRentId && activity.dealPipelineId === 4) {
				color = 'orange';
			} else if (!activity.isComplete && activity.dealPipelineId === 5) {
				color = '#EAB307';
			} else if (activity.dealPipelineId === 3) {
				color = 'green';
			} else {
				if (activity.action == 'meeting') {
					color = 'purple';
				}
				if (activity.action == 'email') {
					color = '#fcd303';
				}
				if (activity.action == 'expiration') {
					color = 'red';
				}
			}
			return {
				...activity,
				color,
			};
		});
	}, [activities]);

	//SELECT CONTACTS HANDLER
	const [contactName, setContactName] = useState('');
	const [isOpenSelectContacts, setIsOpenSelectContacts] = useState(false);

	const togglePopupSelectContacts = () => {
		setIsOpenSelectContacts(!isOpenSelectContacts);
	};

	return (
		<>
			<Toaster />
			{openDialogNewActivity && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					//onClick={() => setOpenDialogNewActivity(false)} // Close the popup when clicking outside
				>
					<div className="relative h-[70%] w-[50%]">
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
								onClick={() => setOpenDialogNewActivity(false)}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<div className="w-full mx-auto pt-2 mt-1">
								<div className="flex justify-between items-center gap-2 mb-2">
									<div className="flex gap-2 items-center w-full">
										<p className="text-2xl font-semilight mb-2">
											{action == 'add'
												? 'Aggiungi attività'
												: 'Aggiorna attività'}
										</p>
									</div>
								</div>

								<DealCard extendedActivity={extendedActivity} />

								<p className="mb-1 font-light mt-4">Titolo</p>
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
								<p className="mb-1 font-light mt-2">Contatto</p>
								<div className="grid grid-cols-2 gap-2">
									<ContactCard
										contactId={newActivity.contactId}
										togglePopupSelectContacts={togglePopupSelectContacts}
									/>
								</div>
								<Separator className="mt-5 mb-5" />
								{action == 'update' && (
									<div className="grid grid-cols-3 gap-2">
										<motion.button
											onClick={deleteActivity}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											className="mb-2 rounded-xl bg-red-500 hover:bg-red-600 w-full p-2 text-white flex justify-center items-center"
										>
											<Trash />
										</motion.button>
										<motion.button
											onClick={() =>
												!newActivity.isComplete
													? completeActivity()
													: toast.success('Hai già completato questa attività')
											}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											className="mb-2 rounded-xl bg-stone-500 hover:bg-stone-600 w-full p-2 text-white flex justify-center items-center"
										>
											{!newActivity.isComplete ? 'Completa' : <Check />}
										</motion.button>
										<motion.button
											disabled={ricordaLoadingState}
											onClick={ricordaEvento}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											className={`${!ricordaLoadingState ? 'bg-lime-500 hover:bg-lime-600' : 'bg-slate-400'} mb-2 rounded-xl w-full p-2 text-white`}
										>
											{ricordaLoadingState && (
												<div className="flex justify-center items-center p-1">
													<Spinner />
												</div>
											)}
											{!ricordaLoadingState && 'Ricorda via Spoki'}
										</motion.button>
									</div>
								)}
								<motion.button
									onClick={manageActivity}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white"
								>
									{action == 'add' ? 'Aggiungi attività' : 'Aggiorna attività'}
								</motion.button>
							</div>
						</motion.div>
					</div>
				</div>
			)}
			{isOpenSelectContacts && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					//onClick={togglePopupSelectContacts} // Close the popup when clicking outside
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
								onClick={togglePopupSelectContacts}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<ContactsManager
								session={session}
								agency={agency}
								setContactName={setContactName}
								setDeal={null}
								setNewActivity={setNewActivity}
								setExtendedActivity={setExtendedActivity}
								extendedActivity={extendedActivity}
								togglePopupSelectCars={togglePopupSelectContacts}
							/>
						</motion.div>
					</div>
				</div>
			)}
			<div className="h-[calc(100vh-56px)] p-8">
				{!activitiesLoading && (
					<Calendar
						parsedActivities={parsedActivities}
						selectActivity={selectActivity}
						updateEventDates={updateEventDates}
						handleDateClick={handleDateClick}
					/>
				)}
			</div>
		</>
	);
}
