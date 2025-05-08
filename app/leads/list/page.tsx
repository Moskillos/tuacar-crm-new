'use client';

//PER RITORNARE ALLA VERSIONE PRECEDENTE:
//GITHUB PUSH PREVIOUS 08 OTTOBRE 2024

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	Pocket,
	CircleCheck,
	X,
	Trash,
	ArrowLeft,
	ArrowRight,
	Search,
	Dot,
	CheckSquare,
	Square
} from 'lucide-react';
import { Lead } from './components/lead';
import Image from 'next/image';
import { formatCurrencyEUR, getLogoPortale, leadMapper } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import { CSVLead } from './components/csvLead';
import { GarageLead } from './components/garageLead';
import { RicezioneButton } from './components/ricezioneButton';
import getCSVDailyLeads from '@/app/api/leads/_actions/getCSVDailyLeads';
import { Spinner } from '@radix-ui/themes';
import { useAppContext } from '@/hooks/useAppContext';
import { toast, Toaster } from 'sonner';
import { it } from 'date-fns/locale/it';
import { registerLocale } from 'react-datepicker';

registerLocale('it', it);

export default function Leads() {
	const [id, setId] = useState(null);
	useEffect(() => {
		// Access the query parameters using classic JavaScript
		const params = new URLSearchParams(window.location.search);
		const idParam: any = params.get('id'); // Get the 'id' query parameter

		if (idParam) {
			setId(idParam);
		}
	}, []);

	//FETCH SESSION & DETAILS
	const [session, setSession] = useState<any>(null);
	const [userRoles, setUserRoles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const { agency, agencyEmail, setLastSpokiChat }: any = useAppContext();

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
	const [type, setType] = useState('today');
	const [leads, setLeads] = useState<Lead[]>([]);
	const [leadsCount, setLeadsCount] = useState(0);
	const [leadsLoading, setLeadsLoading] = useState(true);

	//PAGINATION
	const [pagination, setPagination] = useState({
		current: 1,
		perPage: 50,
		total: leadsCount ? Math.floor(leadsCount / 50) > 0 ? Math.floor(leadsCount / 50) : 1 : 1,
	})
	useEffect(() => {
		setPagination((prevState: any) => ({
			...prevState,
			total: leadsCount ? Math.floor(leadsCount / 50) > 0 ? Math.floor(leadsCount / 50) : 1 : 1,
		}))
	}, [leadsCount]);

	//SEARCH FILTER
	const [search, setSearch] = useState('');

	//PRICE FILTER
	const [priceRange, setPriceRange] = useState({ min: '', max: '' });

	//KM FILTER
	const [kmRange, setKmRange] = useState({ min: '', max: '' });

	//GEOGRAPHIC FILTERS
	const [geoFilters, setGeoFilters] = useState({ town: '', region: '', provincia: '' });

	//YEAR FILTER
	const [yearFilter, setYearFilter] = useState('');
	const [uniqueYears, setUniqueYears] = useState<string[]>([]);

	// Store unique geographic values for dropdowns
	const [uniqueGeoOptions, setUniqueGeoOptions] = useState<{
		towns: string[];
		regions: string[];
		provincias: string[];
	}>({
		towns: [],
		regions: [],
		provincias: []
	});

	useEffect(() => {
		if (search === "") {
			getLeads(type)
		}
	}, [search])

	//LEAD DATE FILTER
	const [dateRange, setDateRange] = useState([
		new Date(),
		new Date(),
	]);
	const [startDate, endDate] = dateRange;
	useEffect(() => {
		getLeads(type);
	}, [endDate]);

	//PHONE FILTER
	const [phoneFilter, setPhoneFilter] = useState('tutti');

	//SAVE NEW LEADS
	const [sendSpoki, setSendSpoki] = useState(false);
	const [newLeadsLoading, setNewLeadsLoading] = useState(false);
	async function saveNewLeads() {
		setNewLeadsLoading(true);
		try {
			const params = {
				action: 'saveNewLeads',
				agencyCode: agency,
				csvLeads: csvLeads,
				sendSpoki: sendSpoki,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const response = await fetch('/api/leads', options);

			if (response.status === 200) {
				window.location.reload();
				//getLeads('today')
			}
		} catch (error) {
			console.error('Failed to save new leads', error);
		} finally {
		}
		setNewLeadsLoading(false);
	}

	//OPEN NEW SEARCH
	const [openNewSearch, setOpenNewSearch] = useState(false);

	//AUTO DEAL POPUP FOCUS
	useEffect(() => {
		if (id && session && session?.user && agency) {
			const fetchLead = async () => {
				const params = {
					action: 'getLeadById',
					id: id,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', // Set content type to JSON
					},
					body: JSON.stringify(params), // Use body instead of params
				};

				try {
					const response = await fetch('/api/leads', options);
					const data = await response.json();
					selectLead(data.data, 'lead');
					const url =
						window.location.protocol +
						'//' +
						window.location.host +
						window.location.pathname;
					window.history.pushState({ path: url }, '', url);
				} catch (error) {
					console.error('Error fetching lead:', error);
				}
			};

			fetchLead();
		}
	}, [id, session, agency]);

	//ELIMINA (NASCONDI) LEAD
	async function delLead(id: any) {
		try {
			const params = {
				action: 'delLeadById',
				id: id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};

			const res = await fetch('/api/leads', options);

			if (res.status == 200) {
				setLeads((prevItems: any[]) =>
					prevItems.filter(item => item.id !== id)
				);
				toast('Eliminato');
			} else {
				toast("Errore durante l'eliminazione");
			}
		} catch (error) {
			console.error('Failed to delete email:', error);
		} finally {
		}
	}

	async function getLeads(type: string) {
		setLeadsLoading(true);
		try {
			const params = {
				action: type,
				agency: agency,
				agencyEmail: agencyEmail,
				startDate: startDate,
				endDate: endDate,
				limit: pagination.perPage,
				offset: pagination.current,
				search: search,
				priceMin: priceRange.min || undefined,
				priceMax: priceRange.max || undefined,
				kmMin: kmRange.min || undefined,
				kmMax: kmRange.max || undefined,
				geoTown: geoFilters.town || undefined,
				geoRegion: geoFilters.region || undefined,
				geoProvincia: geoFilters.provincia || undefined
			};
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Set content type to JSON
				},
				body: JSON.stringify(params), // Use body instead of params
			};
			const response = await fetch('/api/leads', options);
			const data = await response.json();
			;
			setLeads(leadMapper(data.data)); // Assuming `data.data` contains the deals you want to set
			setLeadsCount(data.count);

			// Extract unique geographic values
			extractUniqueGeoOptions(data.data);
		} catch (error) {
			console.error('Failed to fetch emails:', error);
		} finally {
			setLeadsLoading(false); // Assuming this is for managing loading state
		}
	}

	// Function to extract unique geographic values from leads
	const extractUniqueGeoOptions = (leadsData: any[]) => {
		if (!leadsData || !leadsData.length) return;

		const towns = new Set<string>();
		const regions = new Set<string>();
		const provincias = new Set<string>();
		const years = new Set<string>();

		leadsData.forEach((lead: any) => {
			if (lead.geo_town) towns.add(lead.geo_town);
			if (lead.geo_region) regions.add(lead.geo_region);
			if (lead.geo_provincia) provincias.add(lead.geo_provincia);

			// Extract year from register_date if available
			if (lead.register_date) {
				const parts = lead.register_date.split('/');
				if (parts.length === 2) {
					const year = parts[1];
					years.add(year);
				}
			}
		});

		setUniqueGeoOptions({
			towns: Array.from(towns).sort(),
			regions: Array.from(regions).sort(),
			provincias: Array.from(provincias).sort()
		});

		setUniqueYears(Array.from(years).sort().reverse()); // Newest years first
	};

	useEffect(() => {
		if (agency) {
			getLeads('today');
		}
	}, [agency, pagination.current]);

	//SWITCH LEAD TAB TYPE
	const switchLeadType = (leadType: string) => {
		setType(leadType);
		setPagination((prevState: any) => ({
			...prevState,
			current: 1
		}))
		getLeads(leadType);
	};

	//SELECT LEAD HANDLER
	const [selectedLead, setSelectedLead] = useState<any>([]);
	const selectLead = (lead: any, type: string) => {
		setType(type);
		setSelectedLead(lead);

		//UPDATE SPOKI CHAT AND PROPAGATE THE UPDATE
		setLastSpokiChat(lead.contactPhoneNumber);
		const event = new CustomEvent('localStorageUpdated', {
			detail: { key: 'lastSpokiChat', value: lead.contactPhoneNumber },
		});
		window.dispatchEvent(event);

		setIsOpen(true);
	};
	const [isOpen, setIsOpen] = useState(false);

	const togglePopup = () => {
		if (id != null) {
			setType('today');
			setId(null);
		}
		setIsOpen(!isOpen);
		return;
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

	//GET CSV LEADS FROM LEADS-TUACAR
	const [csvLeads, setCsvLeads] = useState<any>([]);
	const [csvLeadsLoading, setCsvLeadsLoading] = useState(true);
	const [csvAssigned, setCsvAssigned] = useState<any>([]);

	//RICEZIONE LEAD AGENCY CHECK
	const [receiveLeads, setReceiveLeads] = useState(false);
	const [receiveLeadsLoading, setReceiveLeadsLoading] = useState(true);

	useEffect(() => {
		async function checkIfAssigned(ids: any) {
			try {
				const params = {
					action: 'checkIfAssigned',
					csvUrns: ids,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', // Set content type to JSON
					},
					body: JSON.stringify(params), // Use body instead of params
				};

				const response = await fetch('/api/leads', options);
				const data = await response.json();

				const justUrns = data.data.map((item: { csvUrn: any }) => item.csvUrn);

				setCsvAssigned(justUrns);

				return true;
			} catch (error) {
				console.error('Failed to fetch emails:', error);
			} finally {
			}
		}
		async function getCSVLeads() {
			try {
				const data: any = await getCSVDailyLeads(agencyEmail);

				//CHECK IF IDS ALREADY EXISTS IN DB
				const ids = data.map((element: { urn: any }) => element.urn);

				await checkIfAssigned(ids);

				setCsvLeads(data);
			} catch (error) {
				console.error('Failed to fetch leads:', error);
			} finally {
				setCsvLeadsLoading(false);
			}
		}
		async function getAgency() {
			try {
				const response = await fetch(`/api/agencies/${agency}`);
				const data = await response.json();

				if (data.data.length > 0) {
					console.log(data.data[0].receiveLeads);
					setReceiveLeads(data.data[0].receiveLeads);
				}
				setReceiveLeadsLoading(false);
			} catch (error) {
				console.error('Failed to fetch agency:', error);
			} finally {
			}
		}
		if (agencyEmail) {
			getCSVLeads();
			getAgency();
		}
	}, [agencyEmail]);

	// Function to display active filters summary
	const getActiveFiltersText = () => {
		const filters = [];

		if (priceRange.min) filters.push(`Prezzo min: €${priceRange.min}`);
		if (priceRange.max) filters.push(`Prezzo max: €${priceRange.max}`);
		if (kmRange.min) filters.push(`KM min: ${kmRange.min}`);
		if (kmRange.max) filters.push(`KM max: ${kmRange.max}`);
		if (geoFilters.town) filters.push(`Città: ${geoFilters.town}`);
		if (geoFilters.region) filters.push(`Regione: ${geoFilters.region}`);
		if (geoFilters.provincia) filters.push(`Provincia: ${geoFilters.provincia}`);
		if (yearFilter) filters.push(`Anno: ${yearFilter}`);
		if (phoneFilter !== 'tutti') filters.push(`Telefono: ${phoneFilter === 'conNumero' ? 'Con numero' : 'Senza numero'}`);
		if (search) filters.push(`Ricerca: "${search}"`);

		return filters.length > 0 ? filters.join(' | ') : 'Nessun filtro attivo';
	};

	//SELECTED LEADS FOR BULK ACTIONS
	const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
	const toggleSelectLead = (id: string) => {
		setSelectedLeads(prev =>
			prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
		);
	};

	const selectAllLeads = () => {
		if (selectedLeads.length === leads.filter((e: any) => {
			const matchesSearch = JSON.stringify(e).toLowerCase().includes(search.toLowerCase());
			const matchesPhoneFilter = phoneFilter === 'tutti' || (phoneFilter === 'conNumero' && e.contactPhoneNumber) || (phoneFilter === 'senzaNumero' && !e.contactPhoneNumber);
			const matchesPriceFilter = (!priceRange.min || (e.price && parseFloat(e.price) >= parseFloat(priceRange.min))) && (!priceRange.max || (e.price && parseFloat(e.price) <= parseFloat(priceRange.max)));
			const matchesKmFilter = (!kmRange.min || (e.mileage_scalar && parseFloat(e.mileage_scalar) >= parseFloat(kmRange.min))) && (!kmRange.max || (e.mileage_scalar && parseFloat(e.mileage_scalar) <= parseFloat(kmRange.max)));
			const matchesGeoFilter = (!geoFilters.town || (e.geo_town && e.geo_town.toLowerCase().includes(geoFilters.town.toLowerCase()))) && (!geoFilters.region || (e.geo_region && e.geo_region.toLowerCase().includes(geoFilters.region.toLowerCase()))) && (!geoFilters.provincia || (e.geo_provincia && e.geo_provincia.toLowerCase().includes(geoFilters.provincia.toLowerCase())));

			// Year filter
			let matchesYearFilter = true;
			if (yearFilter && e.register_date) {
				const parts = e.register_date.split('/');
				if (parts.length === 2) {
					const year = parts[1];
					matchesYearFilter = year === yearFilter;
				} else {
					matchesYearFilter = false;
				}
			}

			return matchesSearch && matchesPhoneFilter && matchesPriceFilter && matchesKmFilter && matchesGeoFilter && matchesYearFilter;
		}).length) {
			// If all leads are selected, deselect all
			setSelectedLeads([]);
		} else {
			// Select all filtered leads
			const filteredLeadIds = leads
				.filter((e: any) => {
					const matchesSearch = JSON.stringify(e).toLowerCase().includes(search.toLowerCase());
					const matchesPhoneFilter = phoneFilter === 'tutti' || (phoneFilter === 'conNumero' && e.contactPhoneNumber) || (phoneFilter === 'senzaNumero' && !e.contactPhoneNumber);
					const matchesPriceFilter = (!priceRange.min || (e.price && parseFloat(e.price) >= parseFloat(priceRange.min))) && (!priceRange.max || (e.price && parseFloat(e.price) <= parseFloat(priceRange.max)));
					const matchesKmFilter = (!kmRange.min || (e.mileage_scalar && parseFloat(e.mileage_scalar) >= parseFloat(kmRange.min))) && (!kmRange.max || (e.mileage_scalar && parseFloat(e.mileage_scalar) <= parseFloat(kmRange.max)));
					const matchesGeoFilter = (!geoFilters.town || (e.geo_town && e.geo_town.toLowerCase().includes(geoFilters.town.toLowerCase()))) && (!geoFilters.region || (e.geo_region && e.geo_region.toLowerCase().includes(geoFilters.region.toLowerCase()))) && (!geoFilters.provincia || (e.geo_provincia && e.geo_provincia.toLowerCase().includes(geoFilters.provincia.toLowerCase())));

					// Year filter
					let matchesYearFilter = true;
					if (yearFilter && e.register_date) {
						const parts = e.register_date.split('/');
						if (parts.length === 2) {
							const year = parts[1];
							matchesYearFilter = year === yearFilter;
						} else {
							matchesYearFilter = false;
						}
					}

					return matchesSearch && matchesPhoneFilter && matchesPriceFilter && matchesKmFilter && matchesGeoFilter && matchesYearFilter;
				})
				.map((e: any) => e.id);
			setSelectedLeads(filteredLeadIds);
		}
	};

	//DELETE MULTIPLE LEADS
	async function deleteSelectedLeads() {
		if (selectedLeads.length === 0) return;

		if (!confirm(`Sei sicuro di voler eliminare ${selectedLeads.length} lead?`)) {
			return;
		}

		try {
			const params = {
				action: 'delMultipleLeadsById',
				ids: selectedLeads,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};

			const res = await fetch('/api/leads', options);

			if (res.status == 200) {
				setLeads((prevItems: any[]) =>
					prevItems.filter(item => !selectedLeads.includes(item.id))
				);
				setSelectedLeads([]);
				toast(`${selectedLeads.length} lead eliminati con successo`);
			} else {
				toast("Errore durante l'eliminazione");
			}
		} catch (error) {
			console.error('Failed to delete leads:', error);
			toast("Errore durante l'eliminazione");
		}
	}

	console.log(leads, 'leads');

	return (
		<>
			<Toaster />
			{openNewSearch && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={() => setOpenNewSearch(!openNewSearch)} // Close the popup when clicking outside
				>
					<div className="relative h-[99%] w-[99%]">
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
								onClick={() => setOpenNewSearch(!openNewSearch)}
								className="absolute top-4 right-4 px-4 py-2 rounded"
							>
								<X />
							</motion.button>
						</motion.div>
					</div>
				</div>
			)}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
					onClick={togglePopup} // Close the popup when clicking outside
				>
					<div
						className={
							type != 'today' && type != 'search'
								? 'relative h-[99%] w-[99%]'
								: 'relative h-[60%] w-[50%]'
						}
					>
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
							{type != 'today' && type != 'search' && type != 'garage' && (
								<Lead
									session={session}
									agency={agency}
									setLeads={setLeads}
									lead={selectedLead}
									setIsOpen={setIsOpen}
									leadType={type}
									setSelectedLead={setSelectedLead}
								/>
							)}
							{(type == 'today' || type == 'search') && (
								<CSVLead
									session={session}
									agency={agency}
									setLeads={setLeads}
									lead={selectedLead}
									csvAssigned={csvAssigned}
									setCsvAssigned={setCsvAssigned}
									selectLead={selectLead}
									setIsOpen={setIsOpen}
								/>
							)}
							{(type == 'garage') && (
								<GarageLead
									session={session}
									agency={agency}
									setLeads={setLeads}
									lead={selectedLead}
									csvAssigned={csvAssigned}
									setCsvAssigned={setCsvAssigned}
									selectLead={selectLead}
									setIsOpen={setIsOpen}
								/>
							)}
						</motion.div>
					</div>
				</div>
			)}
			<div className="p-4 flex justify-between items-center gap-2 flex-col md:flex-row">
				<div className="flex gap-2 items-center flex-wrap w-full md:w-auto">
					<div className="flex items-center gap-1 mb-2">
						<input
							className="rounded-xl border border-slate-100 p-2 w-full"
							placeholder="Cerca..."
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<motion.button
							onClick={() => getLeads(type)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="rounded-full p-2 text-white bg-blue-500"
						>
							<Search />
						</motion.button>
					</div>

					<div className="flex items-center gap-2">
						<RicezioneButton
							session={session}
							agency={agency}
							userRoles={userRoles}
							setReceiveLeads={setReceiveLeads}
							receiveLeads={receiveLeads}
						/>
					</div>
				</div>
				<div className="flex flex-col">

					{type == 'today' &&
						<h1 className="font-light text-xl sm:text-xl md:text-4xl lg:text-4xl xl:text-4xl text-right text-slate-500">
							{!csvLeadsLoading ? csvLeads.length + ' CSV' : 'CSV in caricamento'}
						</h1>
					}
					<h1 className="font-light text-xl sm:text-xl md:text-4xl lg:text-4xl xl:text-4xl text-right text-slate-500">
						{!leadsLoading && leads ? leads.length + ' da lavorare' : 'Leads in caricamento'}
					</h1>
				</div>
			</div>

			<div className="p-4">
				<div className="p-1 bg-slate-200 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7 lg:grid-cols-7 xl:grid-cols-7 gap-1 rounded-2xl font-semilight">
					<div
						onClick={() => switchLeadType('today')}
						className={`${type == 'today' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Giornalieri</p>
					</div>
					<div
						onClick={() => switchLeadType('garage')}
						className={`${type == 'garage' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Garage</p>
					</div>
					<div
						onClick={() => switchLeadType('search')}
						className={`${type == 'search' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Ricerca Manuale</p>
					</div>
					<div
						onClick={() => switchLeadType('assigned')}
						className={`${type == 'assigned' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Assegnati</p>
					</div>
					<div
						onClick={() => switchLeadType('interested')}
						className={`${type == 'interested' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Interessati</p>
					</div>
					<div
						onClick={() => switchLeadType('not_interested')}
						className={`${type == 'not_interested' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Non interessati</p>
					</div>
					<div
						onClick={() => switchLeadType('commercianti')}
						className={`${type == 'commercianti' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
					>
						<p>Commercianti</p>
					</div>
				</div>
			</div>

			<div className="p-4">
				<div className="flex items-center space-x-4 mb-2">
					<DatePicker
						locale="it"
						dateFormat="P"
						className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4"
						selectsRange={true}
						startDate={startDate}
						endDate={endDate}
						onChange={(update: any) => {
							setDateRange(update);
						}}
						withPortal
					/>
					{type == 'today' &&
						csvLeads.length != csvAssigned.length &&
						csvLeads.length - csvAssigned.length > 0 && (
							<div className="flex flex-items">
								<p className="p-2">
									Ci sono{' '}
									<strong>{csvLeads.length - csvAssigned.length}</strong> nuovi
									lead! Salvali nel Database
								</p>
								<motion.button
									onClick={() => saveNewLeads()}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className="rounded-xl bg-gradient-to-r p-2 text-white from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%"
								>
									{newLeadsLoading && (
										<div className="flex justify-center items-center p-1">
											<Spinner />
										</div>
									)}
									{!newLeadsLoading && 'Salva nuovi Lead'}
								</motion.button>
								<div className="flex flex-items-center gap-2 mt-2 mb-2 ml-2">
									<input
										type="checkbox"
										checked={sendSpoki}
										className="hover:cursor-pointer"
										onClick={() => setSendSpoki(!sendSpoki)}
									/>
									<p>Invia anche messaggio di presentazione Spoki</p>
								</div>
							</div>
						)}
				</div>
				<div className="w-full flex items-center gap-2 mb-2">

					<div className="flex flex-wrap gap-3 w-full">
						{/* Price Range Filters */}
						<div className="flex flex-col w-full sm:w-auto">
							<h3 className="text-sm font-semibold mb-1 text-gray-700">Filtri prezzo</h3>
							<div className="flex items-center gap-1">
								<input
									type="number"
									className="rounded-xl border border-slate-100 p-2 w-24"
									placeholder="€ Min"
									value={priceRange.min}
									onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
								/>
								<span>-</span>
								<input
									type="number"
									className="rounded-xl border border-slate-100 p-2 w-24"
									placeholder="€ Max"
									value={priceRange.max}
									onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
								/>
							</div>
						</div>

						{/* KM Range Filters */}
						<div className="flex flex-col w-full sm:w-auto">
							<h3 className="text-sm font-semibold mb-1 text-gray-700">Filtri chilometraggio</h3>
							<div className="flex items-center gap-1">
								<input
									type="number"
									className="rounded-xl border border-slate-100 p-2 w-24"
									placeholder="KM Min"
									value={kmRange.min}
									onChange={e => setKmRange({ ...kmRange, min: e.target.value })}
								/>
								<span>-</span>
								<input
									type="number"
									className="rounded-xl border border-slate-100 p-2 w-24"
									placeholder="KM Max"
									value={kmRange.max}
									onChange={e => setKmRange({ ...kmRange, max: e.target.value })}
								/>
							</div>
						</div>

						{/* Geographic Filters */}
						<div className="flex flex-col w-full sm:w-auto">
							<h3 className="text-sm font-semibold mb-1 text-gray-700">Filtri geografici</h3>
							<div className="flex flex-col sm:flex-row items-center gap-1 w-full">
								<div className="w-full sm:w-1/3 mb-1 sm:mb-0">
									<select
										className="rounded-xl border border-slate-100 p-2 w-full"
										value={geoFilters.town}
										onChange={e => setGeoFilters({ ...geoFilters, town: e.target.value })}
									>
										<option value="">Tutte le città</option>
										{uniqueGeoOptions.towns.map((town, index) => (
											<option key={index} value={town}>{town}</option>
										))}
									</select>
								</div>
								<div className="w-full sm:w-1/3 mb-1 sm:mb-0">
									<select
										className="rounded-xl border border-slate-100 p-2 w-full"
										value={geoFilters.region}
										onChange={e => setGeoFilters({ ...geoFilters, region: e.target.value })}
									>
										<option value="">Tutte le regioni</option>
										{uniqueGeoOptions.regions.map((region, index) => (
											<option key={index} value={region}>{region}</option>
										))}
									</select>
								</div>
								<div className="w-full sm:w-1/3">
									<select
										className="rounded-xl border border-slate-100 p-2 w-full"
										value={geoFilters.provincia}
										onChange={e => setGeoFilters({ ...geoFilters, provincia: e.target.value })}
									>
										<option value="">Tutte le provincie</option>
										{uniqueGeoOptions.provincias.map((provincia, index) => (
											<option key={index} value={provincia}>{provincia}</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Year Filter */}
						<div className="flex flex-col w-full sm:w-auto">
							<h3 className="text-sm font-semibold mb-1 text-gray-700">Anno</h3>
							<div className="flex items-center gap-1">
								<select
									className="rounded-xl border border-slate-100 p-2 w-full"
									value={yearFilter}
									onChange={e => setYearFilter(e.target.value)}
								>
									<option value="">Tutti gli anni</option>
									{uniqueYears.map((year, index) => (
										<option key={index} value={year}>{year}</option>
									))}
								</select>
							</div>
						</div>

						{/* Phone Filter */}
						<div className="flex flex-col w-full sm:w-auto">
							<h3 className="text-sm font-semibold mb-1 text-gray-700">Filtri telefono</h3>
							<div className="flex items-center gap-1">
								<select
									className="rounded-xl border border-slate-100 p-2 w-full"
									value={phoneFilter}
									onChange={e => setPhoneFilter(e.target.value)}
								>
									<option value="tutti">Tutti</option>
									<option value="conNumero">Con numero</option>
									<option value="senzaNumero">Senza numero</option>
								</select>
							</div>
						</div>

						<div className="flex items-center gap-1 self-end mb-1">

							{/* Reset Filters Button */}
							<motion.button
								onClick={() => {
									setPriceRange({ min: '', max: '' });
									setKmRange({ min: '', max: '' });
									setGeoFilters({ town: '', region: '', provincia: '' });
									setPhoneFilter('tutti');
									setYearFilter('');
									setSearch('');
									getLeads(type); // Apply the reset filters immediately
								}}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="rounded-full p-2 text-white bg-red-500"
							>
								<X size={16} />
							</motion.button>
						</div>
					</div>
				</div>

				{!leadsLoading && !receiveLeadsLoading && receiveLeads && (
					<>
						{/* Active Filters Summary */}
						{(priceRange.min || priceRange.max || kmRange.min || kmRange.max ||
							geoFilters.town || geoFilters.region || geoFilters.provincia ||
							phoneFilter !== 'tutti' || search) && (
								<div className="bg-blue-50 p-2 rounded-xl mb-3 text-sm text-blue-800 flex items-center justify-between">
									<div>
										<span className="font-semibold mr-2">Filtri attivi:</span>
										<span>{getActiveFiltersText()}</span>
									</div>
									<div>
										{leads.filter((e: any) => {
											// Filter based on the search term (existing filter)
											const matchesSearch = JSON.stringify(e)
												.toLowerCase()
												.includes(search.toLowerCase());

											// Apply phone number filter
											const matchesPhoneFilter =
												phoneFilter === 'tutti' ||
												(phoneFilter === 'conNumero' && e.contactPhoneNumber) ||
												(phoneFilter === 'senzaNumero' && !e.contactPhoneNumber);

											// Price range filter
											const matchesPriceFilter =
												(!priceRange.min || (e.price && parseFloat(e.price) >= parseFloat(priceRange.min))) &&
												(!priceRange.max || (e.price && parseFloat(e.price) <= parseFloat(priceRange.max)));

											// Km range filter
											const matchesKmFilter =
												(!kmRange.min || (e.mileage_scalar && parseFloat(e.mileage_scalar) >= parseFloat(kmRange.min))) &&
												(!kmRange.max || (e.mileage_scalar && parseFloat(e.mileage_scalar) <= parseFloat(kmRange.max)));

											// Geographic filters
											const matchesGeoFilter =
												(!geoFilters.town || (e.geo_town && e.geo_town.toLowerCase().includes(geoFilters.town.toLowerCase()))) &&
												(!geoFilters.region || (e.geo_region && e.geo_region.toLowerCase().includes(geoFilters.region.toLowerCase()))) &&
												(!geoFilters.provincia || (e.geo_provincia && e.geo_provincia.toLowerCase().includes(geoFilters.provincia.toLowerCase())));

											// Year filter
											let matchesYearFilter = true;
											if (yearFilter && e.register_date) {
												const parts = e.register_date.split('/');
												if (parts.length === 2) {
													const year = parts[1];
													matchesYearFilter = year === yearFilter;
												} else {
													matchesYearFilter = false;
												}
											}

											// Return only leads that match all filters
											return matchesSearch && matchesPhoneFilter && matchesPriceFilter && matchesKmFilter && matchesGeoFilter && matchesYearFilter;
										}).length} risultati trovati
									</div>
								</div>
							)}

						{/* Bulk Actions Bar */}
						<div className="flex justify-between items-center mb-3">
							<div className="flex items-center">
								<div
									onClick={selectAllLeads}
									className="cursor-pointer flex items-center mr-4"
								>
									{selectedLeads.length === leads.filter((e: any) => {
										const matchesSearch = JSON.stringify(e).toLowerCase().includes(search.toLowerCase());
										const matchesPhoneFilter = phoneFilter === 'tutti' || (phoneFilter === 'conNumero' && e.contactPhoneNumber) || (phoneFilter === 'senzaNumero' && !e.contactPhoneNumber);
										const matchesPriceFilter = (!priceRange.min || (e.price && parseFloat(e.price) >= parseFloat(priceRange.min))) && (!priceRange.max || (e.price && parseFloat(e.price) <= parseFloat(priceRange.max)));
										const matchesKmFilter = (!kmRange.min || (e.mileage_scalar && parseFloat(e.mileage_scalar) >= parseFloat(kmRange.min))) && (!kmRange.max || (e.mileage_scalar && parseFloat(e.mileage_scalar) <= parseFloat(kmRange.max)));
										const matchesGeoFilter = (!geoFilters.town || (e.geo_town && e.geo_town.toLowerCase().includes(geoFilters.town.toLowerCase()))) && (!geoFilters.region || (e.geo_region && e.geo_region.toLowerCase().includes(geoFilters.region.toLowerCase()))) && (!geoFilters.provincia || (e.geo_provincia && e.geo_provincia.toLowerCase().includes(geoFilters.provincia.toLowerCase())));
										return matchesSearch && matchesPhoneFilter && matchesPriceFilter && matchesKmFilter && matchesGeoFilter;
									}).length && selectedLeads.length > 0 ?
										<CheckSquare className="text-blue-500 mr-1" size={18} /> :
										<Square className="text-gray-500 mr-1" size={18} />}
									<span className="text-sm">Seleziona tutti</span>
								</div>
							</div>
							{selectedLeads.length > 0 && (
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">{selectedLeads.length} lead selezionati</span>
									<motion.button
										onClick={deleteSelectedLeads}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
									>
										<Trash size={14} />
										<span>Elimina selezionati</span>
									</motion.button>
								</div>
							)}
						</div>

						{leads
							.filter((e: Lead) => {
								// Filter based on the search term (existing filter)
								const matchesSearch = JSON.stringify(e)
									.toLowerCase()
									.includes(search.toLowerCase());

								// Apply phone number filter
								const matchesPhoneFilter =
									phoneFilter === 'tutti' ||
									(phoneFilter === 'conNumero' && e.contactPhoneNumber) ||
									(phoneFilter === 'senzaNumero' && !e.contactPhoneNumber);

								// Price range filter
								const matchesPriceFilter =
									(!priceRange.min || (e.price >= parseFloat(priceRange.min))) &&
									(!priceRange.max || (e.price <= parseFloat(priceRange.max)));

								// Km range filter
								const matchesKmFilter =
									(!kmRange.min || (e.mileageScalar && parseFloat(e.mileageScalar) >= parseFloat(kmRange.min))) &&
									(!kmRange.max || (e.mileageScalar && parseFloat(e.mileageScalar) <= parseFloat(kmRange.max)));

								// Geographic filters
								const matchesGeoFilter =
									(!geoFilters.town || (e.geoTown && e.geoTown.toLowerCase().includes(geoFilters.town.toLowerCase()))) &&
									(!geoFilters.region || (e.geoRegion && e.geoRegion.toLowerCase().includes(geoFilters.region.toLowerCase()))) &&
									(!geoFilters.provincia || (e.geoProvincia && e.geoProvincia.toLowerCase().includes(geoFilters.provincia.toLowerCase())));

								// Year filter
								let matchesYearFilter = true;
								if (yearFilter && e.registerDate) {
									const parts = e.registerDate.split('/');
									if (parts.length === 2) {
										const year = parts[1];
										matchesYearFilter = year === yearFilter;
									} else {
										matchesYearFilter = false;
									}
								}

								// Return only leads that match all filters
								return matchesSearch && matchesPhoneFilter && matchesPriceFilter && matchesKmFilter && matchesGeoFilter && matchesYearFilter;
							})
							.map((e: Lead, index: number) => (
								<div className="flex items-center justify-between gap-2" key={e.id || index}>
									<div
										className="cursor-pointer p-2"
										onClick={() => toggleSelectLead(e.id)}
									>
										{selectedLeads.includes(e.id) ?
											<CheckSquare className="text-blue-500" size={18} /> :
											<Square className="text-gray-400" size={18} />}
									</div>
									<motion.div
										onClick={() => selectLead(e, e.isConfirmed ? type : type)}
										drag
										dragElastic={1}
										dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.9 }}
										className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl mb-1 text-slate-800 flex-1"
									>
										<div className="grid grid-cols-1 sm:grid sm:grid-cols-1 md:grid md:grid-cols-1 lg:flex xl:flex lg:gap-4 xl:gap-4 text-sm">
											<Image
												src={e.url ? getLogoPortale(e.url) : getLogoPortale('tua-car')}
												height={50}
												width={50}
												alt="ok"
											/>
											<p className="flex-1 mt-3">
												{e.description
													? e.description.substring(0, 30) + '...'
													: ''}
											</p>
											<p className="flex-1 mt-3">
												{e.contactName ? e.contactName : ''}
											</p>
											<p className="flex-1 mt-3">
												{e.contactEmail ? e.contactEmail : ''}
											</p>
											<p className="flex-1 mt-3">
												{e.contactPhoneNumber ? e.contactPhoneNumber : ''}
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
												{e.price ? formatCurrencyEUR(e.price) : ''}
											</p>
											<p className="flex-1 mt-3">
												{e.registerDate ? e.registerDate : ''}
											</p>
											<p className="flex-1 mt-3">
												{e.mileageScalar ? e.mileageScalar + ' km' : ''}
											</p>
											<p className="flex-1 mt-3">
												{e.geoTown || e.geoRegion || e.geoProvincia
													? e.geoTown +
													', ' +
													e.geoRegion +
													', ' +
													e.geoProvincia
													: ''}
											</p>
											<p className="flex-1 mt-3">
												{e.isConfirmed ? (
													<span className="flex items-center text-xs">
														<Pocket className="text-green-500 mr-2" />
														<span>assegnato</span>
													</span>
												) : (
													<span className="flex items-center text-xs">
														<CircleCheck className="text-red-500 mr-2" />
														<span>da assegnare</span>
													</span>
												)}
											</p>
											<p className="flex-1">
												{e.notesCount > 0 ? (
													<span className="flex items-center">
														<Dot size={48} className="text-orange-500" />
													</span>
												) : (
													<span className="flex items-center">
														<Dot size={48} className="text-blue-500" />
													</span>
												)}
											</p>
										</div>
									</motion.div>
									<Trash
										className="hover:cursor-pointer"
										size={15}
										onClick={() => delLead(e.id)}
									/>
								</div>
							))}
						<div className="flex items-center gap-2 mt-2">
							<ArrowLeft className={`${pagination.current - 1 > 0 ? '' : 'hidden'}`} onClick={() => setPagination((prevState: any) => ({
								...prevState,
								current: pagination.current - 1
							}))} />
							<button className="rounded-full p-4 bg-slate-100 text-sm">
								{pagination.current} di {pagination.total}
							</button>
							<ArrowRight className={`${pagination.current + 1 <= pagination.total ? '' : 'hidden'}`} onClick={() => setPagination((prevState: any) => ({
								...prevState,
								current: pagination.current + 1
							}))} />
						</div>
					</>
				)}
				{leadsLoading && (
					<div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
				)}
			</div>
		</>
	);
}
