'use client';

import {motion} from 'framer-motion';
import {useState} from 'react';
import DatePicker from 'react-datepicker';
import {X} from 'lucide-react';
import ContactsManager from '@/app/components/contactsManager';
import {Toaster, toast} from 'sonner';
import {useAppContext} from '@/hooks/useAppContext';

export function Add({addDealTogglePopup, setDeals, session}: any) {
	const {agency}: any = useAppContext();

	//SELECT CONTACTS HANDLE
	const [contactName, setContactName] = useState('');
	const [isOpenSelectContacts, setIsOpenSelectContacts] = useState(false);

	const togglePopupSelectContacts = () => {
		setIsOpenSelectContacts(!isOpenSelectContacts);
	};

	const [deal, setDeal] = useState({
		userId: session.user.sub,
		stageId: 12, //7, 8, 9, 10
		title: '',
		value: '0',
		oldNotes: '',
		end: '',
		isAwarded: false,
		//createdAt: '',
		contactId: '',
		isFailed: false,
		pipelineId: 3,
		agencyCode: agency,
		carToBuyId: null,
		carId: null,
		carToRentId: null,
		emailId: null,
	});

	//ADD DEAL
	async function addDeal() {
		try {
			const params = {
				action: 'addAcquisizione',
				deal: deal,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/pipeline', options);
			const data = await response.json();

			//GET LAST DEAL AND ADD IT TO THE EXISTING LIST
			const paramsLastDeal = {
				action: 'acquisizioneById',
				id: data.insertId,
			};

			const optionsLastDeal = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(paramsLastDeal), // Use body instead of params
			};

			const responseLastDeal = await fetch('/api/pipeline', optionsLastDeal);
			const dataLastDeal = await responseLastDeal.json();

			setDeals((prevDeals: any) => [...prevDeals, dataLastDeal.data[0]]);

			toast('Affare aggiunto correttamente');
			addDealTogglePopup();
		} catch (error) {
			toast('Qualcosa è andato storto: ', error ? error : '');
		} finally {
			//UPDATE DEALS
			//success toast
		}
	}

	return (
		<>
			<Toaster />
			{isOpenSelectContacts && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopupSelectContacts} // Close the popup when clicking outside
				>
					<div className="relative h-[98%] w-[98%]">
						<motion.div
							initial={{opacity: 0, scale: 0.5}}
							animate={{opacity: 1, scale: 1}}
							transition={{duration: 0.2}}
							className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
							onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
						>
							<motion.button
								whileHover={{scale: 1.1}}
								whileTap={{scale: 0.9}}
								onClick={togglePopupSelectContacts}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<ContactsManager
								session={session}
								agency={agency}
								setContactName={setContactName}
								setDeal={setDeal}
								setNewActivity={null}
								setExtendedActivity={null}
								extendedActivity={null}
								togglePopupSelectCars={togglePopupSelectContacts}
							/>
						</motion.div>
					</div>
				</div>
			)}
			<div className="w-full mx-auto pt-2 mt-5">
				<div className="flex justify-between items-center gap-2 mb-2">
					<div className="flex gap-2 items-center w-full">
						<p className="text-2xl font-semilight mb-2">Aggiungi affare</p>
					</div>
				</div>
			</div>
			<div className="mt-5">
				<div className="rounded-2xl border border-slate-200">
					<div className="p-4">
						<p className="mb-1 font-light">Contatto</p>
						<motion.button
							onClick={togglePopupSelectContacts}
							whileHover={{scale: 1.01}}
							whileTap={{scale: 0.99}}
							className="mt-2 mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white"
						>
							{contactName == ''
								? 'Assegna contatto'
								: 'Contatto assegnato: ' + contactName}
						</motion.button>
						<p className="mb-1 font-light">Titolo</p>
						<input
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={deal.title}
							onChange={e =>
								setDeal(prevState => ({
									...prevState,
									title: e.target.value,
								}))
							}
						/>
						<p className="mb-1 font-light">Valore</p>
						<input
							type="number"
							className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
							value={deal.value}
							onChange={e =>
								setDeal(prevState => ({
									...prevState,
									value: e.target.value,
								}))
							}
						/>
						<p className="mb-2 mt-2 font-light">Fase della pipeline</p>
						<div className="mb-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
							<motion.div
								onClick={() =>
									setDeal(prevState => ({
										...prevState,
										stageId: 12,
									}))
								}
								className={`rounded-2xl ${deal.stageId == 12 ? 'bg-emerald-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-emerald-500`}
								whileHover={{scale: 1.01}}
								whileTap={{scale: 0.9}}
							>
								Cliente interessato
							</motion.div>
							<motion.div
								onClick={() =>
									setDeal(prevState => ({
										...prevState,
										stageId: 13,
									}))
								}
								className={`rounded-2xl ${deal.stageId == 13 ? 'bg-emerald-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-emerald-500`}
								whileHover={{scale: 1.01}}
								whileTap={{scale: 0.9}}
							>
								Appuntamento confermato
							</motion.div>
							<motion.div
								onClick={() =>
									setDeal(prevState => ({
										...prevState,
										stageId: 14,
									}))
								}
								className={`rounded-2xl ${deal.stageId == 14 ? 'bg-emerald-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-emerald-500`}
								whileHover={{scale: 1.01}}
								whileTap={{scale: 0.9}}
							>
								Proposta presentata
							</motion.div>
							<motion.div
								onClick={() =>
									setDeal(prevState => ({
										...prevState,
										stageId: 15,
									}))
								}
								className={`rounded-2xl ${deal.stageId == 15 ? 'bg-emerald-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-emerald-500`}
								whileHover={{scale: 1.01}}
								whileTap={{scale: 0.9}}
							>
								In sospeso
							</motion.div>
						</div>

						<p className="mt-4 mb-2 mb-1 font-light">
							Data di chiusura prevista
						</p>
						<DatePicker
							className="rounded-2xl bg-slate-200 p-2 mb-2"
							selected={deal.end ? new Date(deal.end) : null}
							onChange={(date: any) =>
								setDeal(prevState => ({
									...prevState,
									end: date,
								}))
							}
						/>
						<motion.button
							onClick={addDeal}
							whileHover={{scale: 1.01}}
							whileTap={{scale: 0.99}}
							className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white"
						>
							Aggiungi affare
						</motion.button>
					</div>
				</div>
			</div>
		</>
	);
}
