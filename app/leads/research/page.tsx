'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { toast, Toaster } from 'sonner';
import { it } from 'date-fns/locale/it';
import { registerLocale } from 'react-datepicker';
import Tabs, { UserNav } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

registerLocale('it', it);

export default function Leads() {
    const router = useRouter();

    //FETCH SESSION & DETAILS
    const [comuni, setComuni] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const { agencyEmail }: any = useAppContext();

    useEffect(() => {
        async function getAgency() {
            try {
                const responseComuni = await fetch('/api/leads/location/comuni?userMail=' + agencyEmail);
                const comuni = await responseComuni.json();
                setComuni(comuni.comuni);

                // Check if user is admin
                const responseSession = await fetch('/api/session');
                const sessionData = await responseSession.json();
                setIsAdmin(sessionData.userRoles.find((role: string) => role.includes('admin')));
            } catch (error) {
                toast.error('Errore nel caricamento della sessione')
            } finally {
                setLoading(false);
            }
        }
        if (agencyEmail) {
            getAgency();
        }
    }, [agencyEmail]);

    if (loading) return (<div className="bg-[#011529] min-h-screen" />)

        return (
            <div className="bg-[#011529] min-h-screen">
                <div className='py-12 md:py-24 lg:py-32 mx-auto w-3/4'>
                    <Toaster />
                    <UserNav isAdminCheck={isAdmin} />
                    <Tabs comuni={comuni} email={agencyEmail} isAdmin={isAdmin} />
                </div>
            </div>
        );
}
