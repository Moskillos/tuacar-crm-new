'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, Trash, X, Filter } from 'lucide-react';
import { Email } from './components/email';
import Image from 'next/image';
import { getLogoPortale } from '@/lib/utils';
import { useAppContext } from '@/hooks/useAppContext';
import { toast, Toaster } from 'sonner';

export default function Emails() {
	//FETCH SESSION & DETAILS
	const [session, setSession] = useState(null);
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

	//GET DEALS VENDITA
	const [emails, setEmails] = useState<any>([]);
	const [emailsCount, setEmailsCount] = useState(null);

	//PAGINATION
	const [pagination, setPagination] = useState({
		current: 1,
		perPage: 50,
		total: 1,
		loading: false
	})
	useEffect(() => {
		// Correctly calculate total pages - ceiling division to handle partial pages
		const totalPages = emailsCount ? Math.ceil(emailsCount / pagination.perPage) : 1;
		setPagination((prevState) => ({
			...prevState,
			total: totalPages
		}));
	}, [emailsCount, pagination.perPage]);

	const [emailsLoading, setEmailsLoading] = useState(true);
	async function getEmails() {
		setPagination(prev => ({ ...prev, loading: true }));
		try {
			const params = {
				action: 'new',
				agency: agency,
				limit: pagination.perPage,
				offset: pagination.current, // Fix offset calculation
				search: search
			};

			console.log(params);

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};
			console.log(options, 'options');
			const response = await fetch('/api/emails', options);
			const data = await response.json();
			console.log(data.data, 'data');
			if (response.ok) {
				setEmails(data.data || []);
				setEmailsCount(data.count || 0);
			} else {
				toast.error("Errore nel caricamento delle email");
			}
		} catch (error) {
			console.error('Failed to fetch emails:', error);
			toast.error("Errore nella comunicazione con il server");
		} finally {
			setEmailsLoading(false);
			setPagination(prev => ({ ...prev, loading: false }));
		}
	}

	useEffect(() => {
		if (agency) {
			getEmails();
		}
	}, [agency, pagination.current]);

	const [selectedEmail, setSelectedEmail] = useState(null);

	const selectEmail = (deal: any) => {
		setSelectedEmail(deal);
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

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isOpen]);

	//GET CARS FROM ERP
	const [cars, setCars] = useState();
	const [carsLoading, setCarsLoading] = useState<any>(null);
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (search === "" && agency) {
			getEmails()
		}
	}, [search])

	async function getErpCars() {
		try {
			setCarsLoading(true);
			const params = {
				action: 'getErpCars',
				agencyCode: agency,
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

	//SEARCH FILTER
	const [searchEmail, setSearchEmail] = useState('');

	//REMOVE EMAIL
	async function delEmail(id: any) {
		try {
			const params = {
				action: 'delEmailById',
				id: id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const res = await fetch('/api/emails', options);

			if (res.status == 200) {
				setEmails((prevItems: any[]) =>
					prevItems.filter(item => item.id !== id)
				);
				toast('Eliminata');
			} else {
				toast("Errore durante l'eliminazione");
			}
		} catch (error) {
			console.error('Failed to delete email:', error);
		} finally {
		}
	}

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.total && newPage !== pagination.current) {
			setPagination((prevState) => ({
				...prevState,
				current: newPage
			}));
			// Scroll to top of the list when changing pages
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	//FILTERS
	const [portalFilter, setPortalFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [uniquePortals, setUniquePortals] = useState<string[]>([]);
	const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

	// Extract unique portal values from emails
	const extractUniqueFilters = (emailsData: any[]) => {
		if (!emailsData || !emailsData.length) return;

		const portals = new Set<string>();
		const types = new Set<string>();

		emailsData.forEach((email: any) => {
			// Extract portal from URL
			if (email.url) {
				// Find which portal is in the URL
				const portalKeys = ['autoscout', 'subito', 'autosupermarket', 'tcm', 'tua-car'];
				const foundPortal = portalKeys.find(key => email.url.includes(key));
				if (foundPortal) portals.add(foundPortal);
			}

			// Extract type from subject (first word before space)
			if (email.subject) {
				console.log(email);
				const firstWord = email.subject.split(' ')[0];
				if (firstWord && firstWord !== 'Hai') {
					if (email.url) types.add(email.url.includes('tua-car.it') ? 'Tua Car' : firstWord);
					else types.add(firstWord);
				}
			}
		});

		setUniquePortals(Array.from(portals).sort());
		setUniqueTypes(Array.from(types).sort());
	};

	// Update filters when emails change
	useEffect(() => {
		if (emails && emails.length > 0) {
			extractUniqueFilters(emails);
		}
	}, [emails]);

	// Function to display active filters summary
	const getActiveFiltersText = () => {
		const filters = [];

		if (portalFilter) filters.push(`Portale: ${portalFilter}`);
		if (typeFilter) filters.push(`Tipo: ${typeFilter}`);
		if (searchEmail) filters.push(`Ricerca: "${searchEmail}"`);

		return filters.length > 0 ? filters.join(' | ') : 'Nessun filtro attivo';
	};

	// Apply all filters to emails
	const applyFilters = (email: any) => {
		// Search filter
		const matchesSearch = JSON.stringify(email)
			.toLowerCase()
			.includes(searchEmail.toLowerCase());
		console.log(email);
		// Portal filter
		const matchesPortal = !portalFilter || (email.url ? email.url.includes(portalFilter) : false);
		// Type filter (first word of subject)
		const matchesType = !typeFilter ||
			(email.subject && email.subject.split(' ')[0] === typeFilter) ||
			(email.url && email.url.includes('tua-car.it') && typeFilter === 'Tua Car');

		// Return only emails that match all filters
		return matchesSearch && matchesPortal && matchesType;
	};

	// Function to reset all filters
	const resetFilters = () => {
		setPortalFilter('');
		setTypeFilter('');
		setSearchEmail('');
	};

	return (
		<>
			<Toaster />
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopup} // Close the popup when clicking outside
				>
					<div className="relative h-[99%] w-[99%]">
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
							className="bg-slate-100 rounded-2xl h-full w-full p-6"
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
							<Email
								search={search}
								setSearch={setSearch}
								getErpCars={getErpCars}
								session={session}
								showEmail={selectedEmail}
								cars={cars}
								carsLoading={carsLoading}
								agency={agency}
							/>
						</motion.div>
					</div>
				</div>
			)}
			<div className="p-4 flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-between items-center gap-2">
				<div className="flex gap-2 items-center w-full md:w-auto">
					<input
						className="rounded-xl border border-slate-100 p-2 flex-1 md:flex-none"
						placeholder="Cerca..."
						value={searchEmail}
						onChange={e => setSearchEmail(e.target.value)}
					/>
					<motion.button
						onClick={() => getEmails()}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="rounded-full p-2 text-white bg-blue-500"
					>
						<Search />
					</motion.button>
				</div>

				{!emailsLoading && (
					<h1 className="font-light text-xl sm:text-xl md:text-4xl lg:text-4xl xl:text-4xl text-right text-slate-500">
						{emails ? emails.length + ' di ' + emailsCount : '-'}
					</h1>
				)}
			</div>

			{/* Filters Section */}
			<div className="flex gap-2 my-2 md:mt-0 w-full md:w-auto px-4">
				<select
					className="rounded-xl border border-slate-100 p-2 bg-white"
					value={portalFilter}
					onChange={e => setPortalFilter(e.target.value)}
				>
					<option value="">Tutti i portali</option>
					{uniquePortals.map((portal, index) => (
						<option key={index} value={portal}>
							{portal.charAt(0).toUpperCase() + portal.slice(1)}
						</option>
					))}
				</select>

				<select
					className="rounded-xl border border-slate-100 p-2 bg-white"
					value={typeFilter}
					onChange={e => setTypeFilter(e.target.value)}
				>
					<option value="">Tutti i tipi</option>
					{uniqueTypes.map((type, index) => (
						<option key={index} value={type}>
							{type}
						</option>
					))}
				</select>

				{/* Reset Filters Button */}
				<motion.button
					onClick={resetFilters}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="p-2 rounded-xl bg-slate-200 text-slate-700 text-sm flex items-center gap-1"
					title="Reimposta filtri"
				>
					<X size={16} /> Reimposta
				</motion.button>
			</div>

			{/* Active Filters Summary */}
			{(portalFilter || typeFilter || searchEmail) && (
				<div className="px-4 pb-2">
					<p className="text-sm text-slate-500 italic">
						<span className="font-medium">Filtri attivi:</span>{' '}
						<span>{getActiveFiltersText()}</span>
					</p>
				</div>
			)}

			<div className="p-4">
				{!emailsLoading && emails && (
					<>
						{emails
							.filter((e: any) => applyFilters(e))
							.map((e: any, index: number) => (
								<div className="flex items-center justify-between gap-2" key={e.emailId || index}>
									<motion.div
										onClick={() => selectEmail(e)}
										drag
										dragElastic={1}
										dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.9 }}
										className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl mb-1 text-slate-800 flex-1"
									>
										<div className="grid grid-cols-1 sm:grid sm:grid-cols-1 md:grid md:grid-cols-1 lg:flex xl:flex lg:gap-4 xl:gap-4 text-xs">
											<Image
												src={getLogoPortale(e.url)}
												height={50}
												width={50}
												alt="ok"
											/>
											<p className="flex-1 mt-3">
												{e.subject ? e.subject.substring(0, 30) + '...' : '-'}
											</p>
											<p className="flex-1 mt-3">
												{e.createdAt
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
														.split(' ')[1]}
											</p>
											<p className="flex-1 mt-3">
												{e.buyerName ? e.buyerName : '-'}
											</p>
											<p className="flex-1 mt-3">
												{e.buyerEmail ? e.buyerEmail : '-'}
											</p>
											<p className="flex-1 mt-3">
												{e.buyerPhone ? e.buyerPhone : '-'}
											</p>
										</div>
									</motion.div>
									<Trash
										className="hover:cursor-pointer"
										size={15}
										onClick={() => delEmail(e.id)}
									/>
								</div>
							))}
						<div className="flex flex-col items-center gap-4 mt-6">
							<div className="flex items-center gap-2">
								<button
									onClick={() => handlePageChange(1)}
									disabled={pagination.current === 1 || pagination.loading}
									className={`p-2 rounded-full ${pagination.current === 1 || pagination.loading ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
								</button>
								<button
									onClick={() => handlePageChange(pagination.current - 1)}
									disabled={pagination.current === 1 || pagination.loading}
									className={`p-2 rounded-full ${pagination.current === 1 || pagination.loading ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
								>
									<ArrowLeft />
								</button>

								<div className="flex space-x-1">
									{[...Array(pagination.total > 5 ? 5 : pagination.total)].map((_, idx) => {
										let pageNum;
										if (pagination.total <= 5) {
											pageNum = idx + 1;
										} else if (pagination.current <= 3) {
											pageNum = idx + 1;
										} else if (pagination.current >= pagination.total - 2) {
											pageNum = pagination.total - 4 + idx;
										} else {
											pageNum = pagination.current - 2 + idx;
										}

										return (
											<button
												key={pageNum}
												onClick={() => handlePageChange(pageNum)}
												className={`w-10 h-10 rounded-full ${pagination.current === pageNum
													? 'bg-blue-500 text-white'
													: 'bg-slate-100 hover:bg-slate-200'} 
													${pagination.loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
												disabled={pagination.loading}
											>
												{pageNum}
											</button>
										);
									})}
								</div>

								<button
									onClick={() => handlePageChange(pagination.current + 1)}
									disabled={pagination.current === pagination.total || pagination.loading}
									className={`p-2 rounded-full ${pagination.current === pagination.total || pagination.loading ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
								>
									<ArrowRight />
								</button>
								<button
									onClick={() => handlePageChange(pagination.total)}
									disabled={pagination.current === pagination.total || pagination.loading}
									className={`p-2 rounded-full ${pagination.current === pagination.total || pagination.loading ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
								</button>
							</div>

							<div className="text-sm text-slate-500">
								{pagination.loading ? (
									<span>Caricamento...</span>
								) : (
									<span>
										Visualizzazione {emails.length ? (pagination.current - 1) * pagination.perPage + 1 : 0} - {Math.min(pagination.current * pagination.perPage, emailsCount || 0)} di {emailsCount || 0} elementi
									</span>
								)}
							</div>
						</div>
					</>
				)}
				{emailsLoading && (
					<div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
				)}

			</div>
		</>
	);
}
