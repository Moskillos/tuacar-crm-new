'use client';

import { formatCurrencyEUR } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Search } from 'lucide-react';
import { Separator } from '@radix-ui/themes';

export function Email({
	search,
	setSearch,
	getErpCars,
	session,
	showEmail,
	cars,
	carsLoading,
	agency,
}: any) {

	//SEARCH FILTER
	//const [search, setSearch] = useState("")

	const [email, setEmail] = useState<any>(showEmail);
	const [emailLoading, setEmailLoading] = useState(true);

	async function getEmail() {
		try {
			const params = {
				action: 'getEmailById',
				emailId: showEmail.id
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/emails', options);
			const data = await response.json();

			setEmail(data.data[0])

		} catch (error) {
			console.error('Failed to fetch emails:', error);
		} finally {
			setEmailLoading(false);
		}
	}

	useEffect(() => {
		getEmail();
	}, [showEmail]);

	//ASSEGNA VEICOLO
	const [car, setCar] = useState<any>(null);
	const [assigning, setAssigning] = useState(false);
	const assignCar = async () => {
		if (
			email.buyerPhone === '' ||
			email.buyerEmail === '' ||
			email.buyerPhone === null ||
			email.buyerEmail === null
		) {
			toast('I campi Email e Numero di telefono sono vuoti');
			return;
		}
		try {
			setAssigning(true);
			toast('Assegnando lead...');
			const params = {
				action: 'assign',
				agency: agency,
				car: car,
				emailId: email.id,
				groupId: email.groupId,
				buyerName: email.buyerName ? email.buyerName : '-',
				buyerEmail: email.buyerEmail,
				buyerPhone: email.buyerPhone,
				url: email.url,
				userId: session.user.sub,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};

			const response = await fetch('/api/emails', options);
			const data = await response.json();

			toast('Lead assegnato!');

			//router.push('/pipeline/vendita?id=' + data.dealId)
			window.location.href = '/pipeline/vendita?id=' + data.dealId;
		} catch (error) {
			console.error('Failed to fetch emails:', error);
		} finally {
			setAssigning(false);
			console.log('done');
		}
	};

	const [isLoading, setIsLoading] = useState(true);

	return (
		<>
			<Toaster />
			<div className="w-full h-full flex mt-5">
				<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 h-full w-full">
					<div className="rounded-2xl overflow-y-auto h-full p-2">
						{!emailLoading &&
							<div dangerouslySetInnerHTML={{ __html: email.htmlBody }} />
						}
						{emailLoading &&
							<div className="flex items-center justify-center w-full h-full">
								<div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
							</div>
						}
						<Separator className="mt-5 mb-5" />
						<span className="font-bold text-md">Preview annuncio</span>
						<div className="mt-2 p-2 bg-slate-500">
							{isLoading && <p>Caricamento annuncio...</p>}
							<iframe
								src={email.url}
								style={{ width: "100%", height: "500px", border: "none" }}
								onLoad={() => setIsLoading(false)}
							/>
						</div>
					</div>
					<div className="overflow-y-auto p-2 h-full w-full">
						<p>Dettagli contatto</p>
						<div className="flex items-center space-x-2">
							<input
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-1"
								placeholder="Nome"
								value={email.buyerName ? email.buyerName : ''}
								onChange={e =>
									setEmail((prevState: any) => ({
										...prevState,
										buyerName: e.target.value,
									}))
								}
							/>
							<input
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-1"
								placeholder="Email"
								value={email.buyerEmail ? email.buyerEmail : ''}
								onChange={e =>
									setEmail((prevState: any) => ({
										...prevState,
										buyerEmail: e.target.value,
									}))
								}
							/>
							<input
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-1"
								placeholder="Numero di telefono"
								value={email.buyerPhone ? email.buyerPhone : ''}
								onChange={e =>
									setEmail((prevState: any) => ({
										...prevState,
										buyerPhone: e.target.value
											.replaceAll(' ', '')
											.replaceAll('+', ''),
									}))
								}
							/>
						</div>
						<Separator className="mt-5 mb-5" />
						<div className="flex items-center space-x-2">
							<input
								className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-1"
								placeholder="Cerca e assegna un veicolo.."
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
							<motion.button
								onClick={getErpCars}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="rounded-full p-2 text-white bg-blue-500"
							>
								<Search />
							</motion.button>
						</div>
						{!carsLoading && carsLoading != null && cars && cars.length > 0 && (
							<>
								{cars
									.filter((c: any) =>
										JSON.stringify(c)
											.toLowerCase()
											.includes(search.toLowerCase())
									)
									.map((c: any, index: number) => (
										<motion.div
											key={index}
											onClick={() => setCar(c)}
											className={`mb-1 border border-slate-200 hover:cursor-pointer ${car && car.id == c.id ? 'bg-slate-300' : ''} rounded`}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
										>
											<div className="flex items-center">
												<Image
													src={c.pictureToPublishUrl}
													height={125}
													width={125}
													alt="ok"
													className="rounded-2xl"
												/>
												<div className="ml-4">
													<p>{c.make + ' ' + c.model}</p>
													<p>{formatCurrencyEUR(c.price)}</p>
													<p>{c.engine}</p>
													<p>{c.km} km</p>
												</div>
											</div>
											{car && car.id == c.id && (
												<button
													disabled={assigning}
													onClick={() => assignCar()}
													className="w-full bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black rounded-t rounded-2xl font-light h-[50px] disabled:opacity-50"
												>
													ASSEGNA VEICOLO
												</button>
											)}
										</motion.div>
									))}
							</>
						)}
						{carsLoading && (
							<>
								{[...Array(10)].map((_, index) => (
									<motion.div
										key={index}
										className="mb-1 bg-slate-200 hover:cursor-pointer rounded-2xl h-[80px]"
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
									/>
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
