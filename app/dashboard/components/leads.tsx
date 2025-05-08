'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface StatsProps {
	stats: {
		leads: {
			carsToBuy?: string,
			emailsAds?: string
		}
	}
	statsLoading: boolean
}

interface Card {
	id: number;
	title: string;
	value?: string;
	color?: string;
}

export function Leads({ stats, statsLoading }: StatsProps) {


	const cards: Card[] = [
		{
			id: 1,
			title: 'Leads acquisizione',
			value: stats?.leads?.carsToBuy,
			color: "emerald"
		},
		{
			id: 2,
			title: 'Email cadute',
			value: stats?.leads?.emailsAds,
			color: "blue"
		}
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 pl-4 pr-4 mt-8">
			{cards.map(card => (
				<div
					key={card.id}
					className={`flex flex-col gap-1 rounded-2xl p-4  bg-${card.color}-500 bg-opacity-70 shadow-xl`}
				>
					<div className="text-xl">
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
