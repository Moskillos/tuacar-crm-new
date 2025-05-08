"use client"

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { X } from 'lucide-react';
import ContactsManager from '@/app/components/contactsManager';
import { Toaster, toast } from 'sonner'
import { useAppContext } from '@/hooks/useAppContext';
import SellersSelection from '@/app/components/sellersSelection';

export function Add({ addDealTogglePopup, setDeals, session }: any) {

    const {
        agency,
    }: any = useAppContext();

    //ASSIGN CARS HANDLER
    /*
    const [selectedCar, setSelectedCar] = useState<any>()
    const [isOpenSelectCars, setIsOpenSelectCars] = useState(false);

    const togglePopupSelectCars = () => {
        setIsOpenSelectCars(!isOpenSelectCars);
    };
    */

    //SELECT CONTACTS HANDLE
    const [contactName, setContactName] = useState("")
    const [isOpenSelectContacts, setIsOpenSelectContacts] = useState(false);

    const togglePopupSelectContacts = () => {
        setIsOpenSelectContacts(!isOpenSelectContacts);
    };

    //SELECT SELLERS HANDLER
    const [sellers, setSellers] = useState<any>([])
    useEffect(() => {
        const getSellers = async () => {
            try {
                const response = await fetch('/api/rent/getERPUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setSellers(data.users);
            } catch (error) {
                console.error('Failed to fetch sellers:', error);
            }
        };

        getSellers();
    }, []);

    const [seller, setSeller] = useState<any>(null)
    const [isOpenSelectSellers, setIsOpenSelectSellers] = useState(false);

    const togglePopupSelectSellers = () => {
        setIsOpenSelectSellers(!isOpenSelectSellers);
    };


    //ADD DEAL HANDLER
    const [deal, setDeal] = useState({
        userId: session.user.sub,
        stageId: 20, //20, 21, 22, 23, 25
        title: '',
        value: 0,
        oldNotes: '',
        end: '',
        isAwarded: false,
        //createdAt: '',
        contactId: '',
        isFailed: false,
        pipelineId: 5,
        agencyCode: agency,
        carToBuyId: null,
        carId: null,
        carToRentId: null,
        emailId: null,
    })

    //ADD DEAL
    async function addDeal() {
        try {
            const params = {
                action: 'addLungoTermine',
                deal: deal
            };

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                },
                body: JSON.stringify(params) // Use body instead of params
            };

            const response = await fetch('/api/pipeline', options);
            const data = await response.json();

            setDeals((prevDeals: any) => [...prevDeals, data.data[0]])

            toast('Affare aggiunto correttamente');
            addDealTogglePopup()

        } catch (error) {
            toast('Qualcosa è andato storto: ', error ? error : "");
        } finally {
            //UPDATE DEALS
            //success toast
        }
    }

    return (
        <>
            <Toaster />
            {isOpenSelectContacts && (
                <div

                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
                    onClick={togglePopupSelectContacts} // Close the popup when clicking outside
                >
                    <div className="relative h-[98%] w-[98%]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={togglePopupSelectContacts}
                                className="absolute top-1 right-1 px-4 py-2 rounded"
                            >
                                <X />
                            </motion.button>
                            <ContactsManager session={session} agency={agency} setContactName={setContactName} setDeal={setDeal} setNewActivity={null} setExtendedActivity={null} extendedActivity={null} togglePopupSelectCars={togglePopupSelectContacts} />
                        </motion.div>
                    </div>
                </div>
            )}
            {isOpenSelectSellers && (
                <div

                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-xl"
                    onClick={togglePopupSelectSellers} // Close the popup when clicking outside
                >
                    <div className="relative h-[98%] w-[98%]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-100 rounded-2xl h-full w-full p-6 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={togglePopupSelectSellers}
                                className="absolute top-1 right-1 px-4 py-2 rounded"
                            >
                                <X />
                            </motion.button>
                            <SellersSelection setDeal={setDeal} sellers={sellers} setSeller={setSeller} togglePopupSelectSellers={togglePopupSelectSellers} />
                        </motion.div>
                    </div>
                </div>
            )}
            <div className="w-full mx-auto pt-2 mt-5">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="flex gap-2 items-center w-full">
                        <p className="text-2xl font-semilight mb-2">Aggiungi affare</p>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="rounded-2xl border border-slate-200">
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="mb-1 font-light">Contatto</p>
                                <motion.button onClick={togglePopupSelectContacts} whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }} className="mt-2 mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white">{contactName == "" ? "Assegna contatto" : "Contatto assegnato: " + contactName}</motion.button>
                            </div>
                            <div>
                                <p className="mb-1 font-light">Venditore</p>
                                <motion.button onClick={togglePopupSelectSellers} whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }} className="mt-2 mb-2 rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white">{!seller ? "Assegna venditore" : "Venditore assegnato: " + seller?.name}</motion.button>
                            </div>
                        </div>
                        <p className="mb-1 font-light">Titolo</p>
                        <input className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3" value={deal.title} onChange={(e) => setDeal((prevState) => ({
                            ...prevState,
                            title: e.target.value
                        }))} />
                        <p className="mb-2 mt-2 font-light">Fase della pipeline</p>
                        <div className="mb-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
                            <motion.div onClick={() => setDeal((prevState) => ({
                                ...prevState,
                                stageId: 20
                            }))} className={`rounded-2xl ${deal.stageId == 20 ? "bg-yellow-500 text-white" : "bg-slate-200 hover:text-white"} hover:cursor-pointer p-4 hover:bg-yellow-500`} whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.9 }}>
                                Da preventivare
                            </motion.div>
                            <motion.div onClick={() => setDeal((prevState) => ({
                                ...prevState,
                                stageId: 21
                            }))} className={`rounded-2xl ${deal.stageId == 21 ? "bg-yellow-500 text-white" : "bg-slate-200 hover:text-white"} hover:cursor-pointer p-4 hover:bg-yellow-500`} whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.9 }}>
                                Ricevuta documentazione
                            </motion.div>
                            <motion.div onClick={() => setDeal((prevState) => ({
                                ...prevState,
                                stageId: 22
                            }))} className={`rounded-2xl ${deal.stageId == 22 ? "bg-yellow-500 text-white" : "bg-slate-200 hover:text-white"} hover:cursor-pointer p-4 hover:bg-yellow-500`} whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.9 }}>
                                In attesa di esito
                            </motion.div>
                            <motion.div onClick={() => setDeal((prevState) => ({
                                ...prevState,
                                stageId: 23
                            }))} className={`rounded-2xl ${deal.stageId == 23 ? "bg-yellow-500 text-white" : "bg-slate-200 hover:text-white"} hover:cursor-pointer p-4 hover:bg-yellow-500`} whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.9 }}>
                                Esitata
                            </motion.div>
                        </div>
                        <motion.button onClick={addDeal} whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }} className="mt-5 rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white">Crea noleggio</motion.button>
                    </div>
                </div>
            </div >
        </>
    )
}
