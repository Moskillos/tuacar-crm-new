'use client';

import {motion} from 'framer-motion';
import {useState} from 'react';
import Image from 'next/image';
import {formatCurrencyEUR} from '@/lib/utils';
import {Search} from 'lucide-react';

export function SelectCars({
	setSelectedCar,
	setDeal,
	togglePopupSelectCars,
}: any) {
	//SEARCH FILTER
	const [search, setSearch] = useState('');

	//GET CARS FROM ERP
	const [cars, setCars] = useState<any>();
	const [carsLoading, setCarsLoading] = useState<any>(null);

	async function getErpCars() {
		setCarsLoading(true);
		try {
			const params = {
				action: 'getErpCars',
				search: search,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/erpCars', options);
			const data = await response.json();

			setCars(data.data); // Assuming `data.data` contains the deals you want to set
		} catch (error) {
			console.error('Failed to fetch cars:', error);
		} finally {
			setCarsLoading(false); // Assuming this is for managing loading state
		}
	}

	//ASSEGNA VEICOLO
	const [car, setCar] = useState<any>(null);
	const assignCar = () => {
		setDeal((prevState: any) => ({
			...prevState,
			title: car.make + ' ' + car.model,
			value: car.price,
		}));
		setSelectedCar(car);
		togglePopupSelectCars();
	};

	return (
		<>
			<div className="w-full mx-auto pt-2 mt-5">
				<div className="flex justify-between items-center gap-2 mb-2">
					<div className="flex gap-2 items-center w-full">
						<p className="text-2xl font-semilight mb-2">Seleziona auto</p>
					</div>
				</div>
			</div>
			<div className="mt-5">
				<div className="flex items-center space-x-2 mb-2">
					<input
						className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-1"
						placeholder="Cerca e assegna un veicolo.."
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<motion.button
						onClick={getErpCars}
						whileHover={{scale: 1.1}}
						whileTap={{scale: 0.9}}
						className="rounded-full p-2 text-white bg-blue-500"
					>
						<Search />
					</motion.button>
				</div>
				{!carsLoading && carsLoading != null && (
					<>
						<div className="rounded-2xl border border-slate-200">
							<div className="overflow-y-auto p-2 h-full w-full">
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
											className={`mb-1 border border-slate-200 hover:cursor-pointer ${
												car && car.id == c.id ? 'bg-slate-300' : ''
											} rounded rounded-2xl`}
											whileHover={{scale: 1.01}}
											whileTap={{scale: 0.99}}
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
													onClick={() => assignCar()}
													className="animate-pulse w-full bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black rounded-t rounded-2xl font-light h-[50px]"
												>
													ASSEGNA VEICOLO
												</button>
											)}
										</motion.div>
									))}
							</div>
						</div>
					</>
				)}
				{carsLoading && (
					<>
						{[...Array(10)].map((_, index) => (
							<motion.div
								key={index}
								className="animate-pulse mb-1 bg-slate-200 hover:cursor-pointer rounded-2xl h-[80px]"
								whileHover={{scale: 1.01}}
								whileTap={{scale: 0.99}}
							/>
						))}
					</>
				)}
			</div>
		</>
	);
}
