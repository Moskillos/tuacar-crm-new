'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Acquisizioni } from './components/acquisizioni';
import { Vendite } from './components/vendite';
import { useAppContext } from '@/hooks/useAppContext';
import { Leads } from './components/leads';

export default function Dashboard() {
	//FETCH SESSION & DETAILS
	const [session, setSession] = useState(null);
	const [userRoles, setUserRoles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const { agency, agencyEmail }: any = useAppContext();

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

	//DATE FILTER
	const [dateRange, setDateRange] = useState([
		new Date(new Date().setMonth(new Date().getMonth() - 1)),
		new Date(),
	]);
	const [startDate, endDate] = dateRange;

	const [dateFilter, setDateFilter] = useState('');

	const thisMonth = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		setDateRange([startOfMonth, endOfMonth]);
		setDateFilter('thisMonth');
	};

	const lastMonth = () => {
		const now = new Date();
		const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		setDateRange([startOfLastMonth, endOfLastMonth]);
		setDateFilter('lastMonth');
	};

	const thisWeek = () => {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const startOfWeek = new Date(now.setDate(now.getDate() - diffToMonday));
		startOfWeek.setHours(0, 0, 0, 0);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 6);
		endOfWeek.setHours(23, 59, 59, 999);
		setDateRange([startOfWeek, endOfWeek]);
		setDateFilter('thisWeek');
	};

	const [stats, setStats] = useState<any>(null);
	const [statsLoading, setStatsLoading] = useState(true);

	useEffect(() => {
		async function getStats() {
			setStatsLoading(true);
			try {
				const params = {
					action: 'stats',
					agency,
					startDate,
					endDate,
				};

				const options: RequestInit = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(params),
				};

				const response = await fetch('/api/stats', options);
				const data = await response.json();

				setStats(data.data);
			} catch (error) {
				console.error('Failed to fetch stats details:', error);
			} finally {
				setStatsLoading(false);
			}
		}
		if (agency) {
			getStats();
		}
	}, [agency, startDate, endDate]);

	return (
		<>
			<div className="flex flex-items justify-between">
				<p className="text-4xl p-4 font-light">
					{agencyEmail || '-'}
				</p>
			</div>

			<div className="flex flex-items p-4 gap-2">
				<DatePicker
					locale="it"
					dateFormat="P"
					className="w-[260px] p-4 text-sm rounded-2xl bg-slate-200 mb-4"
					selectsRange={true}
					startDate={startDate}
					endDate={endDate}
					onChange={(update: any) => {
						setDateRange(update);
					}}
					withPortal
				/>
				<div
					onClick={thisMonth}
					className={`"w-[260px] p-4 text-sm rounded-2xl ${dateFilter === 'thisMonth' ? 'bg-blue-500' : 'bg-slate-200'} mb-4 hover:cursor-pointer hover:bg-blue-500"`}
				>
					Questo mese
				</div>
				<div
					onClick={lastMonth}
					className={`"w-[260px] p-4 text-sm rounded-2xl ${dateFilter === 'lastMonth' ? 'bg-blue-500' : 'bg-slate-200'} mb-4 hover:cursor-pointer hover:bg-blue-500"`}
				>
					Scorso mese
				</div>
				<div
					onClick={thisWeek}
					className={`"w-[260px] p-4 text-sm rounded-2xl ${dateFilter === 'thisWeek' ? 'bg-blue-500' : 'bg-slate-200'} mb-4 hover:cursor-pointer hover:bg-blue-500"`}
				>
					Questa settimana
				</div>
			</div>

			<div className="grid grid-cols-2">
				<Acquisizioni stats={stats} statsLoading={statsLoading}
				/>
				<Vendite stats={stats} statsLoading={statsLoading} />
				<Leads stats={stats} statsLoading={statsLoading} />
			</div>
		</>
	);
}
