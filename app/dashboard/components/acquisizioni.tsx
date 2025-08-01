'use client';

import { formatCurrencyEUR } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AcquisizioniProps {
	stats?: {
		carsToBuy?: string;
		emailsAds?: string;
		acquisizioni?: {
			totaliValue?: number;
			vinteValue?: number;
			perseValue?: number;
		};
		vendite?: {
			totaliValue?: number;
			vinteValue?: number;
			perseValue?: number;
		};
	};
	statsLoading?: boolean;
}

interface Card {
	id: number;
	title: string;
	value: string;
}

export function Acquisizioni({
	stats,
	statsLoading
}: AcquisizioniProps) {

	const cards: Card[] = [
		{
			id: 1,
			title: 'Acquisizioni',
			value: stats?.acquisizioni?.totaliValue
				? formatCurrencyEUR(stats.acquisizioni.totaliValue)
				: formatCurrencyEUR(0),
		},
		{
			id: 2,
			title: 'Vinte',
			value: stats?.acquisizioni?.vinteValue
				? formatCurrencyEUR(stats.acquisizioni.vinteValue)
				: formatCurrencyEUR(0),
		},
		{
			id: 3,
			title: 'Perse',
			value: stats?.acquisizioni?.perseValue
				? formatCurrencyEUR(stats.acquisizioni.perseValue)
				: formatCurrencyEUR(0),
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 pl-4 pr-4">
			{cards.map(card => (
				<div
					key={card.id}
					className="flex flex-col gap-1 rounded-2xl p-4 bg-emerald-500 bg-opacity-70 shadow-xl"
				>
					<div className="text-2xl">
						{statsLoading ? (
							<Skeleton className="w-[100px] h-[20px] rounded-full" />
						) : (
							<p className="text-xl">{card.title}</p>
						)}
					</div>
					<div className="text-3xl">
						{statsLoading ? (
							<Skeleton className="w-[100px] h-[20px] rounded-full" />
						) : (
							<p>{card.value}</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
