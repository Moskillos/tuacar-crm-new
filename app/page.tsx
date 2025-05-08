'use client';

import { useAppContext } from '@/hooks/useAppContext';
import Agency from '@/types/agencies/Agency';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const { agency, setAgency, setAgencyEmail }: { agency: string; setAgency: (code: string) => void; setAgencyEmail: (email: string) => void; } = useAppContext();

  const [agencies, setAgencies] = useState<Agency[]>([])
  const [agenciesLoading, setAgenciesLoading] = useState(true)

  useEffect(() => {
    async function getAgencies() {
      try {
        const response = await fetch('/api/agencies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAgencies(data.data);
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setAgenciesLoading(false);
      }
    }

    getAgencies();
  }, []);

  const selectAgency = (agency: Agency) => {
    setAgency(agency.code)
    setAgencyEmail(agency.email)
  }

  return (
    <div className="bg-[#011529] min-h-screen flex flex-col items-center justify-center pb-4 pt-4">
      <Image src="/logo.png" alt="logo" width={250} height={250} />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-8 p-5 w-full sm:w-full md:w-full lg:w-full xl:max-w-2xl">
        {
          agenciesLoading ? (
            Array(9).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse text-slate-800 p-4 text-center hover:cursor-pointer shadow-xl bg-slate-800 rounded-2xl">
                <p>TUACAR TUACAR</p>
                <p className="text-xs">......</p>
              </div>
            ))
          ) : (
            agencies.map((a: Agency) => (
              <motion.div
                key={a.code}
                onClick={() => selectAgency(a)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-2xl ${agency == a.code ? "bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100%" : "bg-slate-800"} text-white p-4 text-center hover:cursor-pointer shadow-xl`}>
                {a.description}
                <p className="text-xs">{a.agenziaPrincipale?.description ?? "-"}</p>
              </motion.div>
            ))
          )
        }
      </div>
    </div>
  )
}
