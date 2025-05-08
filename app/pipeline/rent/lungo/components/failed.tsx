
"use client"

import { formatCurrencyEUR } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";

export function Failed({ agency, selectDeal, search }: any) {

    const [dealsLimit, setDealsLimit] = useState(50)
    //LEAD DATE FILTER
    const [dateRange, setDateRange] = useState([
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date()
    ]);
    const [startDate, endDate] = dateRange;

    const [failedDeals, setFailedDeals] = useState([])
    const [failedCount, setFailedCount] = useState(0)
    const [failedDealsLoading, setFailedDealsLoading] = useState(false)

    async function getFailed() {
        try {
            const params = {
                action: 'getFailedVendita',
                agencyCode: agency,
                startDate: startDate,
                endDate: endDate,
                dealsLimit: dealsLimit
            };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            };

            const response = await fetch('/api/pipeline', options);
            const data = await response.json();

            setFailedDeals(data.data);
            setFailedCount(data.count)
        } catch (error) {
            console.error('Failed to fetch won deals:', error);
        } finally {
            setFailedDealsLoading(false);
        }
    }

    useEffect(() => {
        if (agency) {
            getFailed();
        }
    }, [agency, dealsLimit, endDate])

    return (
        <>
            <div className="p-4">
                <div className="flex items-center space-x-4 mb-2">
                    <DatePicker
                        className="w-[200px] p-2 rounded-2xl bg-slate-200 mb-4"
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update: any) => {
                            setDateRange(update);
                        }}
                        withPortal
                    />
                </div>
                {!failedDealsLoading && (
                    <>
                        {failedDeals
                            .filter((e: any) => {
                                // Filter based on the search term (existing filter)
                                const matchesSearch = JSON.stringify(e).toLowerCase().includes(search.toLowerCase());
                                return matchesSearch;
                            })
                            .map((e: any, index: number) => (
                                <motion.div
                                    key={index} // Added a unique key for each deal
                                    onClick={() => selectDeal(e)}
                                    drag
                                    dragElastic={1}
                                    dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl mb-2 text-slate-800"
                                >
                                    <div className="flex gap-4">
                                        <p className="flex-1">{e.title ? e.title.substring(0, 30) + '...' : "-"}</p>
                                        <p className="flex-1">{e.contactName ? e.contactName : "-"}</p>
                                        <p className="flex-1">{e.contactEmail ? e.contactEmail : "-"}</p>
                                        <p className="flex-1">{e.contactPhoneNumber ? e.contactPhoneNumber : "-"}</p>
                                        <p className="flex-1">{e.carName ? e.carName : "-"}</p>
                                        <p className="flex-1">{e.createdAt.replace("T", " ").replace(".000Z", "").split(" ")[0].split("-").reverse().join("-") + " " + e.createdAt.replace("T", " ").replace(".000Z", "").split(" ")[1]}</p>
                                        <p className="flex-1">{e.value ? formatCurrencyEUR(e.value) : "-"}</p>
                                        <p className="flex-1">{e.plate ? e.plate : "-"}</p>
                                    </div>
                                </motion.div>
                            ))}
                    </>
                )}
                {failedDealsLoading && (
                    <div className="p-3 bg-blue-slate-200 rounded-xl text-white mb-2" />
                )}
            </div>

        </>
    )
}