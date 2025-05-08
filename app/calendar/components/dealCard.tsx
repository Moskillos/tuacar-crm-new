'use client';

import { Mail, Phone, ReceiptEuro } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function DealCard({ extendedActivity }: any) {
	//GO TO PIPELINE/LEAD
	const router = useRouter();
	const goTo = (source: string, id: string) => {
		router.push(source + '?id=' + id);
	};

	return (
		<>
			{extendedActivity && (
				<>
					{extendedActivity.extendedProps.carToBuyId &&
						extendedActivity.extendedProps.dealId != null && (
							<motion.div
								onClick={() =>
									goTo(
										'pipeline/acquisizione',
										extendedActivity.extendedProps.dealId
									)
								}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="animate-pulse w-full bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-4 rounded-2xl hover:cursor-pointer"
							>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="flex items-center">
										<ReceiptEuro className="h-4 w-4 mr-2" />
										{extendedActivity.extendedProps.carToBuyDescription}
									</div>
									<div className="flex items-center">
										<Phone className="h-4 w-4 mr-2" />
										{extendedActivity.extendedProps.contactPhoneNumber}
									</div>
									<div className="flex items-center">
										<Mail className="h-4 w-4 mr-2" />
										{extendedActivity.extendedProps.contactEmail}
									</div>
								</div>
							</motion.div>
						)}
					{extendedActivity.extendedProps.carId &&
						extendedActivity.extendedProps.dealId != null && (
							<motion.div
								onClick={() =>
									goTo(
										'pipeline/vendita',
										extendedActivity.extendedProps.dealId
									)
								}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="animate-pulse w-full bg-gradient-to-r from-blue-300 from-10% via-blue-400 via-30% to-blue-500 to-100% p-4 rounded-2xl hover:cursor-pointer"
							>
								<div
									className="flex items-center text-xs"
									onClick={() =>
										goTo(
											'pipeline/vendita',
											extendedActivity.extendedProps.dealId
										)
									}
								>
									<ReceiptEuro className="h-5 w-5 mr-2" />{' '}
									{extendedActivity.extendedProps.carMake} -{' '}
									{extendedActivity.extendedProps.carModel}
								</div>
							</motion.div>
						)}
					{extendedActivity.extendedProps.dealId != null &&
						extendedActivity.extendedProps.dealPipelineId === 3 &&
						!extendedActivity.extendedProps.carToBuyId && (
							<motion.div
								onClick={() =>
									goTo(
										'pipeline/acquisizione',
										extendedActivity.extendedProps.dealId
									)
								}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="animate-pulse w-full bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-4 rounded-2xl hover:cursor-pointer"
							>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="flex items-center">
										{extendedActivity.extendedProps.dealTitle}
									</div>
								</div>
							</motion.div>
						)}

					{extendedActivity.extendedProps.dealId != null &&
						extendedActivity.extendedProps.dealPipelineId === 4 &&
						extendedActivity.extendedProps.carToRentId && (
							<motion.div
								onClick={() =>
									goTo(
										'pipeline/rent/breve',
										extendedActivity.extendedProps.dealId
									)
								}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="animate-pulse w-full bg-gradient-to-r from-orange-300 from-10% via-orange-400 via-30% to-orange-500 to-100% p-4 rounded-2xl hover:cursor-pointer"
							>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="flex items-center">
										{extendedActivity.extendedProps.dealTitle}
									</div>
								</div>
							</motion.div>
						)}

					{extendedActivity.extendedProps.dealId != null &&
						extendedActivity.extendedProps.dealPipelineId === 5 && (
							<motion.div
								onClick={() =>
									goTo(
										'pipeline/rent/lungo',
										extendedActivity.extendedProps.dealId
									)
								}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								className="animate-pulse w-full bg-gradient-to-r from-yellow-300 from-10% via-yellow-400 via-30% to-yellow-500 to-100% p-4 rounded-2xl hover:cursor-pointer"
							>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="flex items-center">
										{extendedActivity.extendedProps.dealTitle}
									</div>
								</div>
							</motion.div>
						)}
				</>
			)}
		</>
	);
}
