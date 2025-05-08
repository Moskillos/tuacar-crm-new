'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Deal } from './components/deal';
import { formatCurrencyEUR, getNameByUserId } from '@/lib/utils';
import { Add } from './components/add';
import { Won } from './components/won';
import { Failed } from './components/failed';
import { useAppContext } from '@/hooks/useAppContext';
//import { useSearchParams } from 'next/navigation';

export default function PipelineVendita() {
	const [id, setId] = useState(null);
	useEffect(() => {
		// Access the query parameters using classic JavaScript
		const params = new URLSearchParams(window.location.search);
		const idParam: any = params.get('id'); // Get the 'id' query parameter

		if (idParam) {
			setId(idParam);
		}
	}, []);

	/*
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	*/

	const [session, setSession] = useState<any>(null);
	const [userRoles, setUserRoles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const { agency, setLastSpokiChat }: any = useAppContext();

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

	const [isDragging, setIsDragging] = useState(false);
	const [index, setIndex] = useState(1);
	const containerRefs = useRef<any>([]);

	let tmpIndex = index;

	const handleDragStart = () => {
		setIsDragging(true);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
		setIndex(tmpIndex);
	};

	const handleDrag = (event: any, info: any) => {
		containerRefs.current.forEach((ref: any, idx: any) => {
			const rect = ref.getBoundingClientRect();
			if (
				info.point.x > rect.left &&
				info.point.x < rect.right &&
				info.point.y > rect.top &&
				info.point.y < rect.bottom
			) {
				tmpIndex = idx;
			}
		});
	};

	//GET DEALS VENDITA
	const [deals, setDeals] = useState([]);
	const [dealsLoading, setDealsLoading] = useState(true);
	useEffect(() => {
		async function getDeals() {
			try {
				const params = {
					action: 'vendita',
					agencyCode: agency,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(params),
				};

				const response = await fetch('/api/pipeline', options);
				const data = await response.json();

				setDeals(data.data);
			} catch (error) {
				console.error('Failed to fetch deals:', error);
			} finally {
				setDealsLoading(false);
			}
		}
		if (agency != '') {
			getDeals();
		}
	}, [agency]);

	//SELECT AND SHOW DEAL POPUP
	const [selectedDeal, setSelectedDeal] = useState(null);

	const selectDeal = (deal: any) => {
		setSelectedDeal(deal);

		//UPDATE SPOKI CHAT AND PROPAGATE THE UPDATE
		setLastSpokiChat(deal.contactPhoneNumber);
		const event = new CustomEvent('localStorageUpdated', {
			detail: { key: 'lastSpokiChat', value: deal.contactPhoneNumber },
		});
		window.dispatchEvent(event);

		setIsOpen(true);
	};

	const [isOpen, setIsOpen] = useState(false);

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	//ADD DEAL HANDLER
	const [addDealIsOpen, setAddDealIsOpen] = useState(false);
	const addDealTogglePopup = () => {
		setAddDealIsOpen(!addDealIsOpen);
	};

	//SEARCH FILTER
	const [searchPipeline, setSearchPipeline] = useState('');

	//AUTO DEAL POPUP FOCUS
	useEffect(() => {
		if (id && deals.length > 0 && session && session.user && agency) {
			const foundDeal = deals.find((item: any) => item.dealId === parseInt(id));
			if (foundDeal) {
				selectDeal(foundDeal);
			}
		}
	}, [deals, id, session, agency]);

	//VINTI / PERSI TABS
	const [showType, setShowType] = useState('open');

	const [filteredDeals, setFilteredDeals] = useState([]);
	useEffect(() => {
		if (!searchPipeline.trim()) {
			setFilteredDeals(deals);
		} else {
			const filtered = deals.filter((d: any) =>
				[d.dealId, d.title, d.value, d.contactName, d.contactPhoneNumber].some(
					field =>
						field
							?.toString()
							.toLowerCase()
							.includes(searchPipeline.toLowerCase())
				)
			);
			setFilteredDeals(filtered);
		}
	}, [searchPipeline, deals]);

	//GET VENDITORI
	/*
	const [sellers, setSellers] = useState([]);
	const [sellersLoading, setSellersLoading] = useState(true);
	useEffect(() => {
		async function getSellers() {
			try {
				const params = {
					action: 'getSellers',
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(params),
				};

				const response = await fetch('/api/sellers', options);
				const data = await response.json();

				console.log("data: ", data)
				setSellers(data.data);
			} catch (error) {
				console.error('Failed to fetch deals:', error);
			} finally {
				setSellersLoading(false);
			}
		}
		if (sellersLoading) {
			getSellers();
		}
	}, []);
	*/

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopup} // Close the popup when clicking outside
				>
					<div className="relative h-[98%] w-[98%]">
						<motion.div
							//initial={{ opacity: 0, scale: 0.5 }}
							//animate={{ opacity: 1, scale: 1 }}
							//transition={{ duration: 0.2 }}
							className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
							onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
						>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={togglePopup}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<Deal
								session={session}
								agency={agency}
								togglePopup={togglePopup}
								setDeals={setDeals}
								showDeal={selectedDeal}
								setSelectedDeal={setSelectedDeal}
							/>
						</motion.div>
					</div>
				</div>
			)}
			{addDealIsOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={addDealTogglePopup} // Close the popup when clicking outside
				>
					<div className="relative h-[98%] w-[98%]">
						<motion.div
							//initial={{ opacity: 0, scale: 0.5 }}
							//animate={{ opacity: 1, scale: 1 }}
							//transition={{ duration: 0.2 }}
							className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
							onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
						>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={addDealTogglePopup}
								className="absolute top-1 right-1 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
							<Add
								addDealTogglePopup={addDealTogglePopup}
								setDeals={setDeals}
								session={session}
							/>
						</motion.div>
					</div>
				</div>
			)}
			<div className="p-4 flex justify-between items-center gap-2">
				<div className="flex gap-2 items-center">
					<input
						onChange={e => setSearchPipeline(e.target.value)}
						value={searchPipeline}
						className="rounded-xl border border-slate-100 p-2"
						placeholder="Cerca..."
					/>
					<motion.button
						onClick={addDealTogglePopup}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="rounded-full p-2 text-white bg-blue-500"
					>
						<Plus />
					</motion.button>
				</div>
				<h1 className="font-light text-xl sm:text-xl md:text-4xl lg:text-4xl xl:text-4xl text-right text-slate-500">
					{formatCurrencyEUR(
						deals?.reduce((acc, currentItem: any) => acc + currentItem.value, 0)
					)}{' '}
					· {deals?.length} affari
				</h1>
			</div>

			<div className="p-4">
				<div className="p-1 bg-slate-200 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-1 rounded-2xl font-semilight">
					<div
						onClick={() => setShowType('open')}
						className={`${showType == 'open' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Aperti</p>
					</div>
					<div
						onClick={() => setShowType('awarded')}
						className={`${showType == 'awarded' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Vinti</p>
					</div>
					<div
						onClick={() => setShowType('failed')}
						className={`${showType == 'failed' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Persi</p>
					</div>
				</div>
			</div>

			{showType == 'open' && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 pl-4 pr-4">
						{[7, 8, 9, 10].map(id => (
							<div
								key={id}
								className="h-full rounded-xl bg-slate-100 p-2"
								ref={(el: any) => (containerRefs.current[id] = el)}
							>
								<p className="mb-2 font-semibold">
									{id == 7
										? 'Cliente interessato'
										: id == 8
											? 'Appuntamento confermato'
											: id == 9
												? 'Proposta presentata'
												: 'In sospeso'}
								</p>
								{!dealsLoading && (
									<>
										{filteredDeals
											?.filter((d: any) => d.stageId === id)
											.map((d: any, index: any) => (
												<motion.div
													key={
														d.id
															? d.id + index.toString()
															: d.dealId + index.toString()
													}
													onClick={() => selectDeal(d)}
													drag
													dragElastic={1}
													dragConstraints={{
														top: 0,
														bottom: 0,
														left: 0,
														right: 0,
													}}
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white mb-2"
													onDragStart={handleDragStart}
													onDragEnd={handleDragEnd}
													onDrag={handleDrag}
												>
													<p className="text-xs">
														ID:{' '}
														<span className="font-semibold">{d.dealId}</span>
													</p>
													<p className="text-xs">
														Titolo:{' '}
														<span className="font-semibold">{d.title}</span>
													</p>
													<p className="text-xs">
														Valore:{' '}
														<span className="font-semibold">
															{formatCurrencyEUR(d.value)}
														</span>
													</p>
													<p className="text-xs">
														Contatto:{' '}
														<span className="font-semibold">
															{d.contactName}
														</span>
													</p>
													<p className="text-xs">
														Venditore:{' '}
														<span className="font-semibold">
															...
															{/*{getNameByUserId(sellers, d.userId)}*/}
														</span>
													</p>
													<p className="text-xs">
														Telefono:{' '}
														<span className="font-semibold">
															{d.contactPhoneNumber}
														</span>
													</p>
													<p className="text-xs">
														Data:{' '}
														<span className="font-semibold">
															{d.createdAt
																? d.createdAt
																	.replace('T', ' ')
																	.replace('.000Z', '')
																	.split(' ')[0]
																	.split('-')
																	.reverse()
																	.join('-')
																: '-'}
														</span>
													</p>
												</motion.div>
											))}
									</>
								)}
								{dealsLoading && (
									<div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
								)}
							</div>
						))}
					</div>
				</>
			)}
			{showType == 'awarded' && (
				<Won agency={agency} selectDeal={selectDeal} search={searchPipeline} />
			)}
			{showType == 'failed' && (
				<Failed
					agency={agency}
					selectDeal={selectDeal}
					search={searchPipeline}
				/>
			)}
		</>
	);
}
