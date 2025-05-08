'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AppuntamentoForm from '@/app/components/appuntamentoForm';
import { toast } from 'sonner';
import { Pencil, X } from 'lucide-react';
import NotesManager from '@/app/components/notesManager';
import SendEmail from '@/app/components/sendEmail';
import { Spinner } from '@radix-ui/themes';
import sendRentDates from '@/app/api/spoki/_actions/sendRentDates';
import AssignRentCar from './assignRentCar';
//import { sendUpdatedRentDatesViaSpoki } from '@/app/api/rent/_actions/sendUpdatedRentDatesViaSpoki';
import React from 'react';
import DatePicker from 'react-datepicker';
import CalendarComponent from './CalendarComponent';

function getDaysBetweenDates(start: any, end: any) {
	// Convert the start and end dates to Date objects
	const startDate = new Date(start);
	const endDate = new Date(end);

	// Create an array to store the dates
	const dates = [];

	// Iterate from the start date to the end date
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		// Format the date as "DD-MM-YYYY"
		const formattedDate = `${String(d.getDate()).padStart(2, "")}-${String(d.getMonth() + 1).padStart(
			2,
			""
		)}-${d.getFullYear()}`;
		dates.push(formattedDate);
	}

	return dates;
}

export function Deal({
	session,
	agency,
	togglePopup,
	setDeals,
	showDeal,
	setSelectedDeal,
	rentCars,
	getRentCars
}: any) {

	//AGGIORNA STATO DEAL NOLEGGIO
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
			action: 'updateBreveTermineById',
			id: showDeal.dealId,
			showDeal: showDeal,
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

		getRentDates(showDeal.erpId)
	};

	//CONTACTS
	const [contact, setContact] = useState<any>({
		id: showDeal.contactId,
		name: showDeal.contactName,
		phoneNumber: showDeal.contactPhoneNumber,
		email: showDeal.contactEmail,
	});

	//AGGIORNA DETTAGLI CONTATTO
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

	const [rented, setRented] = useState<any>([])
	const [hold, setHold] = useState<any>([])
	const [init, setInit] = useState<any>([])
	const [datesLoading, setDatesLoading] = useState(true)

	const getRentDates = (erpId: string) => {
		setDatesLoading(true)
		const params = {
			erpId: erpId,
		};
		const options = {
			method: "POST",
			body: JSON.stringify(params),
		};
		fetch("/api/rent/getRentCar", options)
			.then((res) => res.json())
			.then((data) => {
				/*
				const rentedTmp: any = [];
				const holdTmp: any = [];
				const initTmp: any = [];
				*/
				data.deals.forEach((d: any) => {
					const datesArray = getDaysBetweenDates(d.start, d.end);

					if (d.rentStatus == "init") {
						setInit((prevDeals: any) => [...prevDeals, ...datesArray]);
					}
					if (d.rentStatus == "hold") {
						setHold((prevDeals: any) => [...prevDeals, ...datesArray]);
					}
					if (d.rentStatus == "rented") {
						setRented((prevDeals: any) => [...prevDeals, ...datesArray]);
					}
				});

				/*
				setRented(rentedTmp.length > 0 ? rentedTmp[0] : []);
				setHold(holdTmp.length > 0 ? holdTmp[0] : []);
				setInit(initTmp.length > 0 ? initTmp[0] : []);
				*/
			})
			.catch((error) => {
				console.log(error);
			});
		setDatesLoading(false)
	};

	useEffect(() => {
		getRentDates(deal?.erpId ? deal.erpId : "");
		/*
		const startArray =
			deal && deal.start
				? deal.start.toString().split("T")[0].split("-")
				: ["2020", "01", "01"];
		const endArray =
			deal && deal.end
				? deal.end.toString().split("T")[0].split("-")
				: ["2020", "01", "01"];
		setDate({
			from: new Date(Date.UTC(parseInt(startArray[0]), parseInt(startArray[1]) - 1, parseInt(startArray[2]))),
			to: new Date(Date.UTC(parseInt(endArray[0]), parseInt(endArray[1]) - 1, parseInt(endArray[2]))),
		});
		*/
	}, [deal]);


	//new Date(dates.start);
	const [date, setDate] = React.useState<any>({
		from: new Date(deal.start),
		to: new Date(deal.end),
	});


	//AGGIORNA STATO NOLEGGIO
	const updateRentStatus = async (deal: any, status: string) => {
		setIsPending((prevState: any) => ({
			...prevState,
			concludiNoleggio: status === 'completed_long' || status === 'completed' ? true : false,
			Interessato: status === 'init' ? true : false,
			Conferma: status === 'rented' ? true : false,
			Hold: status === 'hold' ? true : false,
			NotInterested: status === 'notInterested' ? true : false
		}));

		const params = {
			action: 'updateRentStatus',
			deal,
			status,
		};
		const options = {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"Content-Type": "application/json",
			},
		};

		try {
			await fetch("/api/rent", options);
			setDeal((prevState: any) => ({
				...prevState,
				carToRentStatus: status,
				rentStatus: status,
				stageId: status === 'hold' ? 17 : status === 'rented' ? 18 : status === 'init' ? 16 : status === 'rientrata' ? 19 : 24
			}));
			setDeals((prevItems: any[]) =>
				prevItems.map(item =>
					item.dealId === showDeal.dealId
						? {
							...item,
							carToRentStatus: status,
							rentStatus: status,
							stageId: status === 'hold' ? 17 : status === 'rented' ? 18 : status === 'init' ? 16 : status === 'rientrata' ? 19 : 24
						}
						: item
				)
			);

			if (status === "notInterested" || status === 'completed') {
				togglePopup(false);
				setDeals((prevItems: any[]) =>
					prevItems.filter(item => item.id !== deal.id)
				);
			}

			toast.success("Deal aggiornato");
		} catch (error) {
			console.error("Failed to update rent status:", error);
			toast.error("Errore nell'aggiornamento del deal");
		} finally {
			setIsPending((prevState: any) => ({
				...prevState,
				inviaDate: false,
				concludiNoleggio: false,
				Interessato: false,
				Conferma: false,
				Hold: false,
				NotInterested: false
			}));
			getRentCars()
		}
	};

	//CREA PREVENTIVO REDIRECT
	const creaPreventivo = (erpId: string, contactId: string) => {
		setIsPending((prevState) => ({
			...prevState,
			creaPreventivo: true
		}))
		//console.log(`https://manager.tuacar.it/erp/gestione-vendite-noleggio/preventivi/new/${erpId}(menu:erp)?idContactCrm=${contactId}`)
		window.open(
			//`https://manager.tuacar.it/erp/gestione-vendite/preventivi/new/${erpId}(menu:erp)?idContactCrm=${contactId}`,
			`https://manager.tuacar.it/erp/gestione-vendite-noleggio/preventivi/new/${erpId}(menu:erp)?idContactCrm=${contactId}`,
			"_blank"
		);
		setIsPending((prevState) => ({
			...prevState,
			creaPreventivo: false
		}))
	};

	//AGGIORNA DATE NOLEGGIO
	const updateRentDates = () => {
		const from = date?.from
		const to = date?.to
		const params = {
			action: 'updateRentDates',
			carToRentId: deal?.carToRentId,
			from: date?.from,
			to: date?.to,
		};
		const options = {
			method: "POST",
			body: JSON.stringify(params),
		};
		if (from && to) {
			fetch("/api/rent", options)
				.then((res) => res.json())
				.then(() => {
					const dateFrom = new Date(date?.from);
					//const isoDateFrom = new Date(dateFrom.getTime() + dateFrom.getTimezoneOffset() * 60000).toISOString();
					const isoDateFrom = new Date(dateFrom.getTime()).toISOString()
					const dateTo = new Date(date?.to);
					//const isoDateTo = new Date(dateTo.getTime() + dateTo.getTimezoneOffset() * 60000).toISOString();
					const isoDateTo = new Date(dateTo.getTime()).toISOString()

					//SEND SPOKI
					//sendUpdatedRentDatesViaSpoki(deal, date?.from, date?.to)

					setDeals((prevItems: any[]) =>
						prevItems.map(item =>
							item.dealId === showDeal.dealId
								? {
									...item,
									start: isoDateFrom,
									end: isoDateTo
								}
								: item
						)
					);

					setDeal((prevState: any) => ({
						...prevState,
						start: isoDateFrom,
						end: isoDateTo
					}))

					getRentDates(deal.erpId)

					toast.success("Date aggiornate!");
					getRentCars()
				});
		} else {
			toast.error("Controlla le date del noleggio")
		}
	};

	//SEND SPOKI RENT DATES:
	const sendSpokiRentDates = (deal: any) => {
		setIsPending((prevState: any) => ({
			...prevState,
			inviaDate: true
		}))
		sendRentDates(deal)
		setIsPending((prevState: any) => ({
			...prevState,
			inviaDate: false
		}))
		toast.success("Date inviate")
	}

	//LOADING SPINNER BUTTONS
	const [isPending, setIsPending] = useState({
		creaPreventivo: false,
		inviaDate: false,
		concludiNoleggio: false,
		Interessato: false,
		Conferma: false,
		Hold: false,
		NotInterested: false
	})


	//ASSEGNA AUTO SE NON E' STATO FATTO PRIMA.
	const [selectedCar, setSelectedCar] = useState<any>(null)
	const [isOpenSelectCars, setIsOpenSelectCars] = useState(false);
	const togglePopupSelectCars = () => {
		setIsOpenSelectCars(!isOpenSelectCars);
	};

	useEffect(() => {
		if (selectedCar) {
			const params = {
				action: 'assignCar',
				selectedCar: selectedCar,
				deal: deal
			};
			const options = {
				method: "POST",
				body: JSON.stringify(params),
			};
			fetch("/api/rent", options)
				.then((res) => res.json())
				.then(() => {
					toast("Auto assegnata")
					setDeals((prevItems: any[]) =>
						prevItems.map(item =>
							item.dealId === showDeal.dealId
								? {
									...item,
									erpId: selectedCar?.id,
									description: selectedCar?.make + ' ' + selectedCar?.model,
									make: selectedCar?.make,
									model: selectedCar?.model,
									mileage: selectedCar?.km,
									plate: selectedCar?.targa,
									carToRentStatus: "init",
									rentStatus: "init",
									source: "Breve",
									start: new Date().toISOString(),
									end: new Date().toISOString()
								}
								: item
						)
					);

					setDeal((prevState: any) => ({
						...prevState,
						erpId: selectedCar?.id,
						description: selectedCar?.make + ' ' + selectedCar?.model,
						make: selectedCar?.make,
						model: selectedCar?.model,
						mileage: selectedCar?.km,
						plate: selectedCar?.targa,
						carToRentStatus: "init",
						rentStatus: "init",
						source: "Breve",
						start: new Date().toISOString(),
						end: new Date().toISOString()
					}));

					setDate({
						from: new Date().toISOString(),
						to: new Date().toISOString()
					})

				})
		}

	}, [selectedCar])

	return (
		<>
			{isOpenSelectCars && (
				<div

					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopupSelectCars} // Close the popup when clicking outside
				>
					<div className="relative h-[98%] w-[98%]">
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
							className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
							onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
						>
							<motion.button
								whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
								onClick={togglePopupSelectCars}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<AssignRentCar rentCars={rentCars} deal={deal} togglePopupSelectCars={togglePopupSelectCars} setDeal={setDeal} setSelectedCar={setSelectedCar} />
						</motion.div>
					</div>
				</div>
			)}

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
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
					<motion.div
						onClick={() => updateDeal('stage', 16)}
						className={`rounded-2xl ${deal.stageId == 16 ? 'bg-orange-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-orange-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Appuntamento confermato
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 17)}
						className={`rounded-2xl ${deal.stageId == 17 ? 'bg-orange-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-orange-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Prenotata
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 18)}
						className={`rounded-2xl ${deal.stageId == 18 ? 'bg-orange-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-orange-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Uscita
					</motion.div>
					<motion.div
						onClick={() => updateDeal('stage', 19)}
						className={`rounded-2xl ${deal.stageId == 19 ? 'bg-orange-500 text-white' : 'bg-slate-200 hover:text-white'} hover:cursor-pointer p-4 hover:bg-orange-500`}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.9 }}
					>
						Rientrata
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

				<div className="flex flex-col gap-4">
					<div className="rounded-2xl border border-slate-200 p-4">
						<div className="grid grid-cols-1 gap-2">
							<div className="flex gap-4 w-full">

								{deal?.erpId == "" || !deal?.erpId &&
									<motion.button onClick={togglePopupSelectCars} whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }} className="mt-2 mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white">{!selectedCar ? "Assegna auto" : "Auto assegnata: " + selectedCar?.make + ' ' + selectedCar?.model}</motion.button>
								}

								{deal?.erpId != "" && deal?.erpId &&
									<div className="flex flex-col gap-2">
										<span className="text-sm">
											Targa: <b className="font-semibold">{deal.plate ? deal.plate : "..."}</b>
										</span>
										<span className="text-sm">
											Marca: <b className="font-semibold">{deal.make ? deal.make : "..."}</b>
										</span>
										<span className="text-sm">
											Modello: <b className="font-semibold">{deal.model ? deal.model : "..."}</b>
										</span>
										{deal.source == "Breve" && (
											<>
												<span className="text-sm">
													Data inizio:{" "}
													<span>
														{deal.start
															? deal.start.toString().split("T")[0]
															: ""}
													</span>
												</span>
												<span className="text-sm">
													Data fine:{" "}
													<span>
														{deal.end
															? deal.end.toString().split("T")[0]
															: ""}
													</span>
												</span>
											</>
										)}
									</div>
								}
								{deal.source == "Lungo" && deal?.erpId == "" &&
									<div className="animate-pulse p-2 bg-red-400 text-xs rounded rounded-xl flex items-center space-x-2">
										<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
										</svg>
										<p>Assegnazione veicolo Rent4You in arrivo</p>
									</div>
								}

							</div>
							{deal.erpId === "" && deal.source == "Breve" &&
								<motion.button onClick={togglePopupSelectCars} whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }} className="mt-2 mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white">Assegna auto</motion.button>
							}
						</div>

						<div className="grid grid-cols-4 gap-1 mt-3">

							{deal.rentStatus == "init" && (
								<motion.button
									disabled={isPending.NotInterested}
									onClick={() => updateRentStatus(deal, "notInterested")}
									whileHover={{ scale: !isPending.NotInterested ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.NotInterested ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.NotInterested ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.NotInterested && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.Hold && 'Non interessato'}
								</motion.button>
							)}

							{deal.rentStatus == "init" && (
								<motion.button
									disabled={isPending.Hold}
									onClick={() => updateRentStatus(deal, "hold")}
									whileHover={{ scale: !isPending.Hold ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.Hold ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.Hold ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.Hold && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.Hold && 'Interessato'}
								</motion.button>
							)}

							{deal.rentStatus == "hold" && (
								<motion.button
									disabled={isPending.Conferma}
									onClick={() => updateRentStatus(deal, "rented")}
									whileHover={{ scale: !isPending.Conferma ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.Conferma ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.Conferma ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.Conferma && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.Conferma && 'Conferma'}
								</motion.button>
							)}

							{deal.rentStatus == "notInterested" && (
								<motion.button
									disabled={isPending.Interessato}
									onClick={() => updateRentStatus(deal, "init")}
									whileHover={{ scale: !isPending.Interessato ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.Interessato ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.Interessato ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.Interessato && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.Interessato && 'Interessato'}
								</motion.button>
							)}

							{deal.rentStatus &&
								(deal.rentStatus == "rented" ||
									deal.rentStatus == "rientrata") && (
									<motion.button
										disabled={isPending.concludiNoleggio}
										onClick={() => updateRentStatus(deal, "completed")}
										whileHover={{ scale: !isPending.concludiNoleggio ? 1.01 : 1 }}
										whileTap={{ scale: !isPending.concludiNoleggio ? 0.99 : 1 }}
										className={`rounded-xl ${!isPending.concludiNoleggio ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
									>
										{isPending.concludiNoleggio && (
											<div className="flex justify-center items-center p-1">
												<Spinner />
											</div>
										)}
										{!isPending.concludiNoleggio && 'Concludi noleggio'}
									</motion.button>
								)}

							{deal.rentStatus &&
								deal.rentStatus == "esitata" && (
									<motion.button
										disabled={isPending.concludiNoleggio}
										onClick={() => updateRentStatus(deal, "completed_long")}
										whileHover={{ scale: !isPending.concludiNoleggio ? 1.01 : 1 }}
										whileTap={{ scale: !isPending.concludiNoleggio ? 0.99 : 1 }}
										className={`rounded-xl ${!isPending.concludiNoleggio ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
									>
										{isPending.concludiNoleggio && (
											<div className="flex justify-center items-center p-1">
												<Spinner />
											</div>
										)}
										{!isPending.concludiNoleggio && 'Concludi noleggio'}
									</motion.button>
								)}

							{deal.rentStatus && deal.rentStatus != 'rientrata' && deal.rentStatus != 'rented' &&
								<motion.button
									disabled={isPending.creaPreventivo}
									onClick={() =>
										creaPreventivo(
											deal.erpId ? deal.erpId.toString() : "",
											deal.contactId && deal.contactId ? deal.contactId.toString() : ""
										)
									}
									whileHover={{ scale: !isPending.creaPreventivo ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.creaPreventivo ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.creaPreventivo ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.creaPreventivo && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.creaPreventivo && 'Crea preventivo'}
								</motion.button>
							}

							{deal.source == "Breve" && (
								<motion.button
									disabled={isPending.inviaDate}
									onClick={() => sendSpokiRentDates(deal)}
									whileHover={{ scale: !isPending.inviaDate ? 1.01 : 1 }}
									whileTap={{ scale: !isPending.inviaDate ? 0.99 : 1 }}
									className={`rounded-xl ${!isPending.inviaDate ? 'bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%' : 'bg-slate-400'} p-1 text-black w-full p-2 text-white flex justify-center items-center`}
								>
									{isPending.inviaDate && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!isPending.inviaDate && 'Invia date Noleggio'}
								</motion.button>
							)}

						</div>

						{deal.source == "Breve" &&
							<div className="grid grid-cols-2 gap-1 mt-3">
								<div>
									<DatePicker
										locale="it"
										className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4 mr-1"
										selected={date.from}
										dateFormat="P"
										onChange={date =>
											setDate((prevState: any) => ({
												...prevState,
												from: date,
											}))
										}
									/>

									<DatePicker
										locale="it"
										className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4"
										selected={date.to}
										dateFormat="P"
										onChange={date =>
											setDate((prevState: any) => ({
												...prevState,
												to: date,
											}))
										}
									/>
								</div>
								<button
									className="bg-slate-400 w-full p-1 text-white flex justify-center items-center rounded-xl"
									onClick={() => updateRentDates()}
								//disabled={deal.stageId == 17 || deal.stageId == 18}
								>
									Aggiorna date
								</button>
								<p></p>
								{/*
								{(deal.stageId === 17 || deal.stageId === 18) && (
									<p className="text-xs">Non puoi più modificare le date</p>
								)}
									*/}

							</div>
						}

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

			</div>

			{deal?.source == "Breve" && !datesLoading && <CalendarComponent rented={rented} hold={hold} init={init} />}

		</>
	);
}