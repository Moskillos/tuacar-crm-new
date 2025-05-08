'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import TableSkeleton from '../pipeline/rent/components/tableSkeleton';

export default function SellersSelection({
	setDeal,
	sellers,
	setSeller,
	togglePopupSelectSellers
}: any) {

	//SEARCH FILTER
	const [search, setSearch] = useState('');

	return (
		<div>
			<div className="p-4 flex justify-between items-center gap-2">
				<div className="flex gap-2 items-center">
					<input
						className="rounded-xl border border-slate-100 p-2"
						placeholder="Cerca..."
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<h1 className="font-semibold text-4xl text-right text-slate-500"></h1>
			</div>
			<div className="p-4">
				{sellers.length > 0 &&
					<>
						{sellers
							.filter((e: any) =>
								JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
							)
							.map((e: any, index: number) => (
								<motion.div
									key={e.userId} // Added a unique key for each deal
									onClick={() => {
										setSeller(e)
										setDeal((prevState: any) => ({
											...prevState,
											userId: e.userId
										}));
										togglePopupSelectSellers()
									}}
									drag
									dragElastic={1}
									dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.9 }}
									className="p-3 bg-slate-200 hover:bg-slate-300 rounded-xl mb-2 text-slate-800"
								>
									<div className="flex gap-4">
										<p className="flex-1">{e.name}</p>
										<p className="flex-1">{e.email ? e.email : '-'}</p>
									</div>
								</motion.div>
							))}
					</>
				}
				{sellers.length == 0 &&
					<TableSkeleton />
				}
			</div>
		</div>
	);
}
