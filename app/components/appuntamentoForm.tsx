'use client';
import { motion } from 'framer-motion';
import { FlagIcon, PhoneCallIcon, Users2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { it } from 'date-fns/locale/it';
import { Spinner } from '@radix-ui/themes';

registerLocale('it', it);

export default function AppuntamentoForm({
	setEvent,
	session,
	agency,
	lead,
	deal,
	setDeal,
	setDeals,
	messaggio,
}: any) {

	const [sendActivityLoading, setActivityLoading] = useState(false);
	const [newActivity, setNewActivity] = useState<any>({
		userId: session?.user?.sub,
		agencyCode: agency,
		contactId: lead ? lead.contactId : deal.contactId,
		dealContactId: deal && deal.dealContactId ? deal.dealContactId : '',
		dealUserId: deal && deal.dealUserId ? deal.dealUserId : '',
		dealId: deal ? deal.dealId : null,
		carToBuyId: lead ? lead.id : deal.carToBuyId ? deal.carToBuyId : null,
		carId: deal && deal.carId ? deal.carId : null,
		carToRentId: deal && deal.carToRentId ? deal.carToRentId : null,
		...(deal && deal.garageId && { garageId: deal.garageId }),
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
	const [checked, setChecked] = useState(false);
	async function manageActivity() {
		setActivityLoading(true);
		if (newActivity.start == null || newActivity.end == null) {
			toast('Inserisci delle date!');
		} else {
			const params = {
				action: action,
				agencyCode: agency,
				activity: newActivity,
				deal: deal ? deal : null,
				lead: lead ? lead : null,
				sendSpoki: checked,
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
				if (deal && deal.stageId === 7 && deal.pipelineId === 2) {
					setDeal((prevState: any) => ({
						...prevState,
						stageId: 8,
					}));
					setDeals((prevItems: any[]) =>
						prevItems.map(item =>
							item.dealId === deal.dealId ? { ...item, stageId: 8 } : item
						)
					);
				}
				toast('Evento aggiornato');
				setActivityLoading(false);
				if (lead) {
					const responseJson = await response.json();
					//router.push('/pipeline/acquisizione' + '?id=' + responseJson.data);
					window.location.href =
						'/pipeline/acquisizione?id=' + responseJson.data;
				}
				window.open('/calendar', '_blank');
			} else {
				toast('Qualcosa è andato storto');
			}
		}
	}

	return (
		<>
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
				<div className="flex flex-items-center gap-2 mt-2 mb-2">
					<input
						type="checkbox"
						checked={checked}
						className="hover:cursor-pointer"
						onChange={() => setChecked(!checked)} // Use onChange instead of onClick
					/>
					<p>{messaggio}</p>
				</div>
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
		</>
	);
}
